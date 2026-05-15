const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const smoothTransition = {
  duration: 0.75,
  ease: easeOut,
};

export const smoothTransitionFast = {
  duration: 0.6,
  ease: easeOut,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: smoothTransition },
};

export const fadeUpSmall = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: smoothTransitionFast },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggerContainerSlow = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

export const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

export const heroItemSubtitle = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};
