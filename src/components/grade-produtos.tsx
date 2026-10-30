import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ProdutoCard } from "@/components/produto-card";
import type { IconeNome } from "@/components/icone";
import type { Produto } from "@/data/cardapio";
import { usePedido } from "@/store/pedido";

export type ModoProdutos = "grade" | "lista";
export function GradeProdutos({
  produtos,
  largura: larguraDefinida,
  modo = "grade",
}: {
  produtos: (Produto & { icone: IconeNome })[];
  largura?: number;
  modo?: ModoProdutos;
}) {
  const [medida, setLargura] = useState(0);
  const largura = larguraDefinida ?? medida;
  const pedido = usePedido();
  const colunas =
    modo === "lista"
      ? 1
      : largura >= 1120
        ? 5
        : largura >= 860
          ? 4
          : largura >= 600
            ? 3
            : largura >= 290
              ? 2
              : 1;
  const larguraCard =
    largura > 0 ? (largura - (colunas - 1) * 12) / colunas : undefined;
  return (
    <View
      style={s.grade}
      onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
    >
      {produtos.map((p) => (
        <View key={p.id} style={{ width: larguraCard ?? "100%" }}>
          <ProdutoCard
            produto={p}
            quantidade={pedido.carrinho[p.id] ?? 0}
            onMudar={(d) => pedido.mudarQtd(p.id, d)}
            modo={modo}
            compacto={
              modo === "lista" ? largura < 560 : (larguraCard ?? 200) < 180
            }
          />
        </View>
      ))}
    </View>
  );
}
const s = StyleSheet.create({
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "stretch",
  },
});
