import { Transition } from 'framer-motion';

export const STANDARD_EASE = [0.22, 1, 0.36, 1] as const;

export const transitionFast: Transition = {
  duration: 0.18,
  ease: STANDARD_EASE,
};

export const transitionMedium: Transition = {
  duration: 0.24,
  ease: STANDARD_EASE,
};

export const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: transitionMedium,
};

export const listItemMotion = (index: number = 0) => ({
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.2,
    ease: STANDARD_EASE,
    delay: Math.min(index * 0.03, 0.18),
  },
});

export const messageEntranceMotion = {
  initial: { opacity: 0, y: 6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: transitionFast,
};
