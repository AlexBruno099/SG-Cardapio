// node scripts/check-conta.mjs — confere a matemática da conta sem precisar de test runner.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const fonte = readFileSync(new URL('../src/lib/conta.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(fonte, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { brl, totais } = await import('data:text/javascript,' + encodeURIComponent(js));

assert.equal(brl(1290), 'R$ 12,90');
assert.equal(brl(123456), 'R$ 1.234,56');
assert.equal(brl(5), 'R$ 0,05');

const t = totais([{ preco: 2990, qtd: 2 }, { preco: 1290, qtd: 1 }], 3);
assert.deepEqual(t, { subtotal: 7270, total: 7270, porPessoa: 2424 });
assert.equal(totais([], 0).porPessoa, 0);

console.log('conta ok');
