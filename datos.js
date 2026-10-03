// ============================================================
//  Datos: guardar y leer los votos (etiquetas)
//  - Con APPS_SCRIPT_URL: votos compartidos en una planilla de Google.
//  - Sin APPS_SCRIPT_URL: modo demo, votos guardados en este navegador.
//  Solo se guarda la obra y la emoción. Nada que identifique a la persona.
// ============================================================

window.Datos = (function () {
  const C = window.CONFIG;
  const CLAVE = "robot-emociones-votos";
  const enLinea = () => Boolean(C.APPS_SCRIPT_URL);

  function vacio() {
    const t = {};
    C.OBRAS.forEach(o => {
      t[o.id] = {};
      C.EMOCIONES.forEach(e => (t[o.id][e.id] = 0));
    });
    return t;
  }

  function leerLocal() {
    let extra = {};
    try { extra = JSON.parse(localStorage.getItem(CLAVE) || "{}"); } catch (e) { extra = {}; }
    const t = vacio();
    const sumar = fuente => Object.keys(fuente || {}).forEach(obra => {
      if (!t[obra]) return;
      Object.keys(fuente[obra]).forEach(em => {
        if (em in t[obra]) t[obra][em] += Number(fuente[obra][em]) || 0;
      });
    });
    sumar(C.VOTOS_SEMILLA);
    sumar(extra);
    return t;
  }

  function guardarLocal(obra, emocion) {
    let extra = {};
    try { extra = JSON.parse(localStorage.getItem(CLAVE) || "{}"); } catch (e) { extra = {}; }
    extra[obra] = extra[obra] || {};
    extra[obra][emocion] = (extra[obra][emocion] || 0) + 1;
    try { localStorage.setItem(CLAVE, JSON.stringify(extra)); } catch (e) { /* sin almacenamiento */ }
  }

  // Devuelve { obraId: { emocionId: cantidad } }
  async function conteos() {
    if (!enLinea()) return leerLocal();
    const r = await fetch(C.APPS_SCRIPT_URL + "?accion=conteos");
    const datos = await r.json();
    const t = vacio();
    Object.keys(datos).forEach(o => { if (t[o]) Object.assign(t[o], datos[o]); });
    return t;
  }

  async function votar(obra, emocion) {
    const valida = C.OBRAS.some(o => o.id === obra) && C.EMOCIONES.some(e => e.id === emocion);
    if (!valida) throw new Error("Obra o emoción no válida");
    if (!enLinea()) { guardarLocal(obra, emocion); return; }
    const url = C.APPS_SCRIPT_URL + "?accion=votar&obra=" + encodeURIComponent(obra) +
                "&emocion=" + encodeURIComponent(emocion);
    const r = await fetch(url);
    if (!r.ok) throw new Error("No se pudo guardar el voto");
  }

  return { conteos, votar, enLinea, guardarLocal, CLAVE };
})();
