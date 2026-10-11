import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** Flat ESLint config — eslint-config-next ships native flat configs in v16. */
const config = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]
  },
  ...coreWebVitals,
  ...typescript
];

export default config;
