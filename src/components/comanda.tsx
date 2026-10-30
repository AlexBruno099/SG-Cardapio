import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icone } from "@/components/icone";
import { Texto as Text } from "@/components/texto";
import { Cor, Fonte } from "@/constants/theme";
import { lerMesaQr } from "@/lib/mesa";

const CONFIGURACAO_QR = { barcodeTypes: ["qr" as const] };

type Props = {
  visivel: boolean;
  onFechar: () => void;
  onConfirmar: (mesa: string) => void;
};

// Desmontar o leitor libera a câmera e reinicia a leitura a cada abertura.
export function Comanda({ visivel, ...props }: Props) {
  return visivel ? <LeitorComanda {...props} /> : null;
}

function LeitorComanda({ onFechar, onConfirmar }: Omit<Props, "visivel">) {
  const [permissao, solicitarPermissao, atualizarPermissao] =
    useCameraPermissions();
  const [estadoApp, setEstadoApp] = useState(AppState.currentState);
  const [camera, setCamera] = useState<CameraType>("back");
  const [pronta, setPronta] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [qrInvalido, setQrInvalido] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [solicitando, setSolicitando] = useState(false);
  const leituraConcluida = useRef(false);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const largo = width >= 700;
  const emPrimeiroPlano = !estadoApp || estadoApp === "active";

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (estado) => {
      setEstadoApp(estado);
      if (estado === "active") {
        void atualizarPermissao().catch(() => {
          setErro(
            "Não foi possível verificar o acesso à câmera. Tente novamente.",
          );
        });
      } else {
        setPronta(false);
      }
    });
    return () => subscription.remove();
  }, [atualizarPermissao]);

  const permitirCamera = async () => {
    setSolicitando(true);
    setErro(null);
    try {
      if (permissao && !permissao.canAskAgain && Platform.OS !== "web") {
        await Linking.openSettings();
      } else {
        await solicitarPermissao();
      }
    } catch {
      setErro(
        "Não foi possível acessar a câmera. Verifique a permissão e tente novamente.",
      );
    } finally {
      setSolicitando(false);
    }
  };

  const tentarNovamente = () => {
    leituraConcluida.current = false;
    setQrInvalido(false);
    setErro(null);
    setPronta(false);
    setTentativa((atual) => atual + 1);
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onFechar}
      supportedOrientations={["portrait", "landscape"]}
      statusBarTranslucent
    >
      <StatusBar style="light" />
      <View
        role="dialog"
        aria-modal
        accessibilityLabel="Escanear QR Code para abrir a mesa"
        style={s.fundo}
      >
        <View
          style={[
            s.topo,
            {
              paddingTop: Math.max(insets.top, 16),
              paddingLeft: Math.max(insets.left, 24),
              paddingRight: Math.max(insets.right, 24),
            },
          ]}
        >
          <View style={s.identificacao}>
            <Icone nome="qr" tam={20} cor={Cor.branco} />
            <Text style={s.topoTexto}>ABRIR MINHA COMANDA</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar leitor de QR Code"
            onPress={onFechar}
            style={({ pressed }) => [s.fechar, pressed && s.pressionado]}
          >
            <Icone nome="fechar" tam={28} cor={Cor.branco} />
          </Pressable>
        </View>

        <ScrollView
          style={s.rolagem}
          contentContainerStyle={[
            s.conteudo,
            {
              paddingBottom: Math.max(insets.bottom, 24),
              paddingLeft: Math.max(insets.left, 24),
              paddingRight: Math.max(insets.right, 24),
            },
          ]}
        >
          <View style={[s.corpo, largo && s.corpoLargo]}>
            <View style={[s.instrucoes, largo && s.instrucoesLargas]}>
              <View style={s.icone}>
                <Icone nome="qr" tam={56} cor={Cor.branco} />
              </View>
              <Text accessibilityRole="header" style={s.titulo}>
                Confirme sua comanda
              </Text>
              <Text style={s.descricao}>
                Aponte a câmera para o QR Code da sua mesa ou do cartão da
                comanda.
              </Text>
              <Text style={s.ajuda}>
                Encaixe o código na moldura. Assim que ele for identificado, sua
                mesa será aberta automaticamente.
              </Text>
              <View style={s.dica}>
                <View style={s.ponto} />
                <Text style={s.dicaTexto}>
                  Mantenha o código parado e bem iluminado
                </Text>
              </View>
            </View>

            <View style={s.leitura}>
              <View
                testID="camera-comanda"
                style={[
                  s.camera,
                  {
                    height: Math.max(
                      !permissao?.granted || erro || qrInvalido ? 320 : 180,
                      Math.min(
                        420,
                        largo
                          ? height - 160
                          : Math.min(width - 48, height * 0.45),
                      ),
                    ),
                  },
                ]}
              >
                {permissao?.granted &&
                emPrimeiroPlano &&
                !erro &&
                !qrInvalido ? (
                  <CameraView
                    key={`${camera}-${tentativa}`}
                    style={StyleSheet.absoluteFill}
                    facing={camera}
                    barcodeScannerSettings={CONFIGURACAO_QR}
                    onCameraReady={() => setPronta(true)}
                    onMountError={() => {
                      setPronta(false);
                      setErro(
                        "Não foi possível iniciar a câmera. Verifique se ela está disponível e tente novamente.",
                      );
                    }}
                    onBarcodeScanned={({ data }) => {
                      if (leituraConcluida.current) return;
                      leituraConcluida.current = true;
                      const mesa = lerMesaQr(data);
                      if (!mesa) {
                        setQrInvalido(true);
                        return;
                      }
                      onConfirmar(mesa);
                    }}
                  />
                ) : null}

                <View pointerEvents="none" style={s.moldura}>
                  <View style={[s.canto, s.superiorEsquerdo]} />
                  <View style={[s.canto, s.superiorDireito]} />
                  <View style={[s.canto, s.inferiorEsquerdo]} />
                  <View style={[s.canto, s.inferiorDireito]} />
                </View>

                {!permissao || solicitando ? (
                  <View style={s.estado}>
                    <ActivityIndicator size="large" color={Cor.branco} />
                    <Text style={s.estadoTexto}>
                      Verificando acesso à câmera…
                    </Text>
                  </View>
                ) : erro || qrInvalido ? (
                  <View style={s.estado}>
                    <Icone nome="qr" tam={36} cor="#FFC27A" />
                    <Text accessibilityRole="alert" style={s.estadoTexto}>
                      {erro ??
                        "Este QR Code não identifica uma mesa. Aponte para o código fornecido pelo estabelecimento."}
                    </Text>
                    <BotaoLeitor
                      titulo="Ler novamente"
                      onPress={tentarNovamente}
                    />
                  </View>
                ) : !permissao.granted ? (
                  <View style={s.estado}>
                    <Icone nome="qr" tam={40} cor={Cor.branco} />
                    <Text style={s.estadoTitulo}>
                      Permita o acesso à câmera
                    </Text>
                    <Text style={s.estadoTexto}>
                      {Platform.OS === "web"
                        ? "Autorize a câmera nas permissões do navegador. Use HTTPS ou localhost para escanear."
                        : permissao.canAskAgain
                          ? "Precisamos da câmera apenas para ler o QR Code da sua mesa."
                          : "O acesso foi bloqueado. Ative a câmera nas configurações do aplicativo e volte para continuar."}
                    </Text>
                    <BotaoLeitor
                      titulo={
                        !permissao.canAskAgain && Platform.OS !== "web"
                          ? "Abrir configurações"
                          : "Permitir câmera"
                      }
                      onPress={() => void permitirCamera()}
                    />
                  </View>
                ) : !pronta || !emPrimeiroPlano ? (
                  <View pointerEvents="none" style={s.estado}>
                    <ActivityIndicator size="large" color={Cor.branco} />
                    <Text style={s.estadoTexto}>Preparando câmera…</Text>
                  </View>
                ) : null}
              </View>

              <View style={s.leituraRodape}>
                <Text accessibilityLiveRegion="polite" style={s.legenda}>
                  {pronta && !erro && !qrInvalido
                    ? "Procurando QR Code…"
                    : "Leitura do QR Code da mesa"}
                </Text>
                {permissao?.granted && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Trocar entre câmera frontal e traseira"
                    onPress={() => {
                      tentarNovamente();
                      setCamera((atual) =>
                        atual === "back" ? "front" : "back",
                      );
                    }}
                    style={({ pressed }) => [
                      s.trocar,
                      pressed && s.pressionado,
                    ]}
                  >
                    <Text style={s.trocarTexto}>Trocar câmera</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function BotaoLeitor({
  titulo,
  onPress,
}: {
  titulo: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [s.botao, pressed && s.pressionado]}
    >
      <Text style={s.botaoTexto}>{titulo}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: "rgba(3, 14, 35, 0.95)" },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  identificacao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  topoTexto: {
    color: "#D4DDED",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.4,
    flexShrink: 1,
  },
  fechar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F39B43",
    alignItems: "center",
    justifyContent: "center",
  },
  pressionado: { opacity: 0.75 },
  rolagem: { flex: 1 },
  conteudo: { flexGrow: 1, justifyContent: "center", paddingTop: 12 },
  corpo: { width: "100%", maxWidth: 1080, alignSelf: "center", gap: 28 },
  corpoLargo: { flexDirection: "row", alignItems: "center", gap: 48 },
  instrucoes: { gap: 14 },
  instrucoesLargas: { width: "34%", maxWidth: 350 },
  icone: { marginBottom: 4 },
  titulo: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: Fonte.titulo,
    color: Cor.branco,
  },
  descricao: { color: "#F1F4FA", fontSize: 15, lineHeight: 24 },
  ajuda: { color: "#AEBBD1", fontSize: 13, lineHeight: 21 },
  dica: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  ponto: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#F39B43" },
  dicaTexto: { color: "#D4DDED", fontSize: 11, flex: 1, lineHeight: 18 },
  leitura: { flex: 1, gap: 12 },
  camera: {
    width: "100%",
    backgroundColor: "#0C1C33",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#354157",
  },
  moldura: { ...StyleSheet.absoluteFill, margin: 22 },
  canto: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Cor.branco,
  },
  superiorEsquerdo: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 6,
  },
  superiorDireito: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 6,
  },
  inferiorEsquerdo: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 6,
  },
  inferiorDireito: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 6,
  },
  estado: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    padding: 38,
    gap: 16,
  },
  estadoTitulo: {
    color: Cor.branco,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  estadoTexto: {
    color: "#D4DDED",
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
  },
  botao: {
    minHeight: 48,
    backgroundColor: Cor.azul,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoTexto: {
    color: Cor.branco,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  leituraRodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  legenda: { color: "#AEBBD1", fontSize: 12 },
  trocar: {
    minHeight: 44,
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#172A45",
  },
  trocarTexto: { color: Cor.branco, fontSize: 12, fontWeight: "500" },
});
