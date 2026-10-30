import { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Texto as Text } from "@/components/texto";

import { Icone } from "@/components/icone";
import { Botao, Painel, Stepper } from "@/components/ui";
import { Cor } from "@/constants/theme";
import { brl, totais } from "@/lib/conta";
import { usePedido } from "@/store/pedido";

export function MinhaConta({
  visivel,
  onFechar,
  onPedirConta,
}: {
  visivel: boolean;
  onFechar: () => void;
  onPedirConta: () => void;
}) {
  const { mesa, conta, contaPedida } = usePedido();
  const [pessoas, setPessoas] = useState(1);
  const { width, height } = useWindowDimensions();
  const largo = width >= 760;
  const t = totais(conta, pessoas);
  return (
    <Painel
      visivel={visivel}
      titulo="Minha conta"
      subtitulo={mesa ? `Mesa ${mesa}` : "Abra sua mesa pelo QR Code"}
      cabecalhoEscuro
      onFechar={onFechar}
      largura={1040}
      rodape={
        <View style={[s.rodape, !largo && s.rodapeMobile]}>
          <View style={s.resumo}>
            <Linha rotulo="Subtotal" valor={brl(t.subtotal)} />
            <Linha rotulo="Mesa" valor={mesa ?? "—"} />
          </View>
          <View style={s.totalBloco}>
            <Text style={s.rotulo}>Valor a pagar</Text>
            <Text style={s.total}>{brl(t.total)}</Text>
          </View>
          <Botao
            titulo={contaPedida ? "Conta solicitada" : "Pedir a conta"}
            onPress={onPedirConta}
            desabilitado={contaPedida || conta.length === 0}
            style={!largo ? { alignSelf: "stretch" } : { minWidth: 190 }}
          />
        </View>
      }
    >
      <View style={[s.corpo, !largo && { flexDirection: "column" }]}>
        <View
          style={[
            s.tabela,
            largo && { minHeight: Math.min(height * 0.48, 400) },
          ]}
        >
          <View style={s.cabecalho}>
            {largo && <Text style={[s.rotulo, s.hora]}>Hora</Text>}
            <Text style={[s.rotulo, s.qtd]}>Qtde</Text>
            <Text style={[s.rotulo, { flex: 1 }]}>Item</Text>
            {largo && <Text style={[s.rotulo, s.unitario]}>Unitário</Text>}
            <Text style={[s.rotulo, s.valor]}>Valor</Text>
          </View>
          {conta.length === 0 ? (
            <View style={s.vazio}>
              <Icone nome="conta" tam={40} cor={Cor.suave} />
              <Text style={s.rotulo}>Nenhum pedido enviado ainda.</Text>
            </View>
          ) : (
            conta.map((item, i) => (
              <View
                key={`${item.produtoId}-${i}`}
                style={[s.linha, i % 2 === 0 && { backgroundColor: Cor.gelo }]}
              >
                {largo && <Text style={[s.texto, s.hora]}>{item.hora}</Text>}
                <Text style={[s.texto, s.qtd]}>{item.qtd}x</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.texto}>{item.nome}</Text>
                  {!largo && (
                    <Text style={s.rotulo}>
                      {item.hora} · {brl(item.preco)} un.
                    </Text>
                  )}
                </View>
                {largo && (
                  <Text style={[s.texto, s.unitario]}>{brl(item.preco)}</Text>
                )}
                <Text style={[s.texto, s.valor, { fontWeight: "600" }]}>
                  {brl(item.preco * item.qtd)}
                </Text>
              </View>
            ))
          )}
        </View>
        <View style={[s.divisao, largo && { width: 230 }]}>
          <Text style={s.dividirTitulo}>Vai dividir a conta?</Text>
          <Text style={s.rotulo}>Número de pessoas</Text>
          <Stepper
            valor={pessoas}
            onMudar={(d) => setPessoas((p) => Math.max(1, p + d))}
            min={1}
            grande
          />
          <Text style={[s.rotulo, { marginTop: 14 }]}>Valor por pessoa</Text>
          <Text style={s.porPessoa}>{brl(t.porPessoa)}</Text>
        </View>
      </View>
    </Painel>
  );
}
function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={s.linhaResumo}>
      <Text style={s.rotulo}>{rotulo}</Text>
      <Text style={[s.rotulo, { color: Cor.texto, fontWeight: "600" }]}>
        {valor}
      </Text>
    </View>
  );
}
const s = StyleSheet.create({
  corpo: { padding: 24, flexDirection: "row", gap: 24 },
  tabela: { flex: 1 },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: Cor.linha,
  },
  rotulo: { fontSize: 11, lineHeight: 17, color: Cor.suave },
  hora: { width: 48 },
  qtd: { width: 40 },
  unitario: { width: 85, textAlign: "right" },
  valor: { width: 88, textAlign: "right" },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Cor.linha,
    gap: 4,
  },
  texto: {
    color: Cor.texto,
    fontSize: 13,
    lineHeight: 19,
    fontVariant: ["tabular-nums"],
  },
  vazio: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  divisao: {
    alignItems: "center",
    padding: 20,
    gap: 14,
    backgroundColor: Cor.claro,
    borderRadius: 20,
  },
  dividirTitulo: { fontSize: 16, fontWeight: "600", color: Cor.texto },
  porPessoa: {
    color: Cor.azul,
    fontSize: 22,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  rodape: { flexDirection: "row", alignItems: "center", gap: 24 },
  rodapeMobile: { flexDirection: "column", alignItems: "stretch", gap: 14 },
  resumo: { flex: 1, gap: 4 },
  linhaResumo: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  totalBloco: {
    paddingHorizontal: 18,
    borderLeftWidth: 1,
    borderColor: Cor.linha,
  },
  total: {
    color: Cor.azul,
    fontSize: 28,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
