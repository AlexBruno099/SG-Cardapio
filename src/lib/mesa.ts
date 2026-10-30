/** Mesas de 1 a 9999; o mesmo número sempre produz o mesmo identificador. */
export function normalizarMesa(valor: unknown): string | null {
  if (typeof valor !== "string" && typeof valor !== "number") return null;
  const texto = String(valor).trim();
  if (!/^\d{1,4}$/.test(texto) || Number(texto) === 0) return null;
  return String(Number(texto)).padStart(2, "0");
}

/** Lê dados do QR sem navegar para links ou executar seu conteúdo. */
export function lerMesaQr(conteudo: string): string | null {
  const texto = conteudo.trim();
  if (!texto || texto.length > 2048) return null;

  const numero = normalizarMesa(texto);
  if (numero) return numero;

  const rotulo = /^mesa\s*[:#-]?\s*(\d{1,4})$/i.exec(texto);
  if (rotulo) return normalizarMesa(rotulo[1]);

  if (texto.startsWith("{")) {
    try {
      const dados: unknown = JSON.parse(texto);
      return dados && typeof dados === "object" && "mesa" in dados
        ? normalizarMesa(dados.mesa)
        : null;
    } catch {
      return null;
    }
  }

  try {
    const url = new URL(texto);
    if (!["https:", "http:", "sgcardapio:"].includes(url.protocol)) return null;
    const parametros = url.searchParams.getAll("mesa");
    if (parametros.length) {
      return parametros.length === 1 ? normalizarMesa(parametros[0]) : null;
    }
    if (url.protocol === "sgcardapio:" && url.hostname === "mesa") {
      const caminho = /^\/(\d{1,4})\/?$/.exec(url.pathname);
      return caminho ? normalizarMesa(caminho[1]) : null;
    }
  } catch {
    return null;
  }
  return null;
}
