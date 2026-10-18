// Builds the same form four ways and prints how much JavaScript each sends, gzipped.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import zlib from 'node:zlib'
import { compileSchemaValidatorsCode } from '@rjsf/validator-ata/compileSchemaValidators'

const schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'))
fs.writeFileSync('precompiled.cjs', compileSchemaValidatorsCode(schema, {}))

const rows = [
  ['no validator', 'app-none.jsx'],
  ['runtime validator (ajv8)', 'app-ajv.jsx'],
  ['runtime validator (ata)', 'app-ata.jsx'],
  ['ata compiled, main entry*', 'app-ata-compiled-main.jsx'],
  ['ata compiled, direct import', 'app-ata-compiled.jsx'],
]
fs.mkdirSync('out', { recursive: true })
const sizes = {}
for (const [name, entry] of rows) {
  const out = `out/${entry.replace('.jsx', '.js')}`
  execFileSync('node_modules/.bin/esbuild', [entry, '--bundle', '--minify', '--format=esm', '--platform=browser',
    '--define:process.env.NODE_ENV="production"', '--jsx=automatic', '--loader:.cjs=js', `--outfile=${out}`, '--log-level=error'])
  sizes[name] = zlib.gzipSync(fs.readFileSync(out), { level: 9 }).length / 1000
}
const base = sizes['no validator']
console.log('\nA sign-up form with react-jsonschema-form, gzipped\n')
console.log('                                 whole app   validation part')
for (const [name] of rows) {
  const part = name === 'no validator' ? '' : `+${(sizes[name] - base).toFixed(1)} KB`
  console.log(`  ${name.padEnd(30)} ${(sizes[name].toFixed(1) + ' KB').padStart(9)}   ${part}`)
}
console.log('* @rjsf/validator-ata 6.11.0 keeps the runtime in through its default export;\n  rjsf-team/react-jsonschema-form#5559 lets bundlers drop it, so the main entry\n  gives the direct-import size.\n')
