import type { ImageProps } from "expo-image";

import type { IconeNome } from "@/components/icone";

// Cardápio de demonstração. As fotos locais são ilustrativas.

export const CASA = {
  sigla: "SG",
  nome: "SG CARDAPIO",
  empresa: "SGBrSistemas",
  subtitulo: "Digital",
  mesa: 7,
};

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // centavos
  tag?: string;
  destaque?: boolean;
  imagem?: ImageProps["source"];
};

export type Categoria = {
  id: string;
  nome: string;
  icone: IconeNome;
  chamada: string;
  produtos: Produto[];
};

const CATEGORIAS_BASE: Categoria[] = [
  {
    id: "porcoes",
    nome: "Porções",
    icone: "porcoes",
    chamada: "Pra dividir com a mesa toda.",
    produtos: [
      {
        id: "batata",
        imagem: require("../../assets/images/menu/fritas.jpg"),
        nome: "Batata frita da casa",
        descricao: "Batata rústica com cheddar cremoso e bacon crocante.",
        preco: 4290,
        tag: "Serve 3",
        destaque: true,
      },
      {
        id: "tilapia",
        nome: "Isca de tilápia",
        descricao: "Tiras empanadas na farinha panko com molho tártaro.",
        preco: 5890,
        tag: "Serve 3",
      },
      {
        id: "calabresa",
        nome: "Calabresa acebolada",
        descricao: "Calabresa fatiada na chapa com cebola e pão.",
        preco: 3990,
        tag: "Serve 2",
      },
      {
        id: "frango",
        imagem: require("../../assets/images/menu/frango.jpg"),
        nome: "Frango a passarinho",
        descricao: "Coxinhas da asa fritas com alho dourado.",
        preco: 4590,
        tag: "Serve 3",
      },
    ],
  },
  {
    id: "lanches",
    nome: "Lanches",
    icone: "lanches",
    chamada: "Pão macio, carne na brasa e queijo de verdade.",
    produtos: [
      {
        id: "x-bacon",
        imagem: require("../../assets/images/menu/burger.jpg"),
        nome: "X-Bacon da casa",
        descricao:"Blend 180 g, queijo prato, bacon, cebola caramelizada e maionese da casa.",
        preco: 3490,
        tag: "Mais pedido",
        destaque: true,
      },
      {
        id: "x-salada",
        imagem: require("../../assets/images/menu/burger.jpg"),
        nome: "X-Salada",
        descricao: "Blend 150 g, queijo, alface, tomate e maionese.",
        preco: 2690,
      },
      {
        id: "dogao",
        nome: "Cachorro-quente",
        descricao: "Pão, duas salsichas, purê, vinagrete e batata palha.",
        preco: 1890,
      },
    ],
  },
  {
    id: "grelhados",
    nome: "Grelhados",
    icone: "grelhados",
    chamada: "Direto da chapa, com arroz, farofa e vinagrete.",
    produtos: [
      {
        id: "picanha",
        imagem: require("../../assets/images/menu/grelhado.jpg"),
        nome: "Picanha na chapa",
        descricao:
          "500 g de picanha fatiada, arroz, farofa, vinagrete e fritas.",
        preco: 11900,
        tag: "Serve 2",
        destaque: true,
      },
      {
        id: "contrafile",
        imagem: require("../../assets/images/menu/grelhado.jpg"),
        nome: "Contrafilé acebolado",
        descricao: "300 g de contrafilé, arroz, feijão e fritas.",
        preco: 7990,
      },
    ],
  },
  {
    id: "cervejas",
    nome: "Cervejas",
    icone: "cervejas",
    chamada: "Trincando de gelada.",
    produtos: [
      {
        id: "chopp",
        imagem: require("../../assets/images/menu/chopp.jpg"),
        nome: "Chopp 300 ml",
        descricao: "Pilsen com colarinho de dois dedos.",
        preco: 1290,
        tag: "+18",
        destaque: true,
      },
      {
        id: "cerveja600",
        imagem: require("../../assets/images/menu/chopp.jpg"),
        nome: "Cerveja 600 ml",
        descricao: "Pergunte as marcas disponíveis hoje.",
        preco: 1690,
        tag: "+18",
      },
      {
        id: "longneck",
        imagem: require("../../assets/images/menu/chopp.jpg"),
        nome: "Long neck",
        descricao: "Pilsen, puro malte ou IPA.",
        preco: 1190,
        tag: "+18",
      },
    ],
  },
  {
    id: "drinks",
    nome: "Drinks",
    icone: "drinks",
    chamada: "Clássicos preparados na hora.",
    produtos: [
      {
        id: "caipirinha",
        nome: "Caipirinha",
        descricao: "Limão, morango ou maracujá. Cachaça ou vodka.",
        preco: 2290,
        tag: "+18",
      },
      {
        id: "gin",
        nome: "Gin tônica",
        descricao: "Gin, tônica, limão-siciliano e especiarias.",
        preco: 2890,
        tag: "+18",
      },
    ],
  },
  {
    id: "bebidas",
    nome: "Sem álcool",
    icone: "bebidas",
    chamada: "Refrigerantes, sucos e água.",
    produtos: [
      {
        id: "refri",
        nome: "Refrigerante lata",
        descricao: "350 ml. Normal ou zero.",
        preco: 690,
      },
      {
        id: "suco",
        imagem: require("../../assets/images/menu/suco.jpg"),
        nome: "Suco natural",
        descricao: "Laranja, limão ou abacaxi com hortelã. 400 ml.",
        preco: 990,
      },
      {
        id: "agua",
        nome: "Água mineral",
        descricao: "500 ml, com ou sem gás.",
        preco: 450,
      },
    ],
  },
  {
    id: "sobremesas",
    nome: "Sobremesas",
    icone: "sobremesas",
    chamada: "Pra fechar com chave de ouro.",
    produtos: [
      {
        id: "petit",
        imagem: require("../../assets/images/menu/chocolate.jpg"),
        nome: "Petit gâteau",
        descricao: "Bolo quente de chocolate com sorvete de creme.",
        preco: 2490,
        destaque: true,
      },
      {
        id: "pudim",
        nome: "Pudim da vó",
        descricao: "Pudim de leite condensado com calda de caramelo.",
        preco: 1490,
      },
    ],
  },
];

export const CATEGORIAS: Categoria[] = [
  {
    id: "destaques",
    nome: "Destaques",
    icone: "destaques",
    chamada: "Os mais pedidos da casa.",
    produtos: CATEGORIAS_BASE.flatMap((c) =>
      c.produtos.filter((p) => p.destaque),
    ),
  },
  ...CATEGORIAS_BASE,
];

export const PRODUTOS = Object.fromEntries(
  CATEGORIAS_BASE.flatMap((c) =>
    c.produtos.map((p) => [p.id, { ...p, icone: c.icone }]),
  ),
) as Record<string, Produto & { icone: IconeNome }>;

export const GRUPOS_CARDAPIO: {
  nome: string;
  icone: IconeNome;
  categorias: string[];
  inicial: string;
}[] = [
  {
    nome: "Destaques",
    icone: "destaques",
    categorias: ["destaques"],
    inicial: "destaques",
  },
  {
    nome: "Comidas",
    icone: "lanches",
    categorias: ["porcoes", "lanches", "grelhados"],
    inicial: "lanches",
  },
  {
    nome: "Bebidas",
    icone: "bebidas",
    categorias: ["cervejas", "drinks", "bebidas"],
    inicial: "cervejas",
  },
  {
    nome: "Sobremesas",
    icone: "sobremesas",
    categorias: ["sobremesas"],
    inicial: "sobremesas",
  },
];
