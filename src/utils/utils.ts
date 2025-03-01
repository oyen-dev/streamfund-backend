import { init } from '@paralleldrive/cuid2';

const createId = init({
  fingerprint: process.env.FINGERPRINT!,
  length: 25,
  random: Math.random,
});

export const generateCustomId = (prefix: string): string => {
  return `${prefix}-${createId()}`;
};
