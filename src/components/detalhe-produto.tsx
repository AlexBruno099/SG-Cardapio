import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Texto as Text } from "@/components/texto";
import { Botao, Painel, ProdutoArte, Stepper } from "@/components/ui";
import type { IconeNome } from "@/components/icone";
import { Cor, Fonte } from "@/constants/theme";
import type { Produto } from "@/data/cardapio";
import { brl } from "@/lib/conta";

export function DetalheProduto({
  produto,
  onFechar,
  onAdicionar,
}: {
  produto: Produto & { icone: IconeNome };
  onFechar: () => void;
  onAdicionar: (qtd: number) => void;
}) {
  const [quantidade, setQuantidade] = useState(1);
  return (
    <Painel
      visivel
      titulo="Detalhes do prato"
      largura={560}
      onFechar={onFechar}
      rodape={
        <View style={s.rodape}>
          <Stepper
            valor={quantidade}
            min={1}
            onMudar={(d) => setQuantidade((q) => Math.max(1, q + d))}
          />
          <Botao
            titulo={`Adicionar · ${brl(produto.preco * quantidade)}`}
            onPress={() => {
              onAdicionar(quantidade);
              onFechar();
            }}
            style={{ flex: 1, minWidth: 176, paddingHorizontal: 10 }}
          />
        </View>
      }
    >
      <ProdutoArte produto={produto} icone={produto.icone} style={s.foto} />
      <View style={s.conteudo}>
        {produto.tag && <Text style={s.tag}>{produto.tag}</Text>}
        <View style={s.tituloLinha}>
          <Text style={s.titulo}>{produto.nome}</Text>
          <Text style={s.preco}>{brl(produto.preco)}</Text>
        </View>
        <Text style={s.descricao}>{produto.descricao}</Text>
      </View>
    </Painel>
  );
}
const s = StyleSheet.create({
  foto: { height: 240, width: "100%" },
  conteudo: { padding: 24, gap: 14 },
  tag: { color: Cor.azul, fontSize: 11, fontWeight: "700" },
  tituloLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  titulo: {
    color: Cor.texto,
    fontSize: 22,
    fontFamily: Fonte.titulo,
    flexShrink: 1,
  },
  preco: { color: Cor.azul, fontSize: 22, fontWeight: "600" },
  descricao: { color: Cor.suave, fontSize: 14, lineHeight: 23 },
  rodape: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "center",
  },
});
