import { useEffect, useRef, type ComponentRef } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Icone } from "@/components/icone";
import { Texto as Text } from "@/components/texto";
import { Cor } from "@/constants/theme";
import { CASA, CATEGORIAS, GRUPOS_CARDAPIO } from "@/data/cardapio";

export const LARGURA_NAVEGACAO = 224;
const OPCOES = [
  { id: "todos", nome: "Todos", icone: "grade" as const },
  ...CATEGORIAS,
];

export function NavegacaoCardapio({
  categoriaId,
  buscando,
  largo,
  onSelecionar,
}: {
  categoriaId: string;
  buscando: boolean;
  largo: boolean;
  onSelecionar: (id: string) => void;
}) {
  const faixa = useRef<ComponentRef<typeof ScrollView>>(null);
  const posicoes = useRef<Record<string, number>>({});
  useEffect(() => {
    if (!largo)
      faixa.current?.scrollTo({
        x: Math.max(0, (posicoes.current[categoriaId] ?? 0) - 20),
        animated: true,
      });
  }, [categoriaId, largo]);

  if (!largo)
    return (
      <ScrollView
        ref={faixa}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.faixa}
        style={s.mobile}
      >
        {OPCOES.map((c) => {
          const ativo = !buscando && categoriaId === c.id;
          return (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              aria-pressed={ativo}
              accessibilityState={{ selected: ativo }}
              onPress={() => onSelecionar(c.id)}
              onLayout={({ nativeEvent }) => {
                posicoes.current[c.id] = nativeEvent.layout.x;
                if (categoriaId === c.id)
                  faixa.current?.scrollTo({
                    x: Math.max(0, nativeEvent.layout.x - 20),
                    animated: false,
                  });
              }}
              style={({ pressed }) => [
                s.chip,
                ativo && s.chipAtivo,
                pressed && { opacity: 0.75 },
              ]}
            >
              <Text style={[s.chipTexto, ativo && s.branco]}>{c.nome}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    );

  return (
    <View style={s.navegacao}>
      <View style={s.abertura}>
      </View>
      <ScrollView contentContainerStyle={s.grupos}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Categoria Todos"
          aria-pressed={!buscando && categoriaId === "todos"}
          accessibilityState={{
            selected: !buscando && categoriaId === "todos",
          }}
          onPress={() => onSelecionar("todos")}
          style={[
            s.categoria,
            categoriaId === "todos" && !buscando && s.categoriaAtiva,
          ]}
        >
          <Icone
            nome="grade"
            tam={19}
            cor={
              categoriaId === "todos" && !buscando ? Cor.branco : Cor.textoMenu
            }
          />
          <Text style={s.categoriaTexto}>Todos os produtos</Text>
        </Pressable>
        {GRUPOS_CARDAPIO.map((g) => (
          <View key={g.nome} style={s.grupo}>
            <Text style={s.grupoNome}>
              {g.nome === "Destaques" ? "RECOMENDADOS" : g.nome.toUpperCase()}
            </Text>
            {CATEGORIAS.filter((c) => g.categorias.includes(c.id)).map((c) => {
              const ativo = !buscando && c.id === categoriaId;
              return (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  aria-pressed={ativo}
                  accessibilityLabel={`Categoria ${c.nome}`}
                  accessibilityState={{ selected: ativo }}
                  onPress={() => onSelecionar(c.id)}
                  style={({ pressed }) => [
                    s.categoria,
                    ativo && s.categoriaAtiva,
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <Icone
                    nome={c.icone}
                    tam={19}
                    cor={ativo ? Cor.branco : Cor.textoMenu}
                  />
                  <Text style={s.categoriaTexto}>{c.nome}</Text>
                  <Text style={s.contagem}>{c.produtos.length}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
      <View style={s.assinatura}>
        <Text style={s.empresa}>{CASA.empresa}</Text>
        <Text style={s.assinaturaTexto}>Tecnologia para o seu negócio</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  navegacao: { width: LARGURA_NAVEGACAO, backgroundColor: Cor.menu },
  abertura: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 12,
  },
  aberturaIcone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Cor.escuro,
  },
  titulo: { color: Cor.branco, fontSize: 13, fontWeight: "600" },
  subtitulo: { color: Cor.textoMenu, fontSize: 9, marginTop: 3 },
  grupos: { paddingHorizontal: 12, paddingBottom: 24, gap: 20 },
  grupo: { gap: 4 },
  grupoNome: {
    color: "#8294B1",
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 1.1,
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  categoria: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  categoriaAtiva: { backgroundColor: Cor.escuro },
  categoriaTexto: { flex: 1, color: Cor.branco, fontSize: 12 },
  contagem: { color: Cor.textoMenu, fontSize: 10 },
  assinatura: {
    padding: 24,
    borderTopWidth: 1,
    borderColor: Cor.bordaMenu,
    gap: 4,
  },
  empresa: { color: Cor.branco, fontSize: 11, fontWeight: "600" },
  assinaturaTexto: { color: Cor.textoMenu, fontSize: 8 },
  mobile: {
    flexGrow: 0,
    backgroundColor: Cor.branco,
    borderBottomWidth: 1,
    borderColor: Cor.linha,
  },
  faixa: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Cor.gelo,
    borderRadius: 24,
  },
  chipAtivo: { backgroundColor: Cor.azul },
  chipTexto: { color: "#3F4859", fontSize: 13 },
  branco: { color: Cor.branco },
});
