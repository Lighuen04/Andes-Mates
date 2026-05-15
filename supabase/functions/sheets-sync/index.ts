import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SHEETS_SECRET = Deno.env.get("SHEETS_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    const secret = req.headers.get("x-sheets-secret");

    if (secret !== SHEETS_SECRET) {
      return Response.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { action, payload } = await req.json();

    if (action === "sync_products") {
      const { data: products, error } = await supabase
        .from("products")
        .select("id, name, stock, price, is_active")
        .order("name", { ascending: true });

      if (error) {
        return Response.json({ ok: false, error: error.message });
      }

      return Response.json({
        ok: true,
        products,
      });
    }

    if (action === "update_stock") {
      const { product_id, amount } = payload;

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, stock")
        .eq("id", product_id)
        .single();

      if (productError || !product) {
        return Response.json({
          ok: false,
          error: "Producto no encontrado",
        });
      }

      const oldStock = Number(product.stock ?? 0);
      const newStock = oldStock + Number(amount);

      if (newStock < 0) {
        return Response.json({
          ok: false,
          error: "El stock no puede quedar en negativo",
        });
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", product_id);

      if (updateError) {
        return Response.json({
          ok: false,
          error: updateError.message,
        });
      }

      await supabase.from("stock_history").insert({
        product_id,
        old_stock: oldStock,
        new_stock: newStock,
        change_amount: Number(amount),
        source: "google_sheets",
      });

      return Response.json({
        ok: true,
        old_stock: oldStock,
        new_stock: newStock,
      });
    }

    return Response.json({
      ok: false,
      error: "Acción no soportada",
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});