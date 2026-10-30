import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icone, type IconeNome } from "@/components/icone";
import { Texto as Text } from "@/components/texto";
import { Cor } from "@/constants/theme";

export function NavegacaoMesa({
  painel,
  quantidade,
  onCardapio,
  onPedido,
  onConta,
  onAjuda,
}: {
  painel: string | null;
  quantidade: number;
  onCardapio: () => void;
  onPedido: () => void;
  onConta: () => void;
  onAjuda: () => void;
}) {
  const insets = useSafeAreaInsets();
  const itens: {
    nome: string;
    rotulo: string;
    icone: IconeNome;
    ativo: boolean;
    onPress: () => void;
  }[] = [
    {
      nome: "Cardápio",
      rotulo: "Voltar ao cardápio",
      icone: "inicio",
      ativo: painel === null,
      onPress: onCardapio,
    },
    {
      nome: "Pedido",
      rotulo: "Carrinho",
      icone: "carrinho",
      ativo: painel === "carrinho",
      onPress: onPedido,
    },
    {
      nome: "Conta",
      rotulo: "Minha conta",
      icone: "conta",
      ativo: painel === "conta",
      onPress: onConta,
    },
    {
      nome: "Ajuda",
      rotulo: "Chamar garçom",
      icone: "garcom",
      ativo: false,
      onPress: onAjuda,
    },
  ];
  return (
    <View
      pointerEvents="box-none"
      style={[s.wrap, { bottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={s.barra}>
        {itens.map((item) => (
          <Pressable
            key={item.nome}
            accessibilityRole="button"
            accessibilityLabel={item.rotulo}
            accessibilityState={{ selected: item.ativo }}
            onPress={item.onPress}
            style={({ pressed }) => [s.item, pressed && { opacity: 0.6 }]}
          >
            <View style={s.icone}>
              <Icone
                nome={item.icone}
                tam={26}
                cor={item.ativo ? Cor.azul : "#3F4859"}
              />
              {item.icone === "carrinho" && quantidade > 0 && (
                <View style={s.selo}>
                  <Text style={s.seloTexto}>{quantidade}</Text>
                </View>
              )}
            </View>
            <Text style={[s.texto, item.ativo && { color: Cor.azul }]}>
              {item.nome}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, alignItems: "center" },
  barra: {
    width: "100%",
    maxWidth: 560,
    minHeight: 76,
    padding: 8,
    backgroundColor: Cor.branco,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0 3px 20px rgba(15,23,42,0.12)",
  },
  item: {
    flex: 1,
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  icone: {
    width: 32,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: { fontSize: 11, color: "#3F4859" },
  selo: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: Cor.azul,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Cor.branco,
  },
  seloTexto: { color: Cor.branco, fontSize: 8, fontWeight: "600" },
});
