// ============================================================
//  El robot que aprende a sentir — configuración
//  Acá se cambian las obras, las emociones y la conexión.
// ============================================================

window.CONFIG = {
  // URL de la aplicación web de Google Apps Script (ver apps-script/Codigo.gs).
  // Si queda vacía, el sistema funciona en MODO DEMO: los votos se guardan
  // en el navegador y sirven para probar votar.html y la pantalla en el mismo equipo.
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxPd41TSr9MY8JWPTbCi8sDxdzrbN7iNScIJ4llCgaY5wfBugP6rngZ7z5t8hzSbiOM/exec",

  // En modo demo, simula visitantes votando para que la pantalla se vea "viva".
  SIMULAR_VISITAS: true,

  // Segundos que cada obra queda en pantalla.
  SEGUNDOS_POR_OBRA: 9,

  // Cada cuántos segundos la pantalla vuelve a pedir los votos.
  SEGUNDOS_ACTUALIZAR: 15,

  // Las cuatro emociones, iguales para todas las obras.
  EMOCIONES: [
    { id: "alegria",    nombre: "Alegría",    frase: "Siento alegría",    color: "#F2B33D" },
    { id: "calma",      nombre: "Calma",      frase: "Siento calma",      color: "#7CC4A8" },
    { id: "asombro",    nombre: "Asombro",    frase: "Siento asombro",    color: "#C3A6F2" },
    { id: "curiosidad", nombre: "Curiosidad", frase: "Siento curiosidad", color: "#6FB3E0" }
  ],

  // Obras del recorrido (cada una tiene su QR: votar.html?obra=ID).
  // Fotos del Museo a Cielo Abierto de Casupá. Los títulos marcados como
  // provisorios son descriptivos: reemplazarlos si se conoce el nombre real.
  OBRAS: [
    { id: "1", nombre: "Casupá en colores", autor: "Nora Morales, 2021 · título provisorio", imagen: "img/obras/1-casupa-en-colores.jpg" },
    { id: "2", nombre: "Paloma liberada",   autor: "Nora Morales, 2021 · título provisorio", imagen: "img/obras/2-paloma-liberada.jpg" },
    { id: "3", nombre: "Gasupá, 1908",      autor: "Autor a confirmar · título provisorio",  imagen: "img/obras/3-gasupa-1908.jpg" },
    { id: "4", nombre: "Viejo molino",      autor: "Autor a confirmar",                      imagen: "img/obras/4-viejo-molino.jpg" }
  ],

  // La obra sorpresa NO tiene QR ni votos: el robot tiene que adivinar.
  SORPRESA: { id: "sorpresa", nombre: "Mujer en violeta", autor: "Autor a confirmar · título provisorio", imagen: "img/obras/sorpresa-mujer-en-violeta.jpg" },

  // Votos INVENTADOS de arranque para que la pantalla no empiece vacía (solo modo demo).
  VOTOS_SEMILLA: {
    "1": { alegria: 12, calma: 1,  asombro: 3, curiosidad: 4 },
    "2": { alegria: 5,  calma: 9,  asombro: 4, curiosidad: 1 },
    "3": { alegria: 0,  calma: 2,  asombro: 6, curiosidad: 10 },
    "4": { alegria: 1,  calma: 11, asombro: 2, curiosidad: 5 }
  }
};
