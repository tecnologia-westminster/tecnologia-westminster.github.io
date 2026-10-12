/*
 * pruebas.js — pruebas del Apps Script con Google simulado (Node 18 o más nuevo)
 *
 *   node apps-script/pruebas.js .
 *
 * Arma la planilla principal desde solicitudes-config.js (más filas inactivas y una columna
 * de más) y comprueba: configuracion igual a la copia local, bloqueo de alumnos y cuentas
 * externas, alta con ID correlativo, avisos por área y aviso compartido, validación de cada
 * campo, numeración por año y que un mail caído no anule el alta.
 */
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const REPO = process.argv[2];
const cfgSrc = fs.readFileSync(REPO + '/solicitudes-config.js', 'utf8');
const CFG = vm.runInNewContext(cfgSrc + '; CONFIG_SOLICITUDES');

// Planilla principal simulada desde la copia (más una categoría inactiva y una columna de más)
const niveles = [['Nivel', 'Activo', 'Notas']].concat(CFG.niveles.map(n => [n, 'SÍ', '']), [['Viejo', 'NO', '']]);
const aulas = [['Nivel', 'Aula o espacio', 'Tipo', 'Activo', 'Notas']];
for (const [n, l] of Object.entries(CFG.aulas)) {
  l.aulas.forEach(a => aulas.push([n, a, 'aula', 'SÍ', '']));
  l.espacios.forEach(e => aulas.push([n, e, 'espacio', 'SÍ', '']));
}
aulas.push(['Primario', 'Aula cerrada', 'aula', 'NO', '']);
const cats = [['Categoría', 'Área principal', 'Grupo', 'Aviso a', 'Prioridad', 'Admite texto libre', 'Activo', 'Notas']];
const descs = [['Categoría', 'Descripción', 'Activo']];
CFG.categorias.forEach(c => {
  cats.push([c.nombre, c.area, c.grupo || '', c.avisoA, c.prioridad, c.textoLibre ? 'SÍ' : 'NO', 'SÍ', '']);
  c.descripciones.forEach(d => descs.push([c.nombre, d, 'SÍ']));
});
cats.push(['Vieja', 'st', '', '', 'Bajo', 'NO', 'NO', '']);
descs.splice(2, 0, ['Sin internet / sin acceso', 'Descripción dada de baja', 'NO']);
const resp = [['Email', 'Nombre', 'Rol', 'Área', 'Nivel', 'Notificar', 'Activo', 'Fecha de alta', 'Notas'],
  ['tecnologia@colegiowestminster.com.ar', 'Tecnología', 'admin', 'todas', 'todos', 'NO', 'SÍ'],
  ['tecnologia@colegiowestminster.com.ar', 'Tecnología', 'admin', 'st', 'todos', 'SÍ', 'SÍ'],
  ['nicolas.trotvil@colegiowestminster.com.ar', 'Nicolás Trotvil', 'admin', 'todas', 'todos', 'NO', 'SÍ'],
  ['mantenimiento@colegiowestminster.com.ar', 'Alejo', 'editor', 'mantenimiento', 'todos', 'SÍ', 'SÍ']];
const acceso = [['Email', 'Tipo', 'Notas', 'Activo'], ['docente@colegiowestminster.com.ar', 'persona', '', 'SÍ']];

