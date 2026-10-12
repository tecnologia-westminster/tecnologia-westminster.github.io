/*
 * solicitudes.gs — Portal Institucional Colegio Westminster
 *
 * Acciones del formulario de solicitudes (v1):
 *   · configuracion  → niveles, aulas, categorías y descripciones activas de la planilla principal
 *   · crearSolicitud → valida contra la configuración, rutea, guarda en la planilla de Solicitudes
 *                      y avisa a los responsables con Notificar = SÍ
 *
 * Usa las utilidades de permisos.gs (abrirPlanilla_, responsablesDe_, normalizar_, esSi_).
 *
 * Despliegue, además de lo indicado en permisos.gs:
 *   1. Propiedad SOLICITUDES_SHEET_ID = ID de la planilla de Solicitudes (dueño tecnologia@)
 *   2. Ejecutar prepararPlanillaSolicitudes() una vez desde el editor: crea la pestaña
 *      Solicitudes con sus encabezados si no existe
 *
 * La configuración se guarda 5 minutos en caché: un cambio en la planilla tarda hasta
 * 5 minutos en verse en el portal.
 */

const COLUMNAS_SOLICITUD = [
  'ID', 'Fecha de creación', 'Email solicitante', 'Nombre solicitante', 'Nivel', 'Aula / espacio',
  'Categoría', 'Descripción', 'Detalle adicional', 'Área', 'Aviso a', 'Prioridad', 'Estado',
  'Responsable asignado', 'Duplicado de', 'Comentario', 'Fecha de actualización',
  'Fecha de resolución', 'Origen'
];
const HOJA_SOLICITUDES = 'Solicitudes';
const OTRO_ESPACIO = 'Otro espacio';
const OTRO_PROBLEMA = 'Otro problema';
const MAX_DETALLE = 500;
const MAX_OTRO_ESPACIO = 60;
const NOMBRES_AREA = { st: 'IT', mantenimiento: 'Infraestructura' };
const URL_PORTAL = 'https://tecnologia-westminster.github.io';

// ─── Configuración ───────────────────────────────────────────────────────────

/**
 * Misma forma que CONFIG_SOLICITUDES en solicitudes-config.js:
 * { areas, niveles, aulas: { nivel: { aulas, espacios } }, categorias: [{ nombre, area, grupo, avisoA, prioridad, textoLibre, descripciones }] }
 */
function configuracion_() {
  const cache = CacheService.getScriptCache();
  const guardada = cache.get('configuracion');
  if (guardada) return JSON.parse(guardada);

  const libro = abrirPlanilla_();
  const niveles = tabla_(libro, 'Niveles').filter(f => esSi_(f['Activo'])).map(f => texto_(f['Nivel']));

  const aulas = {};
  niveles.forEach(n => { aulas[n] = { aulas: [], espacios: [] }; });
  tabla_(libro, 'Aulas').filter(f => esSi_(f['Activo'])).forEach(f => {
    const nivel = aulas[texto_(f['Nivel'])];
    if (!nivel) return;
    (normalizar_(f['Tipo']) === 'aula' ? nivel.aulas : nivel.espacios).push(texto_(f['Aula o espacio']));
  });

  const descripciones = {};
  tabla_(libro, 'Descripciones').filter(f => esSi_(f['Activo'])).forEach(f => {
    const cat = texto_(f['Categoría']);
    (descripciones[cat] = descripciones[cat] || []).push(texto_(f['Descripción']));
  });

  const categorias = tabla_(libro, 'Categorías').filter(f => esSi_(f['Activo'])).map(f => {
    const nombre = texto_(f['Categoría']);
    const desc = (descripciones[nombre] || []).filter(d => d !== OTRO_PROBLEMA);
    return {
      nombre: nombre,
      area: normalizar_(f['Área principal']),
      grupo: texto_(f['Grupo']),
      avisoA: normalizar_(f['Aviso a']),
      prioridad: texto_(f['Prioridad']),
      textoLibre: esSi_(f['Admite texto libre']),
      descripciones: desc.concat(OTRO_PROBLEMA)   // "Otro problema" siempre al final
    };
  });

  const config = { areas: NOMBRES_AREA, niveles: niveles, aulas: aulas, categorias: categorias };
  cache.put('configuracion', JSON.stringify(config), 300);
  return config;
}

