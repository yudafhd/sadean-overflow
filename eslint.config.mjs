// ESLint flat config for Next.js 16
import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  ...next,
  ...nextCoreWebVitals,
];

export default config;
