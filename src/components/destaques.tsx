import { Image } from "expo-image";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from "react-native";

import { DetalheProduto } from "@/components/detalhe-produto";
import type { IconeNome } from "@/components/icone";
import { Texto as Text } from "@/components/texto";
import { ProdutoArte } from "@/components/ui";
import { Cor } from "@/constants/theme";
import { CATEGORIAS, type Produto } from "@/data/cardapio";
import { brl } from "@/lib/conta";
import { usePedido } from "@/store/pedido";

type ProdutoDestaque = Produto & { icone: IconeNome };

export function Destaques({ produtos }: { produtos: ProdutoDestaque[] }) {
  const [produtoId, setProdutoId] = useState("x-bacon");
  const [detalhes, setDetalhes] = useState(false);
  const [largura, setLargura] = useState(0);
  const inicioToque = useRef<{ x: number; y: number } | null>(null);
  const pedido = usePedido();
  const iniciarToque = ({ nativeEvent }: GestureResponderEvent) => {
    inicioToque.current = { x: nativeEvent.pageX, y: nativeEvent.pageY };
  };
  const abrirDetalhes = ({ nativeEvent }: GestureResponderEvent) => {
    const inicio = inicioToque.current;
    if (
      inicio &&
      Math.hypot(nativeEvent.pageX - inicio.x, nativeEvent.pageY - inicio.y) > 12
    ) return;
    setDetalhes(true);
  };
  const mudarProduto = useCallback(
    (delta: number) => {
      if (produtos.length < 2) return;
      setProdutoId((atual) => {
        const indiceAtual = Math.max(0, produtos.findIndex((p) => p.id === atual));
        return produtos[(indiceAtual + delta + produtos.length) % produtos.length].id;
      });
    },
    [produtos],
  );
  const deslizar = useMemo(() =>
    PanResponder.create({
      // Só assume movimentos horizontais; deixa toques e rolagem vertical livres.
      onMoveShouldSetPanResponderCapture: (_, gesto) =>
        produtos.length > 1 &&
        gesto.numberActiveTouches === 1 &&
        Math.abs(gesto.dx) > 12 &&
        Math.abs(gesto.dx) > Math.abs(gesto.dy) * 1.5,
      onPanResponderRelease: (_, gesto) => {
        if (
          Math.abs(gesto.dx) < 44 ||
          Math.abs(gesto.dx) <= Math.abs(gesto.dy) * 1.5
        ) return;
        mudarProduto(gesto.dx < 0 ? 1 : -1);
      },
    }),
    [mudarProduto, produtos.length],
  );
  const indice = Math.max(0, produtos.findIndex((p) => p.id === produtoId));
  const produto = produtos[indice];
  const amplo = largura >= 760;
  if (!produto) return null;

  const categoria = CATEGORIAS.find(
    (c) => c.id !== "destaques" && c.produtos.some((p) => p.id === produto.id),
  );

  return (
    <View onLayout={({ nativeEvent }) => setLargura(nativeEvent.layout.width)}>
      <View
        {...deslizar.panHandlers}
        testID="destaque-principal"
        style={[s.principal, amplo && s.principalAmplo]}
      >
        <View style={s.fundo}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ver foto de ${produto.nome}`}
            accessibilityHint="Abre os detalhes para escolher a quantidade e adicionar ao pedido"
            onPressIn={iniciarToque}
            onPress={abrirDetalhes}
            style={StyleSheet.absoluteFill}
          >
            <View style={[s.foto, amplo ? s.fotoAmpla : s.fotoMobile]}>
              {produto.imagem ? (
                <Image
                  source={produto.imagem}
                  contentFit="cover"
                  contentPosition="center"
                  transition={180}
                  recyclingKey={produto.id}
                  draggable={false}
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <ProdutoArte produto={produto} icone={produto.icone} style={s.capa} />
              )}
            </View>
          </Pressable>
          <View
            pointerEvents="none"
            style={[s.sombra, amplo ? s.sombraAmpla : s.sombraMobile]}
          />
          {amplo && <View pointerEvents="none" style={s.sombraBase} />}
        </View>

        <View pointerEvents="none" style={[s.topo, amplo && s.topoAmplo]}>
          <View style={s.categoria}>
            <View style={s.pontoCategoria} />
            <Text style={s.categoriaTexto}>{categoria?.nome ?? "Da casa"}</Text>
          </View>
          {produto.tag && (
            <View style={s.tag}>
              <Text style={s.tagTexto}>{produto.tag}</Text>
            </View>
          )}
        </View>

        <View pointerEvents="none" style={s.espacoFoto} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver detalhes de ${produto.nome}`}
          accessibilityHint="Escolha a quantidade e adicione o produto ao pedido"
          onPressIn={iniciarToque}
          onPress={abrirDetalhes}
          style={({ pressed }) => [
            s.informacoes,
            amplo && s.informacoesAmplas,
            pressed && s.pressionado,
          ]}
        >
          <View style={s.tituloLinha}>
            <Text
              accessibilityRole="header"
              style={[s.nome, amplo && s.nomeAmplo]}
            >
              {produto.nome}
            </Text>
            <Text style={s.detalhesSeta}>↗</Text>
          </View>
          <Text style={[s.descricao, amplo && s.descricaoAmpla]}>
            {produto.descricao}
          </Text>
          <Text style={[s.preco, amplo && s.precoAmplo]}>
            {brl(produto.preco)}
          </Text>
        </Pressable>

        <View style={[s.rodape, amplo && s.rodapeAmplo]}>
          <View
            accessible
            accessibilityLabel={`Destaque ${indice + 1} de ${produtos.length}`}
            style={s.paginacao}
          >
            <Text style={s.contagem}>
              {String(indice + 1).padStart(2, "0")}
              <Text style={s.contagemTotal}>
                {" / "}{String(produtos.length).padStart(2, "0")}
              </Text>
            </Text>
            <View style={s.indicadores}>
              {produtos.map((p, i) => (
                <View key={p.id} style={[s.indicador, i === indice && s.indicadorAtivo]} />
              ))}
            </View>
          </View>
          <View style={s.setas}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Destaque anterior"
              onPress={() => mudarProduto(-1)}
              style={({ pressed }) => [s.seta, pressed && s.pressionado]}
            >
              <Text style={s.setaTexto}>‹</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Próximo destaque"
              onPress={() => mudarProduto(1)}
              style={({ pressed }) => [s.seta, pressed && s.pressionado]}
            >
              <Text style={s.setaTexto}>›</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {detalhes && (
        <DetalheProduto
          key={produto.id}
          produto={produto}
          onFechar={() => setDetalhes(false)}
          onAdicionar={(qtd) => pedido.mudarQtd(produto.id, qtd)}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  principal: {
    minHeight: 520,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#111315",
  },
  principalAmplo: { minHeight: 560, borderRadius: 28 },
  fundo: { ...StyleSheet.absoluteFill },
  foto: { ...StyleSheet.absoluteFill },
  fotoMobile: { bottom: 72 },
  fotoAmpla: { left: "25%" },
  capa: { width: "100%", height: "100%" },
  sombra: { ...StyleSheet.absoluteFill },
  sombraMobile: {
    backgroundImage:
      "linear-gradient(180deg, rgba(9,12,15,0.18) 0%, rgba(9,12,15,0) 24%, rgba(9,12,15,0.28) 45%, rgba(9,12,15,0.82) 66%, rgba(9,12,15,0.98) 90%)",
  },
  sombraAmpla: {
    backgroundImage:
      "linear-gradient(90deg, #111315 0%, #111315 28%, rgba(17,19,21,0.85) 44%, rgba(17,19,21,0.12) 72%, rgba(17,19,21,0.08) 100%)",
  },
  sombraBase: {
    ...StyleSheet.absoluteFill,
    backgroundImage:
      "linear-gradient(180deg, rgba(17,19,21,0) 65%, rgba(17,19,21,0.85) 100%)",
  },
  topo: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  topoAmplo: { paddingHorizontal: 36, paddingTop: 28 },
  categoria: { flexDirection: "row", alignItems: "center", gap: 8 },
  pontoCategoria: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#83ACFF" },
  categoriaTexto: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(17,19,21,0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  tagTexto: { color: "#F2F4F8", fontSize: 10, fontWeight: "500" },
  espacoFoto: { flex: 1, minHeight: 170 },
  informacoes: { width: "100%", paddingHorizontal: 20, paddingBottom: 24, gap: 8 },
  informacoesAmplas: { maxWidth: 520, paddingHorizontal: 36, paddingBottom: 32, gap: 12 },
  tituloLinha: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 16 },
  nome: { flex: 1, color: Cor.branco, fontSize: 28, lineHeight: 34, fontWeight: "700" },
  nomeAmplo: { fontSize: 42, lineHeight: 48 },
  detalhesSeta: { color: "#A9AFB8", fontSize: 20 },
  descricao: { color: "#CDD1D8", fontSize: 13, lineHeight: 22 },
  descricaoAmpla: { fontSize: 14, lineHeight: 24 },
  preco: { marginTop: 8, color: Cor.branco, fontSize: 26, fontWeight: "600", fontVariant: ["tabular-nums"] },
  precoAmplo: { fontSize: 30 },
  rodape: {
    marginHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rodapeAmplo: { marginHorizontal: 36, paddingBottom: 24 },
  paginacao: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 16 },
  contagem: { color: Cor.branco, fontSize: 11, fontWeight: "600", fontVariant: ["tabular-nums"] },
  contagemTotal: { color: "#A0A6AF", fontWeight: "400" },
  indicadores: { flexDirection: "row", alignItems: "center", gap: 5 },
  indicador: { width: 4, height: 4, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.35)" },
  indicadorAtivo: { width: 20, backgroundColor: Cor.branco },
  setas: { flexDirection: "row", gap: 8 },
  seta: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(17,19,21,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  setaTexto: { color: Cor.branco, fontSize: 27, lineHeight: 34 },
  pressionado: { opacity: 0.7 },
});
