// ============================================================
//  Modelo: aprendizaje supervisado con etiquetas
//
//  1. Características: cada imagen se convierte en una lista de números.
//     - Si hay internet: MobileNet (red neuronal ya entrenada con millones
//       de imágenes) da 1024 números que describen formas, texturas y colores.
//     - Sin internet: un histograma de colores (64 números) + brillo.
//  2. Entrenamiento: cada voto es un ejemplo etiquetado (imagen → emoción).
//  3. Predicción: para una imagen nueva se buscan las obras más parecidas
//     (vecinos más cercanos) y se combinan sus etiquetas, pesando más
//     las obras que más se parecen.
// ============================================================

window.Modelo = (function () {
  let mobilenet = null;
  let motor = "colores";
  const cache = new Map();   // imagen → características
  let entrenamiento = [];    // [{ obra, vector, votos:{emocion:n}, total }]

  function cargarImagen(src) {
    return new Promise((ok, mal) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => ok(img);
      img.onerror = () => mal(new Error("No se pudo cargar " + src));
      img.src = src;
    });
  }

  function cargarScript(src) {
    return new Promise((ok, mal) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = mal;
      document.head.appendChild(s);
    });
  }

  async function iniciar() {
    try {
      await cargarScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
      await cargarScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js");
      mobilenet = await Promise.race([
        window.mobilenet.load({ version: 2, alpha: 1.0 }),
        new Promise((_, mal) => setTimeout(() => mal(new Error("tiempo agotado")), 20000))
      ]);
      motor = "MobileNet";
    } catch (e) {
      mobilenet = null;
      motor = "colores";
      console.info("MobileNet no disponible, se usan características de color.", e);
    }
    return motor;
  }

  function caracteristicasColor(img) {
    const c = document.createElement("canvas");
    c.width = 64; c.height = 48;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, c.width, c.height);
    const px = g.getImageData(0, 0, c.width, c.height).data;
    const hist = new Array(64).fill(0);
    let brillo = 0;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i] >> 6, v = px[i + 1] >> 6, a = px[i + 2] >> 6;
      hist[r * 16 + v * 4 + a] += 1;
      brillo += (px[i] + px[i + 1] + px[i + 2]) / 765;
    }
    const n = px.length / 4;
    return hist.map(h => h / n).concat([brillo / n * 2]);
  }

  async function caracteristicas(src) {
    if (cache.has(src)) return cache.get(src);
    const img = await cargarImagen(src);
    let vector;
    if (mobilenet) {
      const t = mobilenet.infer(img, true);
      vector = Array.from(await t.data());
      t.dispose();
    } else {
      vector = caracteristicasColor(img);
    }
    cache.set(src, vector);
    return vector;
  }

  function similitud(a, b) {
    let p = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { p += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    return p / (Math.sqrt(na * nb) || 1);
  }

  // obras: lista de CONFIG.OBRAS ; conteos: { obraId: { emocion: n } }
  async function entrenar(obras, conteos) {
    const nuevo = [];
    for (const o of obras) {
      const votos = conteos[o.id] || {};
      const total = Object.values(votos).reduce((s, n) => s + n, 0);
      if (total === 0) continue;
      nuevo.push({ obra: o, vector: await caracteristicas(o.imagen), votos, total });
    }
    entrenamiento = nuevo;
    return entrenamiento.reduce((s, e) => s + e.total, 0); // cantidad de etiquetas
  }

  // Predice la emoción de una imagen que nadie etiquetó.
  async function predecir(src, emociones) {
    const v = await caracteristicas(src);
    const vecinos = entrenamiento
      .map(e => ({ ...e, sim: similitud(v, e.vector) }))
      .sort((a, b) => b.sim - a.sim);
    if (!vecinos.length) return null;

    // Peso de cada vecino: cuanto más parecido, más pesa (temperatura baja = más selectivo).
    const T = motor === "MobileNet" ? 0.05 : 0.08;
    const max = vecinos[0].sim;
    vecinos.forEach(n => (n.peso = Math.exp((n.sim - max) / T)));
    const sumaPesos = vecinos.reduce((s, n) => s + n.peso, 0);

    const prob = {};
    emociones.forEach(e => (prob[e.id] = 0));
    vecinos.forEach(n => {
      emociones.forEach(e => { prob[e.id] += (n.peso / sumaPesos) * ((n.votos[e.id] || 0) / n.total); });
    });
    return {
      prob,
      vecinos: vecinos.map(n => ({ obra: n.obra, parecido: n.sim, influencia: n.peso / sumaPesos }))
    };
  }

  return { iniciar, entrenar, predecir, motor: () => motor };
})();
