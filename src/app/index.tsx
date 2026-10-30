import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState, type ComponentRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Carrinho } from "@/components/carrinho";
import { ChamarGarcom } from "@/components/chamar-garcom";
import { Comanda } from "@/components/comanda";
import { Destaques } from "@/components/destaques";
import { GradeProdutos, type ModoProdutos } from "@/components/grade-produtos";
import { Icone, type IconeNome } from "@/components/icone";
import { MinhaConta } from "@/components/minha-conta";
import {
  LARGURA_NAVEGACAO,
  NavegacaoCardapio,
} from "@/components/navegacao-cardapio";
import { NavegacaoMesa } from "@/components/navegacao-mesa";
import { Texto as Text } from "@/components/texto";
import { Cor, Fonte } from "@/constants/theme";
import { CASA, CATEGORIAS, PRODUTOS } from "@/data/cardapio";
import { brl } from "@/lib/conta";
import { usePedido } from "@/store/pedido";

const TODOS = [
  ...Object.values(PRODUTOS).filter((p) => p.imagem),
  ...Object.values(PRODUTOS).filter((p) => !p.imagem),
];
const normalizar = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function Cardapio() {
  const pedido = usePedido();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const largo = width >= 960;
  const lista = useRef<ComponentRef<typeof ScrollView>>(null);
  const [catId, setCatId] = useState("todos");
  const [busca, setBusca] = useState("");
  const [modo, setModo] = useState<ModoProdutos>("grade");
  const [painel, setPainel] = useState<"carrinho" | "conta" | null>(
    null,
  );
  const [leitura, setLeitura] = useState<{
    destino: "carrinho" | "conta";
  } | null>(null);
  const [aviso, setAviso] = useState<{
    texto: string;
    garcom?: boolean;
  } | null>(null);
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3600);
    return () => clearTimeout(t);
  }, [aviso]);
  useEffect(() => {
    lista.current?.scrollTo({ y: 0, animated: false });
  }, [busca, catId, modo]);

  const termo = normalizar(busca.trim());
  const emDestaques = catId === "destaques" && !termo;
  const categoria = CATEGORIAS.find((c) => c.id === catId);
  const produtos = termo
    ? TODOS.filter((p) =>
        normalizar(`${p.nome} ${p.descricao}`).includes(termo),
      )
    : categoria
      ? categoria.produtos.map((p) => PRODUTOS[p.id])
      : TODOS;
  const selecionar = (id: string) => {
    setBusca("");
    setCatId(id);
  };
  const atendimento = () => {
    if (!pedido.mesa) {
      setPainel(null);
      setLeitura({ destino: "conta" });
      return;
    }
    pedido.chamarGarcom();
    setAviso({
      texto: `Garçom chamado para a mesa ${pedido.mesa}!`,
      garcom: true,
    });
  };
  const enviarPedido = () => {
    if (!pedido.itensCarrinho.length) return;
    if (!pedido.mesa) {
      setPainel(null);
      setLeitura({ destino: "carrinho" });
      return;
    }
    pedido.enviar();
    setAviso(null);
    setPainel("conta");
  };
  const abrirConta = () => {
    if (pedido.mesa) {
      setPainel("conta");
    } else {
      setPainel(null);
      setLeitura({ destino: "conta" });
    }
  };
  const total = pedido.itensCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);

  return (
    <View style={s.tela}>
      <StatusBar style={largo ? "light" : "dark"} />
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={[s.topoSeguro, largo && s.topoAzul]}
      >
        <View style={[s.topo, largo && s.topoDesktop]}>
          <View style={[s.marca, largo && { width: LARGURA_NAVEGACAO - 24 }]}>
            <Image
              source={require("../../assets/images/brand/logo.png")}
              contentFit="contain"
              accessibilityLabel="Logo SG CARDAPIO"
              style={s.logo}
            />
            <View>
              <Text style={[s.marcaNome, largo && s.branco]}>SG CARDÁPIO</Text>
              <Text style={[s.marcaSistema, largo && { color: "#C4D8F5" }]}>
                {largo ? CASA.empresa : "Cardápio digital"}
              </Text>
            </View>
          </View>
          {largo && <Busca valor={busca} onMudar={setBusca} noTopo />}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              pedido.mesa
                ? `Ver conta da mesa ${pedido.mesa}`
                : "Abrir mesa com QR Code"
            }
            onPress={abrirConta}
            style={({ pressed }) => [
              s.mesa,
              largo && s.mesaDesktop,
              pressed && { opacity: 0.75 },
            ]}
          >
            <Icone nome="qr" tam={20} cor={largo ? Cor.branco : Cor.azul} />
            <Text style={[s.mesaTexto, largo && s.branco]}>
              {pedido.mesa ? `Mesa ${pedido.mesa}` : "Abrir mesa"}
            </Text>
          </Pressable>
          {largo && (
            <View style={s.acoes}>
              <AcaoTopo
                icone="garcom"
                rotulo="Chamar garçom"
                mostrarRotulo={width >= 1280}
                onPress={atendimento}
              />
              <AcaoTopo
                icone="conta"
                rotulo="Minha conta"
                mostrarRotulo={width >= 1280}
                onPress={abrirConta}
              />
              <AcaoTopo
                icone="carrinho"
                rotulo="Carrinho"
                mostrarRotulo={width >= 1280}
                contador={pedido.qtdNoCarrinho}
                onPress={() => setPainel("carrinho")}
              />
            </View>
          )}
        </View>
        {!largo && (
          <View style={s.buscaMobile}>
            <Busca valor={busca} onMudar={setBusca} />
          </View>
        )}
      </SafeAreaView>
      <SafeAreaView
        edges={["left", "right"]}
        style={[s.corpo, { flexDirection: largo ? "row" : "column" }]}
      >
        <NavegacaoCardapio
          categoriaId={catId}
          buscando={!!termo}
          largo={largo}
          onSelecionar={selecionar}
        />
        <View style={s.principal}>
          {!emDestaques && (
            <View style={[s.ferramentas, !largo && s.ferramentasMobile]}>
              <View style={s.cabecalho}>
                <Text accessibilityRole="header" style={s.titulo}>
                  {termo
                    ? "Resultados da busca"
                    : catId === "todos"
                      ? "Cardápio"
                      : categoria?.nome}
                </Text>
                <Text style={s.subtitulo}>
                  {termo
                    ? `${produtos.length} resultado(s) para “${busca.trim()}”`
                    : `${produtos.length} produtos disponíveis`}
                </Text>
              </View>
              <View style={s.modos}>
                {(["grade", "lista"] as const).map((m) => (
                  <Pressable
                    key={m}
                    accessibilityRole="button"
                    accessibilityLabel={
                      m === "grade"
                        ? "Visualizar em grade"
                        : "Visualizar em lista"
                    }
                    aria-pressed={modo === m}
                    accessibilityState={{ selected: modo === m }}
                    onPress={() => setModo(m)}
                    style={[s.modo, modo === m && s.modoAtivo]}
                  >
                    <Icone
                      nome={m}
                      tam={22}
                      cor={modo === m ? Cor.azul : Cor.suave}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          <ScrollView
            ref={lista}
            testID="lista-produtos"
            style={s.lista}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              s.conteudo,
              {
                padding: largo ? 24 : 16,
                paddingBottom:
                  (emDestaques
                    ? (largo ? 24 : 100)
                    : largo ? 112 : 200) + insets.bottom,
              },
            ]}
          >
            {emDestaques ? (
              <Destaques produtos={produtos} />
            ) : produtos.length ? (
              <GradeProdutos produtos={produtos} modo={modo} />
            ) : (
              <View style={s.vazio}>
                <View style={s.vazioIcone}>
                  <Icone nome="busca" tam={34} cor={Cor.azul} />
                </View>
                <Text style={s.vazioTitulo}>Nenhum produto encontrado</Text>
                <Text style={s.vazioTexto}>
                  Tente outro nome ou escolha uma categoria.
                </Text>
              </View>
            )}
            {!emDestaques && (
              <Text style={s.rodape}>Fotos ilustrativas · Preços em reais</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
      {pedido.qtdNoCarrinho > 0 && painel === null && !emDestaques && (
        <View
          pointerEvents="box-none"
          style={[
            s.barraWrap,
            {
              bottom: (largo ? 24 : 100) + insets.bottom,
              left: largo ? LARGURA_NAVEGACAO : 0,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver carrinho"
            onPress={() => setPainel("carrinho")}
            style={({ pressed }) => [s.barra, pressed && { opacity: 0.9 }]}
          >
            <Icone nome="carrinho" tam={23} cor={Cor.branco} />
            <View style={s.barraInfo}>
              <Text style={s.barraTexto}>Ver meu pedido</Text>
              <Text style={s.barraItens}>
                {pedido.qtdNoCarrinho}{" "}
                {pedido.qtdNoCarrinho === 1 ? "item" : "itens"} no carrinho
              </Text>
            </View>
            <Text style={s.barraTotal}>{brl(total)}</Text>
          </Pressable>
        </View>
      )}
      {!largo && (
        <NavegacaoMesa
          painel={painel}
          quantidade={pedido.qtdNoCarrinho}
          onCardapio={() => {
            setPainel(null);
            selecionar("todos");
          }}
          onPedido={() => setPainel("carrinho")}
          onConta={abrirConta}
          onAjuda={atendimento}
        />
      )}
      {aviso && (
        <View
          style={[s.avisoWrap, { top: insets.top + 82 }]}
          pointerEvents="none"
        >
          {aviso.garcom ? (
            <ChamarGarcom
              key={pedido.solicitacaoGarcom?.solicitadaEm}
              mensagem={aviso.texto}
            />
          ) : (
            <View style={s.aviso}>
              <Icone nome="ok" tam={22} cor={Cor.ok} />
              <Text accessibilityRole="alert" style={s.avisoTexto}>
                {aviso.texto}
              </Text>
            </View>
          )}
        </View>
      )}
      <Carrinho
        visivel={painel === "carrinho"}
        onFechar={() => setPainel(null)}
        onEnviar={enviarPedido}
      />
      <Comanda
        visivel={leitura !== null}
        onFechar={() => {
          setPainel(leitura?.destino === "carrinho" ? "carrinho" : null);
          setLeitura(null);
        }}
        onConfirmar={(mesa) => {
          if (!pedido.abrirMesa(mesa)) return;
          setPainel(leitura?.destino ?? "conta");
          setLeitura(null);
          setAviso({
            texto:
              leitura?.destino === "carrinho"
                ? `Mesa ${mesa} aberta! Confira os itens e envie seu pedido.`
                : `Mesa ${mesa} aberta! Sua comanda está pronta.`,
          });
        }}
      />
      <MinhaConta
        visivel={painel === "conta"}
        onFechar={() => setPainel(null)}
        onPedirConta={() => {
          pedido.pedirConta();
          setPainel(null);
          setAviso({
            texto: "Solicitação registrada. Para pagar, fale com a equipe do salão.",
          });
        }}
      />
    </View>
  );
}

function Busca({
  valor,
  onMudar,
  noTopo = false,
}: {
  valor: string;
  onMudar: (v: string) => void;
  noTopo?: boolean;
}) {
  return (
    <View style={[s.busca, noTopo && s.buscaTopo]}>
      <Icone nome="busca" tam={22} cor={noTopo ? "#DCE7F9" : "#98A0AF"} />
      <TextInput
        accessibilityLabel="Buscar no cardápio"
        value={valor}
        onChangeText={onMudar}
        placeholder="Buscar produto pelo nome"
        placeholderTextColor={noTopo ? "#DCE7F9" : "#98A0AF"}
        style={[s.buscaInput, noTopo && s.branco]}
        returnKeyType="search"
      />
      {!!valor && (
        <Pressable
          onPress={() => onMudar("")}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          style={s.limpar}
        >
          <Icone nome="fechar" tam={18} cor={noTopo ? Cor.branco : Cor.suave} />
        </Pressable>
      )}
    </View>
  );
}
function AcaoTopo({
  icone,
  rotulo,
  mostrarRotulo,
  onPress,
  contador = 0,
}: {
  icone: IconeNome;
  rotulo: string;
  mostrarRotulo: boolean;
  onPress: () => void;
  contador?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      onPress={onPress}
      style={({ pressed }) => [
        s.acao,
        icone === "carrinho" && s.acaoPrincipal,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Icone nome={icone} tam={21} cor={Cor.branco} />
      {mostrarRotulo && (
        <Text style={s.acaoTexto}>
          {icone === "carrinho" ? "Meu pedido" : rotulo}
        </Text>
      )}
      {icone === "carrinho" && (
        <View style={s.contador}>
          <Text style={s.contadorTexto}>{contador}</Text>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cor.papel },
  topoSeguro: { backgroundColor: Cor.branco },
  topoAzul: { backgroundColor: Cor.escuro },
  topo: {
    minHeight: 78,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  topoDesktop: { minHeight: 76, paddingHorizontal: 24, gap: 24 },
  marca: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 0 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Cor.branco,
  },
  marcaNome: { color: Cor.texto, fontSize: 16, fontWeight: "700" },
  marcaSistema: { color: Cor.suave, fontSize: 10, marginTop: 1 },
  branco: { color: Cor.branco },
  mesa: {
    marginLeft: "auto",
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Cor.claro,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  mesaDesktop: { backgroundColor: "rgba(255,255,255,0.12)" },
  mesaTexto: { color: Cor.azul, fontSize: 12, fontWeight: "600" },
  acoes: { flexDirection: "row", gap: 8 },
  acao: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  acaoPrincipal: { backgroundColor: Cor.azul, paddingHorizontal: 14 },
  acaoTexto: { color: Cor.branco, fontSize: 11, fontWeight: "500" },
  contador: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: Cor.branco,
    alignItems: "center",
    justifyContent: "center",
  },
  contadorTexto: { color: Cor.azul, fontSize: 10, fontWeight: "600" },
  buscaMobile: { paddingHorizontal: 20, paddingBottom: 6 },
  busca: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Cor.gelo,
  },
  buscaTopo: {
    flex: 1,
    maxWidth: 460,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  buscaInput: {
    flex: 1,
    minWidth: 0,
    fontFamily: Fonte.corpo,
    fontSize: 13,
    color: Cor.texto,
    paddingVertical: 12,
  },
  limpar: {
    minWidth: 32,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  corpo: { flex: 1 },
  principal: { flex: 1, minWidth: 0 },
  ferramentas: {
    minHeight: 88,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Cor.branco,
    borderBottomWidth: 1,
    borderColor: Cor.linha,
  },
  ferramentasMobile: {
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cabecalho: { flex: 1, gap: 2 },
  titulo: { color: Cor.texto, fontSize: 20, fontWeight: "600" },
  subtitulo: { color: Cor.suave, fontSize: 11, lineHeight: 18 },
  modos: { flexDirection: "row", gap: 6 },
  modo: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },
  modoAtivo: { backgroundColor: "#DCE9FF" },
  lista: { flex: 1 },
  conteudo: { width: "100%", maxWidth: 1480, alignSelf: "center", gap: 28 },
  rodape: { color: Cor.suave, textAlign: "center", fontSize: 10 },
  vazio: {
    backgroundColor: Cor.branco,
    borderRadius: 20,
    padding: 28,
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  vazioIcone: {
    width: 72,
    height: 72,
    backgroundColor: Cor.claro,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  vazioTitulo: {
    color: Cor.texto,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  vazioTexto: {
    color: Cor.suave,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 21,
  },
  barraWrap: {
    position: "absolute",
    right: 0,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  barra: {
    width: "100%",
    maxWidth: 530,
    minHeight: 64,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Cor.azul,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 6px 18px rgba(23,87,255,0.22)",
  },
  barraInfo: { flex: 1 },
  barraTexto: { color: Cor.branco, fontSize: 14, fontWeight: "600" },
  barraItens: { color: "#E1EBFF", fontSize: 10, marginTop: 1 },
  barraTotal: {
    color: Cor.branco,
    fontSize: 16,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  avisoWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
  },
  aviso: {
    maxWidth: 520,
    backgroundColor: Cor.branco,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Cor.linha,
    boxShadow: "0 4px 20px rgba(15,23,42,0.12)",
  },
  avisoTexto: { flexShrink: 1, fontSize: 12, lineHeight: 20, color: Cor.texto },
});
