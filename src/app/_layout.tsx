import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { PedidoProvider } from "@/store/pedido";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
  });
  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <PedidoProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </PedidoProvider>
  );
}
