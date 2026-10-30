import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { DetalheProduto } from "@/components/detalhe-produto";
import { type IconeNome } from "@/components/icone";
import { Texto as Text } from "@/components/texto";
import { ProdutoArte, Stepper } from "@/components/ui";
import { Cor } from "@/constants/theme";
import { CATEGORIAS, type Produto } from "@/data/cardapio";
import type { ModoProdutos } from "@/components/grade-produtos";
import { brl } from "@/lib/conta";

export function ProdutoCard({
  produto,
  quantidade,
  onMudar,
  modo = "grade",
  compacto = false,
}: {
  produto: Produto & { icone: IconeNome };
  quantidade: number;
  onMudar: (delta: number) => void;
  modo?: ModoProdutos;
  compacto?: boolean;
}) {
  const [detalhes, setDetalhes] = useState(false);
  const emLista = modo === "lista";
  const categoria = CATEGORIAS.find(
    (c) => c.id !== "destaques" && c.produtos.some((p) => p.id === produto.id),
  );
  return (
    <View style={[s.card, emLista && s.cardLista]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver foto de ${produto.nome}`}
        onPress={() => setDetalhes(true)}
        style={emLista ? s.imagemLista : s.imagem}
      >
        <ProdutoArte produto={produto} icone={produto.icone} style={s.foto} />
        {!emLista && (
          <View style={s.selo}>
            <Text numberOfLines={1} style={s.seloTexto}>
              {categoria?.nome}
            </Text>
          </View>
        )}
      </Pressable>
      <View
        style={[
          s.corpo,
          emLista && s.corpoLista,
          emLista &&
            compacto && { flexDirection: "column", alignItems: "stretch" },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver detalhes de ${produto.nome}`}
          onPress={() => setDetalhes(true)}
          style={s.informacoes}
        >
          <Text
            numberOfLines={2}
            style={[
              s.nome,
              compacto && !emLista && { fontSize: 12 },
              emLista && s.nomeLista,
            ]}
          >
            {produto.nome}
          </Text>
          {emLista && (
            <Text numberOfLines={2} style={s.descricao}>
              {produto.descricao}
            </Text>
          )}
          <Text style={[s.preco, compacto && { fontSize: 16 }]}>
            {brl(produto.preco)}
          </Text>
        </Pressable>
        <View style={[s.acoes, emLista && s.acoesLista]}>
          {quantidade > 0 ? (
            <Stepper valor={quantidade} onMudar={onMudar} />
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Adicionar ${produto.nome}`}
              onPress={() => onMudar(1)}
              style={({ pressed }) => [
                s.adicionar,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={s.adicionarTexto}>Adicionar</Text>
            </Pressable>
          )}
        </View>
      </View>
      {detalhes && (
        <DetalheProduto
          produto={produto}
          onFechar={() => setDetalhes(false)}
          onAdicionar={onMudar}
        />
      )}
    </View>
  );
}
const s = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Cor.branco,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Cor.linha,
    boxShadow: "0 2px 3px rgba(15,23,42,0.05)",
  },
  cardLista: { flexDirection: "row", padding: 14, gap: 16, borderRadius: 18 },
  imagem: { width: "100%", aspectRatio: 1.15 },
  imagemLista: {
    width: 104,
    height: 112,
    borderRadius: 12,
    overflow: "hidden",
  },
  foto: { width: "100%", height: "100%" },
  selo: {
    position: "absolute",
    top: 8,
    right: 8,
    maxWidth: "88%",
    backgroundColor: Cor.azul,
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  seloTexto: { color: Cor.branco, fontSize: 9 },
  corpo: { flex: 1, padding: 12, gap: 10 },
  corpoLista: {
    padding: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
  },
  informacoes: { flex: 1, gap: 4 },
  nome: { color: Cor.texto, fontSize: 13, lineHeight: 20, minHeight: 40 },
  nomeLista: { fontSize: 14, fontWeight: "500", minHeight: 0 },
  descricao: { color: Cor.suave, fontSize: 12, lineHeight: 20, maxWidth: 600 },
  preco: {
    color: Cor.azul,
    fontSize: 18,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  acoes: {
    marginTop: "auto",
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  acoesLista: { width: 130 },
  adicionar: {
    width: "100%",
    minHeight: 44,
    backgroundColor: Cor.azul,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  adicionarTexto: { color: Cor.branco, fontSize: 12 },
});