// ─── Alta de solicitudes ─────────────────────────────────────────────────────

/**
 * datos: { nivel, lugar, otroEspacio (bool), categoria, descripcion, detalle }
 * Devuelve { id, area, avisoA, prioridad }
 */
function crearSolicitud_(usuario, datos) {
  const s = validarSolicitud_(datos || {}, configuracion_());
  const ahora = new Date();
  const hoja = abrirSolicitudes_();

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  let id;
  try {
    id = siguienteId_(hoja, ahora.getFullYear());
    const fila = {
      'ID': id,
      'Fecha de creación': ahora,
      'Email solicitante': usuario.email,
      'Nombre solicitante': usuario.nombre,
      'Nivel': s.nivel,
      'Aula / espacio': s.lugar,
      'Categoría': s.categoria.nombre,
      'Descripción': s.descripcion,
      'Detalle adicional': s.detalle,
      'Área': s.categoria.area,
      'Aviso a': s.categoria.avisoA,
      'Prioridad': s.categoria.prioridad,
      'Estado': 'Nueva',
      'Fecha de actualización': ahora,
      'Origen': 'portal'
    };
    hoja.appendRow(COLUMNAS_SOLICITUD.map(col => (col in fila ? fila[col] : '')));
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  // Un aviso que falla no anula la solicitud: queda guardada y se ve en el panel
  try {
    avisarResponsables_(id, usuario, s);
  } catch (err) {
    console.error('Aviso de ' + id + ' no enviado: ' + err.message);
  }

  return { id: id, area: s.categoria.area, avisoA: s.categoria.avisoA, prioridad: s.categoria.prioridad };
}

/** Valida cada campo contra la configuración vigente. Lanza 'dato_invalido:<campo>'. */
function validarSolicitud_(d, config) {
  const invalido = campo => { throw new Error('dato_invalido:' + campo); };

  const nivel = texto_(d.nivel);
  if (config.niveles.indexOf(nivel) === -1) invalido('nivel');

  let lugar = texto_(d.lugar);
  if (d.otroEspacio) {
    if (!lugar || lugar.length > MAX_OTRO_ESPACIO) invalido('lugar');
    lugar = OTRO_ESPACIO + ': ' + lugar;
  } else {
    const lugares = config.aulas[nivel];
    if (lugares.aulas.indexOf(lugar) === -1 && lugares.espacios.indexOf(lugar) === -1) invalido('lugar');
  }

  const categoria = config.categorias.filter(c => c.nombre === texto_(d.categoria))[0];
  if (!categoria) invalido('categoria');

  const descripcion = categoria.textoLibre ? '' : texto_(d.descripcion);
  if (!categoria.textoLibre && categoria.descripciones.indexOf(descripcion) === -1) invalido('descripcion');

  const detalle = texto_(d.detalle);
  if (detalle.length > MAX_DETALLE) invalido('detalle');
  if ((categoria.textoLibre || descripcion === OTRO_PROBLEMA) && !detalle) invalido('detalle');

  return { nivel: nivel, lugar: lugar, categoria: categoria, descripcion: descripcion, detalle: detalle };
}

/** S-2026-0001, S-2026-0002… La numeración vuelve a 0001 cada año. Llamar con el lock tomado. */
function siguienteId_(hoja, anio) {
  const prefijo = 'S-' + anio + '-';
  const ultima = hoja.getLastRow();
  let numero = 0;
  if (ultima > 1) {
    const anterior = String(hoja.getRange(ultima, 1).getValue());
    if (anterior.indexOf(prefijo) === 0) numero = parseInt(anterior.slice(prefijo.length), 10) || 0;
  }
  return prefijo + ('000' + (numero + 1)).slice(-4);
}

/** Responsables del área principal y del área de aviso, con Notificar = SÍ, sin repetir. */
function avisarResponsables_(id, usuario, s) {
  const c = s.categoria;
  const areas = c.avisoA ? [c.area, c.avisoA] : [c.area];
  const destinatarios = [];
  areas.forEach(area => responsablesDe_(area, s.nivel).forEach(r => {
    if (r.notificar && destinatarios.indexOf(r.email) === -1) destinatarios.push(r.email);
  }));
  if (!destinatarios.length) return;

  const asunto = '[' + id + '] ' + c.nombre + ' — ' + s.nivel + ', ' + s.lugar;
  const filas = [
    ['Qué pasa', s.descripcion || '—'],
    ['Detalle', s.detalle || '—'],
    ['Nivel', s.nivel],
    ['Aula o espacio', s.lugar],
    ['Área', NOMBRES_AREA[c.area] + (c.avisoA ? ' (aviso a ' + NOMBRES_AREA[c.avisoA] + ')' : '')],
    ['Prioridad', c.prioridad],
    ['Pedido por', usuario.nombre + ' · ' + usuario.email]
  ];
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:14px;color:#4A4A4A;">' +
    '<p style="color:#236192;font-size:16px;margin:0 0 12px;"><b>Nueva solicitud ' + id + '</b></p>' +
    '<p style="margin:0 0 12px;"><b>' + html_(c.nombre) + '</b></p>' +
    '<table style="border-collapse:collapse;font-size:14px;">' +
    filas.map(f => '<tr><td style="padding:4px 16px 4px 0;color:#75787B;vertical-align:top;">' + f[0] +
      '</td><td style="padding:4px 0;">' + html_(f[1]) + '</td></tr>').join('') +
    '</table>' +
    '<p style="margin:16px 0 0;color:#75787B;font-size:12px;">Portal institucional · ' + URL_PORTAL + '</p>' +
    '</div>';

  MailApp.sendEmail({
    to: destinatarios.join(','),
    subject: asunto,
    htmlBody: html,
    replyTo: usuario.email,
    name: 'Portal Westminster'
  });
}

// ─── Planilla de Solicitudes ─────────────────────────────────────────────────

function abrirSolicitudes_() {
  const id = PropertiesService.getScriptProperties().getProperty('SOLICITUDES_SHEET_ID');
  if (!id) throw new Error('sin_planilla_solicitudes');
  const hoja = SpreadsheetApp.openById(id).getSheetByName(HOJA_SOLICITUDES);
  if (!hoja) throw new Error('sin_planilla_solicitudes');
  return hoja;
}

/** Ejecutar una vez desde el editor: crea la pestaña Solicitudes con encabezados. No toca datos existentes. */
function prepararPlanillaSolicitudes() {
  const libro = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SOLICITUDES_SHEET_ID'));
  const hoja = libro.getSheetByName(HOJA_SOLICITUDES) || libro.insertSheet(HOJA_SOLICITUDES, 0);
  if (hoja.getLastRow() > 0) {
    Logger.log('La pestaña Solicitudes ya tiene datos: no se modifica.');
    return;
  }
  hoja.getRange(1, 1, 1, COLUMNAS_SOLICITUD.length).setValues([COLUMNAS_SOLICITUD]).setFontWeight('bold').setBackground('#EFEAE0');
  hoja.setFrozenRows(1);
  Logger.log('Pestaña Solicitudes lista con ' + COLUMNAS_SOLICITUD.length + ' columnas.');
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

/** Filas de una pestaña como objetos { encabezado: valor }. Las columnas se buscan por nombre. */
function tabla_(libro, nombreHoja) {
  const valores = libro.getSheetByName(nombreHoja).getDataRange().getValues();
  const encabezados = valores[0].map(texto_);
  return valores.slice(1)
    .filter(f => texto_(f[0]) !== '')
    .map(f => {
      const fila = {};
      encabezados.forEach((e, i) => { fila[e] = f[i]; });
      return fila;
    });
}

function texto_(valor) {
  return valor === null || valor === undefined ? '' : String(valor).trim();
}

function html_(valor) {
  return String(valor).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Prueba manual desde el editor: configuración leída de la planilla. */
function probarConfiguracion() {
  CacheService.getScriptCache().remove('configuracion');
  const c = configuracion_();
  Logger.log(c.niveles);
  Logger.log(c.categorias.length + ' categorías');
  Logger.log(c.categorias.map(x => x.nombre + ' · ' + x.area + (x.grupo ? ' · ' + x.grupo : '')).join('\n'));
}
