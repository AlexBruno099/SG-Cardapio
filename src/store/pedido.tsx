import { createContext, use, useState, type ReactNode } from "react";

import { PRODUTOS } from "@/data/cardapio";
import { normalizarMesa } from "@/lib/mesa";

export type Lancamento = {
  mesa: string;
  produtoId: string;
  nome: string;
  preco: number;
  qtd: number;
  hora: string;
};

// Estado só em memória — sem API, a conta zera se o app reiniciar.
// Quando houver backend, os pedidos e as solicitações viram chamadas de rede.
function usePedidoEstado() {
  const [mesa, setMesa] = useState<string | null>(null);
  const [carrinho, setCarrinho] = useState<Record<string, number>>({});
  const [conta, setConta] = useState<Lancamento[]>([]);
  const [solicitacaoGarcom, setSolicitacaoGarcom] = useState<{
    mesa: string;
    solicitadaEm: number;
  } | null>(null);
  const [contaPedida, setContaPedida] = useState(false);

  const mudarQtd = (id: string, delta: number) =>
    setCarrinho(({ [id]: atual = 0, ...resto }) => {
      const qtd = atual + delta;
      return qtd > 0 ? { ...resto, [id]: qtd } : resto;
    });

  const itensCarrinho = Object.entries(carrinho).map(([id, qtd]) => ({
    ...PRODUTOS[id],
    qtd,
  }));

  const enviar = () => {
    if (!mesa || !itensCarrinho.length) return;
    const hora = new Date().toTimeString().slice(0, 5);
    setConta((c) => [
      ...c,
      ...itensCarrinho.map((p) => ({
        mesa,
        produtoId: p.id,
        nome: p.nome,
        preco: p.preco,
        qtd: p.qtd,
        hora,
      })),
    ]);
    setCarrinho({});
    setContaPedida(false);
  };

  return {
    mesa,
    abrirMesa: (numero: string) => {
      const identificada = normalizarMesa(numero);
      if (!identificada || (mesa && mesa !== identificada)) return false;
      setMesa(identificada);
      return true;
    },
    carrinho,
    itensCarrinho,
    qtdNoCarrinho: itensCarrinho.reduce((s, i) => s + i.qtd, 0),
    mudarQtd,
    remover: (id: string) => mudarQtd(id, -(carrinho[id] ?? 0)),
    conta,
    enviar,
    solicitacaoGarcom,
    chamarGarcom: () => {
      if (mesa) setSolicitacaoGarcom({ mesa, solicitadaEm: Date.now() });
    },
    contaPedida,
    pedirConta: () => {
      if (mesa && conta.length) setContaPedida(true);
    },
  };
}

const PedidoContext = createContext<ReturnType<typeof usePedidoEstado> | null>(
  null,
);

export function PedidoProvider({ children }: { children: ReactNode }) {
  return <PedidoContext value={usePedidoEstado()}>{children}</PedidoContext>;
}

export function usePedido() {
  const ctx = use(PedidoContext);
  if (!ctx) throw new Error("usePedido fora do PedidoProvider");
  return ctx;
}
