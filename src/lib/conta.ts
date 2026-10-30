// Dinheiro sempre em centavos (inteiro) para não acumular erro de ponto flutuante.

export function brl(centavos: number) {
  const [inteiro, cent] = (centavos / 100).toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${cent}`;
}

export function totais(itens: { preco: number; qtd: number }[], pessoas = 1) {
  const subtotal = itens.reduce((soma, i) => soma + i.preco * i.qtd, 0);
  const total = subtotal;
  return { subtotal, total, porPessoa: Math.ceil(total / Math.max(1, pessoas)) };
}
