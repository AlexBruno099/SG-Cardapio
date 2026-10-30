// node scripts/check-mesa.mjs — contrato dos QR Codes aceitos pelo scanner.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const fonte = readFileSync(new URL('../src/lib/mesa.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(fonte, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { lerMesaQr, normalizarMesa } = await import('data:text/javascript,' + encodeURIComponent(js));

for (const codigo of [
  '7', '07', ' 0007 ', 'Mesa 7', 'MESA: 07', 'mesa #7',
  '{"mesa":7}', '{"mesa":"07"}',
  'sgcardapio://mesa/7', 'sgcardapio://mesa/07/',
  'https://cardapio.exemplo.com/?mesa=7',
  'https://cardapio.exemplo.com/?origem=cartao&mesa=07',
]) assert.equal(lerMesaQr(codigo), '07', codigo);

for (const codigo of [
  '', '0', '0000', '-7', '7.5', '10000', 'pedido 7', '7abc',
  '{', '{}', 'null', '{"mesa":null}', '{"mesa":true}', '{"mesa":0}',
  '{"mesa":[]}', '{"mesa":{}}', '{"mesa":"1e2"}',
  'https://exemplo.com/pedido/7', 'https://exemplo.com/?mesa=7&mesa=8',
  'https://exemplo.com/?mesa=', 'https://exemplo.com/?mesa=-7',
  'javascript:alert(7)', 'file:///mesa/7', 'sgcardapio://pedido/7',
  'sgcardapio://mesa/7/produto/8', 'x'.repeat(2049),
]) assert.equal(lerMesaQr(codigo), null, codigo);

assert.equal(normalizarMesa(9999), '9999');
assert.equal(normalizarMesa('0012'), '12');
assert.equal(normalizarMesa(undefined), null);
assert.equal(normalizarMesa(Infinity), null);
console.log('mesa QR ok');
