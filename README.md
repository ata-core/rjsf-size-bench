# rjsf-size-bench

How much JavaScript a react-jsonschema-form page sends for validation.

One sign-up form (`schema.json`), bundled with esbuild (minified, gzip) in five ways:

- no validator
- the runtime validator from `@rjsf/validator-ajv8`
- the runtime validator from `@rjsf/validator-ata`
- the schema compiled at build time with `@rjsf/validator-ata`, imported from the package's main entry
- the same, with `createPrecompiledValidator` imported directly

```bash
npm install
npm run size
```

Versions are pinned in `package.json`, so the numbers repeat. The compiled rows need `ata-validator` 1.55.0 or newer: older versions left a helper out of compiled code, and a one-character value under `minLength: 1` threw.
