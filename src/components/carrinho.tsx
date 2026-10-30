import { Pressable, StyleSheet, View } from "react-native";
import { Icone } from "@/components/icone";
import { Texto as Text } from "@/components/texto";
import { Botao, Painel, ProdutoArte, Stepper } from "@/components/ui";
import { Cor } from "@/constants/theme";
import { brl } from "@/lib/conta";
import { usePedido } from "@/store/pedido";

export function Carrinho({
  visivel,
  onFechar,
  onEnviar,
}: {
  visivel: boolean;
  onFechar: () => void;
  onEnviar: () => void;
}) {
  const { mesa, itensCarrinho, qtdNoCarrinho, mudarQtd, remover } = usePedido();
  const total = itensCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  return (
    <Painel
      visivel={visivel}
      titulo="Seu pedido"
      subtitulo={`${qtdNoCarrinho} ${qtdNoCarrinho === 1 ? "item" : "itens"} no carrinho · ${mesa ? `Mesa ${mesa}` : "Abra sua mesa para enviar"}`}
      onFechar={onFechar}
      lateral
      cabecalhoEscuro
      largura={520}
      rodape={
        <View style={s.rodape}>
          <View style={s.resumo}>
            <Text style={s.rotulo}>Subtotal</Text>
            <Text style={s.subtotalResumo}>{brl(total)}</Text>
          </View>
          <View style={s.totalLinha}>
            <Text style={s.totalRotulo}>Total do pedido</Text>
            <Text style={s.total}>{brl(total)}</Text>
          </View>
          <Botao
            titulo="Enviar pedido"
            onPress={onEnviar}
            desabilitado={!itensCarrinho.length}
          />
          <Pressable
            accessibilityRole="button"
            onPress={onFechar}
            style={s.continuar}
          >
            <Text style={s.continuarTexto}>Continuar escolhendo</Text>
          </Pressable>
        </View>
      }
    >
      {itensCarrinho.length === 0 ? (
        <View style={s.vazio}>
          <View style={s.vazioIcone}>
            <Icone nome="carrinho" tam={38} cor={Cor.azul} />
          </View>
          <Text style={s.vazioTitulo}>Seu carrinho está vazio</Text>
          <Text style={s.rotulo}>Adicione seus produtos favoritos.</Text>
        </View>
      ) : (
        <View style={s.itens}>
          {itensCarrinho.map((item) => (
            <View key={item.id} style={s.card}>
              <ProdutoArte produto={item} icone={item.icone} style={s.foto} />
              <View style={s.item}>
                <View style={s.itemTopo}>
                  <Text style={s.nome}>{item.nome}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${item.nome}`}
                    onPress={() => remover(item.id)}
                    style={s.remover}
                  >
                    <Icone nome="lixo" tam={19} cor={Cor.perigo} />
                  </Pressable>
                </View>
                <Text style={s.descricao} numberOfLines={2}>
                  {item.descricao}
                </Text>
                <View style={s.itemBase}>
                  <Text style={s.subtotal}>{brl(item.preco * item.qtd)}</Text>
                  <Stepper
                    valor={item.qtd}
                    onMudar={(d) => mudarQtd(item.id, d)}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </Painel>
  );
}
const s = StyleSheet.create({
  rodape: { gap: 12 },
  resumo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rotulo: { color: Cor.suave, fontSize: 13 },
  subtotalResumo: { color: "#4B5565", fontSize: 15, fontWeight: "500" },
  totalLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderTopWidth: 1,
    borderColor: Cor.linha,
    paddingTop: 14,
    paddingBottom: 4,
  },
  totalRotulo: { color: Cor.texto, fontSize: 15, fontWeight: "600" },
  total: {
    color: Cor.azul,
    fontSize: 24,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  continuar: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  continuarTexto: { color: Cor.azul, fontSize: 12 },
  itens: { padding: 16, gap: 14 },
  card: {
    backgroundColor: Cor.branco,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 20,
    boxShadow: "0 3px 14px rgba(15,23,42,0.06)",
  },
  foto: { width: 76, height: 88, borderRadius: 12 },
  item: { flex: 1, minWidth: 0, gap: 4 },
  itemTopo: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  nome: {
    flex: 1,
    color: Cor.texto,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  remover: {
    width: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -8,
    marginRight: -8,
  },
  descricao: { color: Cor.suave, fontSize: 11, lineHeight: 18 },
  itemBase: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingTop: 6,
  },
  subtotal: {
    color: Cor.azul,
    fontSize: 17,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  vazio: {
    minHeight: 350,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 14,
  },
  vazioIcone: {
    width: 86,
    height: 86,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Cor.claro,
  },
  vazioTitulo: {
    color: Cor.texto,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
