# El robot que aprende a sentir

Proyecto para el 10.º Encuentro Interinstitucional de Robótica Educativa, *Tierra de leyendas* (Casupá, 2026).
Asignatura Inteligencia Artificial 2026 · Profesorado de Informática · CeRP del Centro.

Los visitantes recorren el Museo a Cielo Abierto, escanean el QR de cada obra y eligen la emoción que les provoca (alegría, calma, asombro o curiosidad).
Cada voto es un **dato etiquetado** (obra → emoción). Con esos datos se entrena un modelo de **aprendizaje supervisado**,
y la pantalla del stand muestra lo que el robot "siente" ante cada obra y lo que **predice** ante una obra sorpresa que nadie etiquetó.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Pantalla del stand: obra, emociones aprendidas, predicción sobre la obra sorpresa. |
| `votar.html` | Página que abre el QR. Ej.: `votar.html?obra=3`. |
| `config.js` | Obras, emociones, tiempos y conexión. |
| `datos.js` | Guarda y lee los votos (planilla de Google o modo demo). |
| `modelo.js` | Extrae características de las imágenes (MobileNet o colores) y predice con vecinos más cercanos. |
| `apps-script/Codigo.gs` | Servidor de votos en Google Apps Script. |
| `img/` | Fondo del robot y fotos de las obras. |

## Cómo funciona el modelo

1. **Características**: cada imagen se transforma en una lista de números. Con internet se usa MobileNet
   (red neuronal preentrenada, 1024 números por imagen); sin internet, un histograma de colores.
2. **Entrenamiento**: cada voto es un ejemplo etiquetado. El robot guarda, para cada obra, sus características y sus etiquetas.
3. **Predicción**: ante una imagen nueva busca las obras más parecidas y combina sus etiquetas, pesando más las más parecidas
   (*k* vecinos más cercanos ponderados). Es el mismo principio que usa Teachable Machine.

## Privacidad

Solo se guarda la obra, la emoción y la fecha del voto. No se piden cuentas, nombres ni datos del dispositivo,
y los visitantes no usan ningún servicio de IA con restricción de edad.

## Licencia

El código de este proyecto se distribuye bajo licencia MIT (ver `LICENSE`).
Las imágenes de las obras del Museo a Cielo Abierto de Casupá pertenecen a sus autores y se incluyen solo con fines educativos, para el 10.º Encuentro Interinstitucional de Robótica Educativa. No están cubiertas por la licencia MIT.