function hoja(valores) {
  return {
    v: valores,
    getDataRange() { return { getValues: () => this.v.map(f => f.slice()) }; },
    getLastRow() { return this.v.length; },
    getRange(r, c) { return { getValue: () => this.v[r - 1][c - 1] }; },
    appendRow(f) { this.v.push(f); }
  };
}
const principal = { Niveles: hoja(niveles), Aulas: hoja(aulas), 'Categorías': hoja(cats), Descripciones: hoja(descs), Responsables: hoja(resp), Acceso: hoja(acceso) };
const solicitudes = { Solicitudes: hoja([['ID']]) };
const mails = [];
let cache = {};
const tokens = {
  tok_docente: { aud: 'CID', email_verified: 'true', hd: 'colegiowestminster.com.ar', email: 'docente@colegiowestminster.com.ar', name: 'Docente Prueba' },
  tok_alumno: { aud: 'CID', email_verified: 'true', hd: 'colegiowestminster.com.ar', email: 'alumno@colegiowestminster.com.ar', name: 'Alumno' },
  tok_gmail: { aud: 'CID', email_verified: 'true', email: 'x@gmail.com', name: 'X' }
};
const ctx = {
  console,
  SpreadsheetApp: { openById: id => ({ getSheetByName: n => (id === 'PRINCIPAL' ? principal : solicitudes)[n] || null }), flush() {} },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => ({ PERMISOS_SHEET_ID: 'PRINCIPAL', SOLICITUDES_SHEET_ID: 'SOLIC', CLIENT_ID: 'CID' })[k] }) },
  CacheService: { getScriptCache: () => ({ get: k => cache[k] || null, put: (k, v) => { cache[k] = v; }, remove: k => { delete cache[k]; } }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  MailApp: { sendEmail: m => mails.push(m) },
  UrlFetchApp: { fetch: url => { const t = tokens[decodeURIComponent(url.split('id_token=')[1])]; return { getResponseCode: () => (t ? 200 : 400), getContentText: () => JSON.stringify(t || {}) }; } },
  GroupsApp: { getGroupByEmail() { throw new Error('sin grupos'); } },
  ContentService: { createTextOutput: t => ({ t, setMimeType() { return this; } }), MimeType: { JSON: 'json' } },
  Logger: { log() {} }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(REPO + '/apps-script/permisos.gs', 'utf8') + '\n' + fs.readFileSync(REPO + '/apps-script/solicitudes.gs', 'utf8'), ctx);
const post = body => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(body) } }).t);
let n = 0; const ok = (c, m) => { assert(c, m); n++; };

// configuracion = misma forma y contenido que solicitudes-config.js (sin lo inactivo)
const r1 = post({ accion: 'configuracion', idToken: 'tok_docente' });
ok(r1.ok, 'configuracion ok');
const norm = c => JSON.parse(JSON.stringify(c, (k, v) => (k === 'grupo' && v === undefined ? '' : v)));
const esperado = norm(CFG); esperado.categorias.forEach(c => { c.grupo = c.grupo || ''; });
assert.deepStrictEqual(r1.configuracion, esperado); n++;
ok(!JSON.stringify(r1.configuracion).includes('Aula cerrada') && !JSON.stringify(r1.configuracion).includes('Vieja') && !JSON.stringify(r1.configuracion).includes('dada de baja'), 'inactivos fuera');

// acceso
ok(post({ accion: 'configuracion', idToken: 'tok_alumno' }).error === 'sin_acceso', 'alumno bloqueado');
ok(post({ accion: 'configuracion', idToken: 'tok_gmail' }).error === 'dominio_no_permitido', 'gmail bloqueado');
ok(post({ accion: 'crearSolicitud', idToken: 'nada' }).error === 'token_invalido', 'token inválido');
ok(post({ accion: 'perfil', idToken: 'tok_alumno' }).acceso === false, 'perfil alumno sin acceso');

// alta normal IT → aviso solo a tecnologia@ (st, SÍ)
const base = { nivel: 'Primario', lugar: 'Aula 12', categoria: 'WiFi lento o sin señal', descripcion: 'Señal débil', detalle: '' };
let r = post({ accion: 'crearSolicitud', idToken: 'tok_docente', solicitud: base });
ok(r.ok && r.id === 'S-' + new Date().getFullYear() + '-0001' && r.area === 'st' && r.prioridad === 'Alto', 'alta 1 ' + JSON.stringify(r));
const fila = solicitudes.Solicitudes.v[1];
ok(fila.length === 19 && fila[2] === 'docente@colegiowestminster.com.ar' && fila[5] === 'Aula 12' && fila[12] === 'Nueva' && fila[18] === 'portal', 'fila guardada');
ok(mails.length === 1 && mails[0].to === 'tecnologia@colegiowestminster.com.ar' && mails[0].subject.startsWith('[S-'), 'mail IT ' + JSON.stringify(mails[0] && mails[0].to));

