# Abertura de mesa por QR Code

Toque em **Abrir mesa**, no topo do cardápio, ou em **Minha conta**. Permita o acesso à câmera e aponte para o código. A mesa identificada abre automaticamente. Em tablets, **Trocar câmera** permite usar a câmera frontal para apresentar o cartão ao aparelho.

O formato recomendado para os novos códigos é este JSON (troque `07` pelo número da mesa):

```json
{"mesa":"07"}
```

Imprima um QR diferente para cada mesa, com números de **1 a 9999**. Zeros à esquerda são normalizados: `7`, `07` e `0007` identificam a mesa `07`.

Exemplo para impressão: [QR da mesa 07](./qrcode-mesa-07.svg), também disponível em [PNG](./qrcode-mesa-07.png).

Também são aceitos números simples (`7`), texto (`Mesa 07`), links HTTP/HTTPS com um único parâmetro `mesa` (`https://seu-dominio.com/?mesa=07`) e o texto `sgcardapio://mesa/07`. Esses links são interpretados pelo scanner dentro do aplicativo; não são abertos pelo leitor. A abertura pelo aplicativo de câmera do sistema não faz parte deste fluxo.

O cardápio pode ser consultado e o carrinho pode ser montado antes de abrir a mesa. Ao tentar enviar um pedido sem mesa, o scanner é exibido. Após a leitura, o cliente retorna ao carrinho para conferir e enviar. Cancelar mantém os itens e não envia o pedido. Com uma mesa aberta, todos os pedidos e chamados usam seu número; não é possível mudar para outra mesa nesta sessão.

O leitor só monta a câmera enquanto estiver aberto e em primeiro plano. Códigos inválidos exibem uma mensagem com a opção de tentar novamente. Sem permissão, a tela orienta a autorizar a câmera ou abrir as configurações. No navegador, a câmera exige HTTPS ou localhost.

## Limite da integração atual

O aplicativo guarda mesa, conta e pedidos apenas em memória. Reiniciá-lo limpa a sessão. O QR identifica a mesa localmente: não verifica a existência de uma mesa ou comanda no estabelecimento, não autentica cartões e não abre registros em um servidor. A validação e a abertura no sistema do restaurante dependem de uma futura integração com a API.

## Configuração e verificações

Foi instalado `expo-camera` compatível com o SDK 58 usando `npx expo install expo-camera`, conforme a [documentação da câmera para o SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/camera/). O plugin em `app.json` configura a permissão de câmera, a leitura de códigos e desativa o acesso ao microfone. Para um aplicativo nativo já compilado, gere uma nova build para incluir o módulo e as permissões.

```bash
npx expo lint
npx tsc --noEmit
npm run check
```

`npm run check` verifica os cálculos da conta e o contrato do QR: formatos aceitos, normalização, números inválidos, links sem mesa e parâmetros duplicados.

## Validação em 30/10/2026

- Lint, TypeScript e `npm run check`: passaram.
- Configuração nativa inspecionada com `npx expo config --type introspect`: permissão de câmera presente; permissão de microfone ausente.
- Chromium, tablet 1180 × 820 e celular 390 × 844, com vídeo de câmera simulado contendo um QR real: identificação da mesa 07 e abertura da conta passaram, sem erros JavaScript.
- Carrinho com X-Bacon: leitura abre a mesa, retorna ao carrinho e aguarda confirmação do envio; o pedido aparece na conta da mesa 07. A câmera é desmontada após a leitura.
- Sem acesso à câmera: instruções exibidas; fechar o leitor preserva o carrinho e mantém a mesa sem identificação.
- QR de um link sem mesa: rejeitado; “Ler novamente” funciona e não abre nenhuma mesa.

A câmera em um aparelho físico ainda precisa ser conferida na nova build. Os testes de navegador não validam o hardware nem os diálogos de permissão nativos de Android e iOS.
