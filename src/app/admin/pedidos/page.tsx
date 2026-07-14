"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrecio } from "@/lib/utils";

type Pedido = {
  id: string;
  producto: string;
  costo: number;
  precio_venta: number;
  cantidad: number;
  tipo: "encargo" | "stock";
  notas: string;
  created_at: string;
};

type FormData = {
  producto: string;
  costo: string;
  precio_venta: string;
  cantidad: string;
  tipo: "encargo" | "stock";
  notas: string;
};

const emptyForm: FormData = {
  producto: "",
  costo: "",
  precio_venta: "",
  cantidad: "1",
  tipo: "encargo",
  notas: "",
};

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todos" | "encargo" | "stock">("todos");
  const supabase = createClient();

  const loadPedidos = async () => {
    const { data } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });
    setPedidos(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  const filtered = filter === "todos" ? pedidos : pedidos.filter((p) => p.tipo === filter);

  const totalGeneral = filtered.reduce((acc, p) => acc + p.precio_venta * p.cantidad, 0);
  const costoGeneral = filtered.reduce((acc, p) => acc + p.costo * p.cantidad, 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.producto.trim()) return;
    setSaving(true);

    const payload = {
      producto: form.producto.trim(),
      costo: parseFloat(form.costo) || 0,
      precio_venta: parseFloat(form.precio_venta) || 0,
      cantidad: parseInt(form.cantidad) || 1,
      tipo: form.tipo,
      notas: form.notas.trim(),
    };

    if (editingId) {
      await supabase.from("pedidos").update(payload).eq("id", editingId);
    } else {
      await supabase.from("pedidos").insert(payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    setSaving(false);
    loadPedidos();
  };

  const handleEdit = (pedido: Pedido) => {
    setEditingId(pedido.id);
    setForm({
      producto: pedido.producto,
      costo: String(pedido.costo),
      precio_venta: String(pedido.precio_venta),
      cantidad: String(pedido.cantidad),
      tipo: pedido.tipo,
      notas: pedido.notas,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este pedido?")) return;
    await supabase.from("pedidos").delete().eq("id", id);
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    loadPedidos();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-andes-white">
        <p className="text-andes-mountain text-sm uppercase tracking-widest">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-andes-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light tracking-wider text-andes-black">Pedidos</h1>
          <p className="text-xs uppercase tracking-widest text-andes-mountain mt-1">
            {pedidos.length} item(s) registrado(s)
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8 border border-andes-snow p-6 bg-white">
          <h2 className="text-xs uppercase tracking-widest text-andes-mountain font-medium mb-4">
            {editingId ? "Editar pedido" : "Nuevo pedido"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
                Producto *
              </label>
              <input
                type="text"
                name="producto"
                value={form.producto}
                onChange={handleChange}
                required
                placeholder="Nombre del producto"
                className="w-full border border-andes-snow px-3 py-2 text-sm text-andes-black focus:outline-none focus:border-andes-ice"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
                Costo
              </label>
              <input
                type="number"
                name="costo"
                value={form.costo}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full border border-andes-snow px-3 py-2 text-sm text-andes-black focus:outline-none focus:border-andes-ice"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
                Precio venta
              </label>
              <input
                type="number"
                name="precio_venta"
                value={form.precio_venta}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full border border-andes-snow px-3 py-2 text-sm text-andes-black focus:outline-none focus:border-andes-ice"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
                Cantidad
              </label>
              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                min="1"
                className="w-full border border-andes-snow px-3 py-2 text-sm text-andes-black focus:outline-none focus:border-andes-ice"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
                Tipo *
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full border border-andes-snow px-3 py-2 text-sm text-andes-black focus:outline-none focus:border-andes-ice"
              >
                <option value="encargo">Encargo</option>
                <option value="stock">Stock</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
              Notas
            </label>
            <input
              type="text"
              name="notas"
              value={form.notas}
              onChange={handleChange}
              placeholder="Observaciones (opcional)"
              className="w-full border border-andes-snow px-3 py-2 text-sm text-andes-black focus:outline-none focus:border-andes-ice"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-andes-black text-andes-white text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Agregar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-andes-snow text-andes-mountain text-[10px] uppercase tracking-widest hover:border-andes-black transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {(["todos", "encargo", "stock"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
                filter === t
                  ? "bg-andes-black text-andes-white border-andes-black"
                  : "text-andes-mountain border-andes-snow hover:border-andes-black"
              }`}
            >
              {t === "todos" ? "Todos" : t === "encargo" ? "Encargos" : "Stock"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-andes-snow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-andes-snow/50">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Producto
                </th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Costo
                </th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Precio venta
                </th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Cantidad
                </th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Subtotal
                </th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Tipo
                </th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Notas
                </th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pedido) => (
                <tr
                  key={pedido.id}
                  className={`border-t border-andes-snow hover:bg-andes-snow/20 transition-colors ${
                    editingId === pedido.id ? "bg-andes-snow/30" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-andes-black font-medium">{pedido.producto}</td>
                  <td className="px-4 py-3 text-andes-mountain text-right">
                    {formatPrecio(pedido.costo)}
                  </td>
                  <td className="px-4 py-3 text-andes-mountain text-right">
                    {formatPrecio(pedido.precio_venta)}
                  </td>
                  <td className="px-4 py-3 text-center text-andes-mountain">{pedido.cantidad}</td>
                  <td className="px-4 py-3 text-andes-black font-medium text-right">
                    {formatPrecio(pedido.precio_venta * pedido.cantidad)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                        pedido.tipo === "encargo"
                          ? "text-andes-ice border-andes-ice"
                          : "text-green-700 border-green-700"
                      }`}
                    >
                      {pedido.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-andes-mountain text-xs">{pedido.notas}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(pedido)}
                        className="text-[10px] uppercase tracking-widest text-andes-ice hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pedido.id)}
                        className="text-[10px] uppercase tracking-widest text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-andes-mountain text-sm"
                  >
                    No hay pedidos registrados.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-andes-black bg-andes-snow/30">
                  <td className="px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                    Totales
                  </td>
                  <td className="px-4 py-3 text-right text-andes-mountain text-sm">
                    {formatPrecio(costoGeneral)}
                  </td>
                  <td className="px-4 py-3 text-right text-andes-mountain text-sm">
                    —
                  </td>
                  <td className="px-4 py-3 text-center text-andes-mountain text-sm">
                    {filtered.reduce((acc, p) => acc + p.cantidad, 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-andes-black font-medium text-sm">
                    {formatPrecio(totalGeneral)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