// compartida mantenimiento + aviso st → dos destinatarios, id correlativo
r = post({ accion: 'crearSolicitud', idToken: 'tok_docente', solicitud: { nivel: 'Secundario', lugar: 'Aula 3', categoria: 'Pantalla del proyector / soporte', descripcion: 'La pantalla no sube o no traba' } });
ok(r.ok && r.id.endsWith('-0002') && r.avisoA === 'st', 'alta 2 ' + JSON.stringify(r));
ok(mails[1].to === 'mantenimiento@colegiowestminster.com.ar,tecnologia@colegiowestminster.com.ar', 'mail compartida ' + mails[1].to);

// otro espacio, compra con texto libre, HTML escapado en el mail
r = post({ accion: 'crearSolicitud', idToken: 'tok_docente', solicitud: { nivel: 'Inicial', otroEspacio: true, lugar: 'Pasillo 1.er piso', categoria: 'Solicitud de compra', detalle: '<b>sillas</b> x4' } });
ok(r.ok, 'compra ' + JSON.stringify(r));
ok(solicitudes.Solicitudes.v[3][5] === 'Otro espacio: Pasillo 1.er piso' && solicitudes.Solicitudes.v[3][7] === '', 'otro espacio');
ok(mails[2].htmlBody.includes('&lt;b&gt;sillas') && !mails[2].htmlBody.includes('<b>sillas'), 'escape html');

// validaciones
const malos = [
  [{ ...base, nivel: 'Viejo' }, 'nivel'], [{ ...base, lugar: 'Aula 99' }, 'lugar'], [{ ...base, lugar: 'Aula cerrada' }, 'lugar'],
  [{ ...base, categoria: 'Vieja' }, 'categoria'], [{ ...base, descripcion: 'Inventada' }, 'descripcion'],
  [{ ...base, descripcion: 'Otro problema', detalle: ' ' }, 'detalle'], [{ ...base, detalle: 'x'.repeat(501) }, 'detalle'],
  [{ ...base, otroEspacio: true, lugar: 'x'.repeat(61) }, 'lugar'], [{ nivel: 'Primario', lugar: 'Aula 1', categoria: 'Solicitud de compra' }, 'detalle']
];
malos.forEach(([s, campo]) => ok(post({ accion: 'crearSolicitud', idToken: 'tok_docente', solicitud: s }).error === 'dato_invalido:' + campo, 'invalido ' + campo));
ok(solicitudes.Solicitudes.v.length === 4, 'inválidos no guardan');

// año nuevo reinicia numeración
solicitudes.Solicitudes.v.push(['S-2025-0420']);
ok(ctx.siguienteId_(solicitudes.Solicitudes, 2026) === 'S-2026-0001' && ctx.siguienteId_(solicitudes.Solicitudes, 2025) === 'S-2025-0421', 'numeración');

// mail que falla no anula el alta
solicitudes.Solicitudes.v.pop();
ctx.MailApp.sendEmail = () => { throw new Error('cuota'); };
const errOrig = console.error; console.error = () => {};
r = post({ accion: 'crearSolicitud', idToken: 'tok_docente', solicitud: base });
console.error = errOrig;
ok(r.ok && r.id.endsWith('-0004'), 'mail caído no anula');
ok(post({ accion: 'otra', idToken: 'tok_docente' }).error === 'accion_desconocida', 'acción desconocida');
console.log('OK ' + n + ' comprobaciones');
