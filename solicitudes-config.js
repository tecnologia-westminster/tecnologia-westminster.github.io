/*
 * solicitudes-config.js
 * Configuración del formulario de solicitudes: niveles, aulas, categorías y descripciones.
 * Fuente: planilla principal portal-westminster (pestañas Niveles, Aulas, Categorías, Descripciones).
 * Es una copia: cuando el Apps Script esté desplegado, el portal lee la planilla y este archivo
 * queda como respaldo. Hasta entonces, al cambiar la planilla hay que actualizar este archivo.
 * Copiado de la planilla: 2026-10-12.
 */

const CONFIG_SOLICITUDES = {
  areas: {
    st: 'IT',
    mantenimiento: 'Infraestructura'
  },
  niveles: ['Inicial', 'Primario', 'Secundario', 'Espacios comunes'],

  aulas: {
    'Inicial': {
      aulas: ['Aula 1', 'Aula 2', 'Aula 3', 'Aula 4 — Música e Inglés', 'Aula 5', 'Aula 6 — Cebras', 'Aula 7', 'Aula 8', 'Aula 9 — Pingüinos', 'Aula 10', 'Maternal — Sala Patos', 'Maternal — Sala Conejos'],
      espacios: ['SUM', 'Dirección', 'Recepción', 'Secretaría', 'Preceptoría', 'Cocina', 'Equipo Orientador', 'Oficina del primer piso', 'Parque', 'Patio', 'Baños del patio', 'Preceptoría de Maternal', 'Entrada de Maternal', 'Parque de Maternal']
    },
    'Primario': {
      aulas: ['Aula 1', 'Aula 2', 'Aula 3', 'Aula 4', 'Aula 5', 'Aula 6', 'Aula 7', 'Aula 8 — Sala de computación', 'Aula 9', 'Aula 10', 'Aula 11', 'Aula 12', 'Aula 13', 'Aula 14', 'Aula 15', 'Aula 16', 'Aula 17', 'Aula 18', 'Aula 19', 'Aula 20', 'Aula 21'],
      espacios: ['Robótica', 'Ludoteca', 'Sala de video', 'SUM', 'Comedor', 'Dirección', 'Vicedirección', 'Recepción', 'Secretaría', 'Tesorería', 'Sala de maestras', 'Preceptoría', 'Gerencia', 'Oficina de Deportes', 'Baños (Belgrano)', 'Pulmón', 'Parque']
    },
    'Secundario': {
      aulas: ['Aula 1', 'Aula 2', 'Aula 3', 'Aula 4', 'Aula 5', 'Aula 6', 'Aula 7', 'Aula 8', 'Aula 9', 'Aula 10', 'Aula 11', 'Aula 12', 'Aula 13', 'Aula 14', 'Aula 15', 'Aula 16'],
      espacios: ['Sala de computación', 'Idiomas', 'Preceptoría', 'Sala de profesores', 'Secretaría', 'Recepción', 'Dirección', 'Representación Legal', 'Oficina de Gerencia', 'Baños del pasillo', 'Escaleras']
    },
    'Espacios comunes': {
      aulas: [],
      espacios: ['Polideportivo', 'IMEF', 'Peña 140', 'Techos y canaletas', 'Frente y portones']
    }
  },

  categorias: [
    {
      nombre: 'Sin internet / sin acceso',
      area: 'st',
      avisoA: '',
      prioridad: 'Crítico',
      textoLibre: false,
      descripciones: ['No hay internet en esta PC', 'No hay internet en todo el sector', 'Internet intermitente o muy lento', 'Otro problema']
    },
    {
      nombre: 'PC no funciona bien',
      area: 'st',
      avisoA: '',
      prioridad: 'Alto',
      textoLibre: false,
      descripciones: ['No enciende', 'Se apaga sola', 'Muy lenta o se cuelga', 'Pantalla azul o negra', 'Puertos USB no funcionan', 'Otro problema']
    },
    {
      nombre: 'Proyector sin imagen / no conecta',
      area: 'st',
      avisoA: '',
      prioridad: 'Alto',
      textoLibre: false,
      descripciones: ['No da imagen', 'No reconoce la PC (HDMI)', 'Imagen borrosa o poco nítida', 'Imagen fuera de la pantalla', 'El control no lo enciende', 'Sin sonido en videos', 'Otro problema']
    },
    {
      nombre: 'Periférico roto',
      area: 'st',
      avisoA: '',
      prioridad: 'Medio',
      textoLibre: false,
      descripciones: ['Mouse no funciona o falta', 'Teclado no funciona o falta', 'Parlante sin sonido o con ruido', 'Cable HDMI roto', 'Cámara o micrófono', 'Otro problema']
    },
    {
      nombre: 'Impresora en red no imprime',
      area: 'st',
      avisoA: '',
      prioridad: 'Medio',
      textoLibre: false,
      descripciones: ['No imprime', 'Imprime mal o gastado', 'Falta tóner o cartucho', 'Otro problema']
    },
    {
      nombre: 'Software / consulta',
      area: 'st',
      avisoA: '',
      prioridad: 'Bajo',
      textoLibre: false,
      descripciones: ['Instalar un programa', 'No puedo abrir archivos o carpetas', 'Configurar la PC (suspensión, reloj, accesos directos)', 'Consulta', 'Otro problema']
    },
    {
      nombre: 'WiFi lento o sin señal',
      area: 'st',
      avisoA: '',
      prioridad: 'Alto',
      textoLibre: false,
      descripciones: ['Sin señal en el aula', 'Señal débil', 'No conecta con mi usuario', 'Otro problema']
    },
    {
      nombre: 'Cuenta o acceso',
      area: 'st',
      avisoA: '',
      prioridad: 'Alto',
      textoLibre: false,
      descripciones: ['Olvidé mi contraseña', 'No puedo entrar a mi cuenta', 'Necesito acceso a una carpeta o sistema', 'Otro problema']
    },
    {
      nombre: 'Punto de red nuevo / cableado',
      area: 'st',
      avisoA: 'mantenimiento',
      prioridad: 'Bajo',
      textoLibre: false,
      descripciones: ['Cablear un puesto nuevo', 'Ficha o cable de red roto', 'Mover un equipo de lugar', 'Otro problema']
    },
    {
      nombre: 'Aire acondicionado',
      area: 'mantenimiento',
      avisoA: '',
      prioridad: 'Alto',
      textoLibre: false,
      descripciones: ['No enfría o no calienta', 'Pierde agua dentro del aula', 'No enciende', 'Hace ruido', 'Las paletas no se mueven', 'Otro problema']
    },
    {
      nombre: 'Electricidad / luz',
      area: 'mantenimiento',
      avisoA: '',
      prioridad: 'Alto',
      textoLibre: false,
      descripciones: ['Tubo o foco quemado', 'Ilumina poco', 'Enchufe o zapatilla no funciona', 'Ventilador no funciona', 'Otro problema']
    },
    {
      nombre: 'Plomería',
      area: 'mantenimiento',
      avisoA: '',
      prioridad: 'Alto',
      textoLibre: false,
      descripciones: ['Inodoro o botón no funciona', 'Pérdida en canilla o pileta', 'No hay agua', 'Desagüe tapado', 'Otro problema']
    },
    {
      nombre: 'Mueble / puerta / ventana',
      area: 'mantenimiento',
      avisoA: '',
      prioridad: 'Medio',
      textoLibre: false,
      descripciones: ['La puerta no cierra', 'Cerradura, picaporte o llave', 'Silla, mesa o banco roto', 'Pizarrón suelto o roto', 'Cortina o blackout', 'Vidrio o ventana', 'Otro problema']
    },
    {
      nombre: 'Humedad y filtraciones',
      area: 'mantenimiento',
      avisoA: '',
      prioridad: 'Alto',
      textoLibre: false,
      descripciones: ['Entra agua por el techo', 'Humedad en pared o cielorraso', 'Canaletas tapadas', 'Otro problema']
    },
    {
      nombre: 'Instalación y colocación',
      area: 'mantenimiento',
      avisoA: '',
      prioridad: 'Bajo',
      textoLibre: false,
      descripciones: ['Colocar estante', 'Colocar percheros o ganchos', 'Colgar banner o cartelera', 'Colocar varilla o panel', 'Mover mobiliario', 'Otro problema']
    },
    {
      nombre: 'Pantalla del proyector / soporte',
      area: 'mantenimiento',
      avisoA: 'st',
      prioridad: 'Medio',
      textoLibre: false,
      descripciones: ['La pantalla no sube o no traba', 'El proyector está mal ubicado o bajo', 'Otro problema']
    },
    {
      nombre: 'Parque y juegos',
      area: 'mantenimiento',
      avisoA: '',
      prioridad: 'Medio',
      textoLibre: false,
      descripciones: ['Juego roto o suelto', 'Reja o portón', 'Otro problema']
    },
    {
      nombre: 'Limpieza extraordinaria',
      area: 'mantenimiento',
      avisoA: '',
      prioridad: 'Bajo',
      textoLibre: false,
      descripciones: ['Limpieza de un espacio', 'Retirar residuos o muebles', 'Otro problema']
    },
    {
      nombre: 'Solicitud de compra',
      area: 'mantenimiento',
      avisoA: 'st',
      prioridad: 'Bajo',
      textoLibre: true,
      descripciones: ['Otro problema']
    }
  ]
};
