import type { ComponentProps } from "react";
import { Text, StyleSheet } from "react-native";

export function Texto({ style, ...props }: ComponentProps<typeof Text>) {
  const aparencia = StyleSheet.flatten(style);
  const peso = Number(aparencia?.fontWeight ?? 400);
  const familia =
    aparencia?.fontFamily ??
    (peso >= 700
      ? "PoppinsBold"
      : peso >= 600
        ? "PoppinsSemiBold"
        : peso >= 500
          ? "PoppinsMedium"
          : "Poppins");
  return (
    <Text
      {...props}
      style={[style, { fontFamily: familia, fontWeight: "normal" }]}
    />
  );
}
