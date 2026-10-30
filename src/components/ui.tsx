import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { Texto as Text } from "@/components/texto";

import { Icone, type IconeNome } from "@/components/icone";
import { Cor, Fonte, Raio } from "@/constants/theme";
import type { Produto } from "@/data/cardapio";

export function Botao({
  titulo,
  onPress,
  tipo = "primario",
  desabilitado,
  style,
}: {
  titulo: string;
  onPress: () => void;
  tipo?: "primario" | "secundario";
  desabilitado?: boolean;
  style?: ViewStyle;
}) {
  const primario = tipo === "primario";
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!desabilitado }}
      style={({ pressed }) => [
        s.botao,
        { backgroundColor: primario ? Cor.azul : Cor.claro },
        desabilitado && { opacity: 0.45 },
        pressed && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <Text style={[s.botaoTexto, { color: primario ? Cor.branco : Cor.azul }]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

export function Stepper({
  valor,
  onMudar,
  min = 0,
  grande,
  escuro,
}: {
  valor: number;
  onMudar: (delta: number) => void;
  min?: number;
  grande?: boolean;
  escuro?: boolean;
}) {
  const bola = { width: 44, height: 44, borderRadius: 22 };
  return (
    <View style={s.stepper}>
      <Pressable
        onPress={() => onMudar(-1)}
        disabled={valor <= min}
        accessibilityRole="button"
        accessibilityLabel="Diminuir"
        accessibilityState={{ disabled: valor <= min }}
        style={[s.stepBtn, bola, valor <= min && { opacity: 0.35 }]}
      >
        <Icone nome="menos" tam={grande ? 24 : 18} cor={Cor.texto} />
      </Pressable>
      <Text
        style={[
          s.stepValor,
          escuro && { color: Cor.branco },
          grande && {
            fontSize: 30,
            minWidth: 56,
            height: 56,
            lineHeight: 56,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: Cor.azul,
            color: Cor.branco,
          },
        ]}
      >
        {valor}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => onMudar(1)}
        accessibilityLabel="Aumentar"
        style={[s.stepBtn, bola]}
      >
        <Icone nome="mais" tam={grande ? 24 : 18} cor={Cor.texto} />
      </Pressable>
    </View>
  );
}

// Produtos sem foto usam um espaço neutro, sem imagens de outros pratos.
export function ProdutoArte({
  produto,
  icone,
  style,
}: {
  produto: Produto;
  icone: IconeNome;
  style?: ViewStyle;
}) {
  if (produto.imagem)
    return (
      <View style={[s.arte, style]}>
        <Image
          source={produto.imagem}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      </View>
    );
  return (
    <View style={[s.arte, style]}>
      <View style={s.arteIcone}>
        <Icone nome={icone} tam={34} cor={Cor.suave} />
      </View>
      <Text numberOfLines={1} style={s.arteMarca}>
        Foto em breve
      </Text>
    </View>
  );
}

export function Painel({
  visivel,
  titulo,
  subtitulo,
  onFechar,
  children,
  rodape,
  largura = 820,
  lateral = false,
  cabecalhoEscuro = false,
}: {
  visivel: boolean;
  titulo: string;
  subtitulo?: string;
  onFechar: () => void;
  children: ReactNode;
  rodape?: ReactNode;
  largura?: number;
  lateral?: boolean;
  cabecalhoEscuro?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
      supportedOrientations={["portrait", "landscape"]}
    >
      {visivel && lateral && cabecalhoEscuro && <StatusBar style="light" />}
      <View
        style={[
          s.fundo,
          {
            paddingTop: Math.max(16, insets.top),
            paddingBottom: Math.max(16, insets.bottom),
          },
          lateral && {
            alignItems: "flex-end",
            paddingHorizontal: 0,
            paddingTop: 0,
            paddingBottom: 0,
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onFechar}
          accessible={false}
          importantForAccessibility="no"
        />
        <View
          role="dialog"
          aria-modal
          accessibilityLabel={titulo}
          style={[
            s.painel,
            { maxWidth: largura },
            lateral && { height: "100%", maxHeight: "100%", borderRadius: 0 },
          ]}
        >
          <View
            style={[
              s.painelTopo,
              lateral && { paddingTop: 16 + insets.top },
              cabecalhoEscuro && {
                backgroundColor: Cor.azul,
                borderBottomWidth: 0,
              },
            ]}
          >
            <View style={{ flex: 1, gap: 5 }}>
              <Text
                style={[
                  s.painelTitulo,
                  cabecalhoEscuro && { color: Cor.branco },
                ]}
              >
                {titulo}
              </Text>
              {subtitulo && (
                <Text
                  style={[
                    s.painelSubtitulo,
                    cabecalhoEscuro && { color: "#D2D8DF" },
                  ]}
                >
                  {subtitulo}
                </Text>
              )}
            </View>
            <Pressable
              onPress={onFechar}
              style={[
                s.fechar,
                cabecalhoEscuro && {
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Icone
                nome="fechar"
                tam={22}
                cor={cabecalhoEscuro ? Cor.branco : Cor.suave}
              />
            </Pressable>
          </View>
          <ScrollView
            style={{ flexShrink: 1, flexGrow: lateral ? 1 : 0 }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
          {rodape && (
            <View
              style={[
                s.painelRodape,
                lateral && { paddingBottom: 20 + insets.bottom },
              ]}
            >
              {rodape}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  botao: {
    minHeight: 56,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoTexto: { fontSize: 14, fontWeight: "600", textAlign: "center" },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Cor.gelo,
    borderRadius: 22,
  },
  stepBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  stepMais: { backgroundColor: Cor.azul },
  stepValor: {
    minWidth: 20,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: Cor.texto,
    fontVariant: ["tabular-nums"],
  },
  arte: {
    overflow: "hidden",
    backgroundColor: Cor.gelo,
    justifyContent: "center",
    alignItems: "center",
  },
  arteIcone: {},
  arteMarca: {
    position: "absolute",
    bottom: 6,
    left: 8,
    right: 8,
    fontSize: 10,
    textAlign: "center",
    color: Cor.suave,
  },
  fundo: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.42)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  painel: {
    width: "100%",
    maxHeight: "92%",
    backgroundColor: Cor.papel,
    borderRadius: Raio.g,
    overflow: "hidden",
  },
  painelTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 12,
    backgroundColor: Cor.branco,
    borderBottomWidth: 1,
    borderBottomColor: Cor.linha,
  },
  painelTitulo: { color: Cor.texto, fontSize: 22, fontFamily: Fonte.titulo },
  painelSubtitulo: { color: Cor.suave, fontSize: 12 },
  fechar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Cor.gelo,
    borderWidth: 1,
    borderColor: Cor.linha,
  },
  painelRodape: {
    borderTopWidth: 1,
    borderTopColor: Cor.linha,
    padding: 20,
    backgroundColor: Cor.branco,
  },
});
