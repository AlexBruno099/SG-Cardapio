import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { Icone } from "@/components/icone";
import { Texto as Text } from "@/components/texto";
import { Cor } from "@/constants/theme";

export function ChamarGarcom({ mensagem }: { mensagem: string }) {
  const [reduzirMovimento, setReduzirMovimento] = useState(true);
  const [pulso] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let ativo = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(
      (reduzir) => {
        if (ativo) setReduzirMovimento(reduzir);
      },
      () => {},
    );
    const evento = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduzirMovimento,
    );
    return () => {
      ativo = false;
      evento?.remove();
    };
  }, []);

  useEffect(() => {
    if (reduzirMovimento) return;
    pulso.setValue(0);
    const animacao = Animated.timing(pulso, {
      toValue: 1,
      duration: 800,
      useNativeDriver: Platform.OS !== "web",
      isInteraction: false,
    });
    animacao.start();
    return () => animacao.stop();
  }, [pulso, reduzirMovimento]);

  return (
    <View style={s.aviso}>
      <View style={s.animacao} accessible={false}>
        {!reduzirMovimento && (
          <Animated.View
            style={[
              s.onda,
              {
                opacity: pulso.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.35, 0],
                }),
                transform: [
                  {
                    scale: pulso.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.4],
                    }),
                  },
                ],
              },
            ]}
          />
        )}
        <Icone nome="garcom" tam={22} cor={Cor.azul} />
      </View>
      <Text accessibilityRole="alert" style={s.texto}>
        {mensagem}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  aviso: {
    maxWidth: 360,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Cor.branco,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Cor.linha,
    boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
  },
  animacao: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  onda: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Cor.azul,
  },
  texto: {
    flexShrink: 1,
    color: Cor.texto,
    fontSize: 12,
    lineHeight: 20,
  },
});
