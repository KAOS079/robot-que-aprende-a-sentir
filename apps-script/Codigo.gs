/**
 * El robot que aprende a sentir — servidor de votos en Google Apps Script
 *
 * Cómo instalarlo:
 * 1. Crear una planilla de Google nueva.
 * 2. Menú Extensiones > Apps Script. Borrar lo que haya y pegar este archivo.
 * 3. Implementar > Nueva implementación > Tipo: Aplicación web.
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 4. Copiar la URL que termina en /exec y pegarla en config.js (APPS_SCRIPT_URL).
 *
 * Solo se guarda fecha, obra y emoción. Nada que identifique a quien vota.
 */

const OBRAS_VALIDAS = ["1", "2", "3", "4"];
const EMOCIONES_VALIDAS = ["alegria", "calma", "asombro", "curiosidad"];

function hoja_() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName("Votos");
  if (!hoja) {
    hoja = libro.insertSheet("Votos");
    hoja.appendRow(["fecha", "obra", "emocion"]);
  }
  return hoja;
}

function conteos_() {
  const filas = hoja_().getDataRange().getValues().slice(1);
  const t = {};
  OBRAS_VALIDAS.forEach(o => {
    t[o] = {};
    EMOCIONES_VALIDAS.forEach(e => (t[o][e] = 0));
  });
  filas.forEach(([, obra, emocion]) => {
    obra = String(obra);
    if (t[obra] && emocion in t[obra]) t[obra][emocion]++;
  });
  return t;
}

function respuesta_(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.accion === "votar") {
    const obra = String(p.obra || "");
    const emocion = String(p.emocion || "");
    if (OBRAS_VALIDAS.indexOf(obra) === -1 || EMOCIONES_VALIDAS.indexOf(emocion) === -1) {
      return respuesta_({ error: "Obra o emoción no válida" });
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      hoja_().appendRow([new Date(), obra, emocion]);
    } finally {
      lock.releaseLock();
    }
  }
  return respuesta_(conteos_());
}
