import { SymbolView } from "expo-symbols";

// SF Symbols no iOS, Material Symbols no Android e na web.
const ICONES = {
  inicio: { ios: "house", android: "home" },
  grade: { ios: "square.grid.2x2", android: "grid_view" },
  lista: { ios: "list.bullet", android: "format_list_bulleted" },
  destaques: { ios: "star.fill", android: "star" },
  porcoes: { ios: "takeoutbag.and.cup.and.straw", android: "fastfood" },
  lanches: { ios: "fork.knife", android: "lunch_dining" },
  grelhados: { ios: "flame", android: "outdoor_grill" },
  bebidas: { ios: "cup.and.saucer", android: "local_cafe" },
  cervejas: { ios: "mug", android: "sports_bar" },
  drinks: { ios: "wineglass", android: "local_bar" },
  sobremesas: { ios: "birthday.cake", android: "icecream" },
  carrinho: { ios: "cart", android: "shopping_cart" },
  conta: { ios: "doc.text", android: "receipt_long" },
  garcom: { ios: "bell", android: "room_service" },
  busca: { ios: "magnifyingglass", android: "search" },
  fechar: { ios: "xmark", android: "close" },
  mais: { ios: "plus", android: "add" },
  menos: { ios: "minus", android: "remove" },
  lixo: { ios: "trash", android: "delete" },
  apagar: { ios: "delete.left", android: "backspace" },
  ok: { ios: "checkmark.circle.fill", android: "check_circle" },
  qr: { ios: "qrcode", android: "qr_code_2" },
} as const;

export type IconeNome = keyof typeof ICONES;

export function Icone({
  nome,
  tam = 22,
  cor,
}: {
  nome: IconeNome;
  tam?: number;
  cor: string;
}) {
  const { ios, android } = ICONES[nome];
  return (
    <SymbolView
      name={{ ios, android, web: android }}
      size={tam}
      tintColor={cor}
    />
  );
}
