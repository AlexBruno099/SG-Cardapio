# Testes dos fluxos — 27/10/2026

Ambiente: Android nativo no emulador Pixel Tablet, conectado ao Expo na porta 8082, e navegador em 390 × 844. Testes realizados por toques/cliques na interface, inspeção do código e conferência dos cálculos em centavos.

Os pedidos e as solicitações desta versão são mantidos apenas em memória. Não há integração com atendimento, cozinha, pagamento ou faturamento. Os resultados abaixo validam a simulação local.

## Resultados

| Fluxo | Resultado observado |
| --- | --- |
| Chamar garçom | Exibe “Para atendimento na mesa 07, fale com a equipe do salão.” Não envia chamado. |
| Carrinho vazio | Exibe estado vazio e impede enviar pedido. |
| Conta vazia | Impede pedir a conta; o divisor não desce abaixo de uma pessoa. |
| Remover item e diminuir até zero | Remove o produto, recalcula o carrinho e desabilita o envio quando vazio. |
| Comanda | Confirmação vazia bloqueada; aceita até quatro dígitos; apagar funciona. A existência da comanda não é consultada em servidor. |
| Cancelar confirmação | Mantém os itens no carrinho e não lança o pedido na conta. |
| Primeiro pedido | X-Bacon de R$ 34,90 lançado na comanda #123; serviço de R$ 3,49; total R$ 38,39. |
| Pedido adicional | Chopp de R$ 12,90 reutiliza a comanda; subtotal R$ 47,80, serviço R$ 4,78 e total R$ 52,58. |
| Dividir por duas pessoas | Exibe R$ 26,29 por pessoa para o total de R$ 52,58. |
| Dividir por três pessoas | Exibe R$ 17,53 por pessoa. Três parcelas iguais somam R$ 52,59; não há compensação do centavo excedente. |
| Pedir a conta | Marca “Conta solicitada” e desabilita repetição. A solicitação é apenas local. |
| Novo pedido após pedir a conta | Aceita água de R$ 4,50 e atualiza o total para R$ 57,53, mantendo “Conta solicitada” desabilitado. |
| Faturar/receber pagamento | Não implementado. Não existe operação de quitação, processamento de pagamento ou emissão de documento. |

## Pendências reproduzidas

1. **Atendimento sem chamado real.** O botão apenas executa `setAviso` em `src/app/index.tsx`. Não há registro de solicitação nem confirmação de recebimento pelo salão.
2. **Solicitação de conta sem fechamento real.** `pedirConta` altera apenas `contaPedida` em `src/store/pedido.tsx`. Não quita nem fatura a conta.
3. **Serviço apresentado como opcional sem controle para retirar.** `src/components/minha-conta.tsx` mostra “Serviço (10%, opcional)”, mas `src/lib/conta.ts` sempre acrescenta os 10% ao total.
4. **Solicitação não reavaliada após novos itens.** Depois de pedir a conta, o cliente consegue enviar mais produtos, mas `enviar` não atualiza `contaPedida`. É necessário definir se novos pedidos devem ser bloqueados ou se a solicitação deve ser renovada.
5. **Divisão sem distribuição dos centavos.** `totais` usa `Math.ceil` para todas as pessoas. Para um rateio exato de R$ 52,58 entre três pessoas, as parcelas poderiam ser R$ 17,53, R$ 17,53 e R$ 17,52; o aplicativo apresenta apenas R$ 17,53 por pessoa.

## Verificações técnicas

- `npx expo lint`: passou.
- `npx tsc --noEmit`: passou.
- `npm run check`: passou nos casos existentes.
- Casos adicionais no navegador: passaram, sem erros de JavaScript.
- Fluxos nativos acima: executados; nenhuma falha JavaScript ou exceção fatal registrada no Logcat durante os testes.

## Capturas locais

- [Chamar garçom](/tmp/sg-fluxos-native/01-garcom.png)
- [Conta vazia](/tmp/sg-fluxos-native/03-conta-vazia.png)
- [Segundo pedido e totais](/tmp/sg-fluxos-native/05-segundo-pedido.png)
- [Divisão em três pessoas](/tmp/sg-fluxos-native/06-divisao-tres.png)
- [Conta solicitada](/tmp/sg-fluxos-native/07-conta-solicitada.png)
- [Novo pedido depois da solicitação](/tmp/sg-fluxos-native/08-pedido-apos-conta.png)

As capturas estão em `/tmp` e são temporárias. As pendências acima descrevem comportamentos observados; as regras de negócio do aplicativo não foram alteradas nesta rodada de testes.
