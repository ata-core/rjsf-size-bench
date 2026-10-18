# rjsf-size-bench

How much JavaScript a react-jsonschema-form page sends for validation.

One sign-up form (`schema.json`), bundled with esbuild (minified, gzip) in five ways, and the ata runtime once more with chunk splitting:

- no validator
- the runtime validator from `@rjsf/validator-ajv8`
- the runtime validator from `@rjsf/validator-ata`
- the schema compiled at build time with `@rjsf/validator-ata`, imported from the package's main entry
- the same, with `createPrecompiledValidator` imported directly

```bash
npm install
npm run size
```

Versions are pinned in `package.json`, so the numbers repeat. Since 1.56.0 the ata runtime loads its code generator on demand in the browser: with chunk splitting (the default in Vite, webpack and Rollup) the first load carries the interpreter only, and the generator chunk loads later, only for a validator called a thousand times in a second. On 1.55.0 the runtime row was +134.7 KB, with or without splitting. The compiled rows need `ata-validator` 1.55.0 or newer: older versions left a helper out of compiled code, and a one-character value under `minLength: 1` threw.
