/*
 * permisos.gs — Portal Institucional Colegio Westminster
 *
 * Modelo de lista de acceso: solo entra quien figura en la planilla de permisos.
 *   · Pestaña Acceso        → personas o grupos de Google que pueden entrar y enviar solicitudes
 *   · Pestaña Responsables  → quién gestiona cada área (st / mantenimiento) en cada nivel
 * Una cuenta del dominio que no figure (por ejemplo, un alumno) queda bloqueada.
 * Los permisos se gestionan solo desde la planilla: este código no se toca para dar o quitar acceso.
 *
 * Despliegue (cuenta tecnologia@colegiowestminster.com.ar):
 *   1. Configuración del proyecto → Propiedades de la secuencia de comandos:
 *        PERMISOS_SHEET_ID = ID de la planilla permisos-portal-westminster
 *        CLIENT_ID         = OAuth Client ID del portal (Google Cloud)
 *   2. Implementar → Nueva implementación → Aplicación web
 *        Ejecutar como: Yo (tecnologia@)
 *        Quién tiene acceso: Cualquier usuario
 *      El acceso real lo controlan verificarToken_() y obtenerPerfil_().
 *   3. Ejecutar probar() una vez desde el editor para autorizar Sheets y Groups.
 *
 * Llamada desde el portal (POST, Content-Type text/plain para evitar preflight CORS):
 *   { "accion": "perfil", "idToken": "<ID token de Google Sign-In>" }
 * Respuesta:
 *   { "ok": true, "email", "nombre", "acceso": true|false, "rol": "usuario|editor|admin|null",
 *     "responsabilidades": [{ "area": "st", "nivel": "primaria" }, ...] }
 */

const DOMINIO = 'colegiowestminster.com.ar';

// Columnas (base 0)
const ACCESO = { hoja: 'Acceso', email: 0, tipo: 1, activo: 3 };
const RESP = { hoja: 'Responsables', email: 0, nombre: 1, rol: 2, area: 3, nivel: 4, notificar: 5, activo: 6 };

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const usuario = verificarToken_(body.idToken);

    if (body.accion === 'perfil') {
      return responder_(Object.assign({ ok: true }, usuario, obtenerPerfil_(usuario.email)));
    }
    return responder_({ ok: false, error: 'accion_desconocida' });
  } catch (err) {
    return responder_({ ok: false, error: err.message });
  }
}

/**
 * Verifica el ID token con Google y exige cuenta del dominio institucional.
 * Devuelve { email, nombre } o lanza error.
 */
function verificarToken_(idToken) {
  if (!idToken) throw new Error('sin_token');

  const res = UrlFetchApp.fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
    { muteHttpExceptions: true }
  );
  if (res.getResponseCode() !== 200) throw new Error('token_invalido');

  const info = JSON.parse(res.getContentText());
  const clientId = PropertiesService.getScriptProperties().getProperty('CLIENT_ID');

  if (info.aud !== clientId) throw new Error('token_invalido');
  if (String(info.email_verified) !== 'true') throw new Error('email_no_verificado');
  if (info.hd !== DOMINIO) throw new Error('dominio_no_permitido');

  return { email: info.email.toLowerCase(), nombre: info.name || '' };
}

/**
 * Perfil de quien ingresa. Responsables activos tienen acceso implícito.
 */
function obtenerPerfil_(email) {
  const libro = abrirPlanilla_();
  const responsabilidades = filasActivas_(libro, RESP)
    .filter(f => normalizar_(f[RESP.email]) === email)
    .map(f => ({
      rol: normalizar_(f[RESP.rol]),
      area: normalizar_(f[RESP.area]),
      nivel: normalizar_(f[RESP.nivel])
    }))
    .filter(r => r.rol === 'editor' || r.rol === 'admin');

  if (responsabilidades.some(r => r.rol === 'admin')) {
    return { acceso: true, rol: 'admin', responsabilidades: [{ area: 'todas', nivel: 'todos' }] };
  }
  if (responsabilidades.length) {
    return {
      acceso: true,
      rol: 'editor',
      responsabilidades: responsabilidades.map(r => ({ area: r.area, nivel: r.nivel }))
    };
  }
  if (tieneAcceso_(libro, email)) {
    return { acceso: true, rol: 'usuario', responsabilidades: [] };
  }
  return { acceso: false, rol: null, responsabilidades: [] };
}

/** Busca el email en la pestaña Acceso, directo o como miembro de un grupo. */
function tieneAcceso_(libro, email) {
  const filas = filasActivas_(libro, ACCESO);

  if (filas.some(f => normalizar_(f[ACCESO.tipo]) === 'persona' && normalizar_(f[ACCESO.email]) === email)) {
    return true;
  }
  return filas
    .filter(f => normalizar_(f[ACCESO.tipo]) === 'grupo')
    .some(f => esMiembro_(normalizar_(f[ACCESO.email]), email));
}

/** Miembro directo de un grupo de Google. Si el grupo no existe o no es visible, devuelve false. */
function esMiembro_(grupo, email) {
  try {
    return GroupsApp.getGroupByEmail(grupo).hasUser(email);
  } catch (err) {
    return false;
  }
}

/**
 * Control que deben usar los paneles antes de devolver o modificar una solicitud.
 * area: 'st' | 'mantenimiento' · nivel: nivel de la solicitud (ej. 'Primaria')
 */
function puedeGestionar_(perfil, area, nivel) {
  if (perfil.rol === 'admin') return true;
  if (perfil.rol !== 'editor') return false;
  const a = normalizar_(area);
  const n = normalizar_(nivel);
  return perfil.responsabilidades.some(r =>
    (r.area === a || r.area === 'todas') && (r.nivel === n || r.nivel === 'todos')
  );
}

/**
 * Responsables de un área y nivel. Lo usa el alta de solicitudes para decidir a quién avisar.
 * Las filas admin también se filtran por área y nivel: así una fila admin · st · Notificar SÍ
 * avisa solo las solicitudes de IT, y la fila admin · todas · Notificar NO no avisa nada.
 * Devuelve [{ email, nombre, notificar }]
 */
function responsablesDe_(area, nivel) {
  const a = normalizar_(area);
  const n = normalizar_(nivel);
  return filasActivas_(abrirPlanilla_(), RESP)
    .filter(f => {
      const rol = normalizar_(f[RESP.rol]);
      const fa = normalizar_(f[RESP.area]);
      const fn = normalizar_(f[RESP.nivel]);
      return (rol === 'editor' || rol === 'admin') && (fa === a || fa === 'todas') && (fn === n || fn === 'todos');
    })
    .map(f => ({
      email: normalizar_(f[RESP.email]),
      nombre: String(f[RESP.nombre]).trim(),
      notificar: esSi_(f[RESP.notificar])
    }));
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

function abrirPlanilla_() {
  const id = PropertiesService.getScriptProperties().getProperty('PERMISOS_SHEET_ID');
  return SpreadsheetApp.openById(id);
}

function filasActivas_(libro, def) {
  return libro.getSheetByName(def.hoja)
    .getDataRange()
    .getValues()
    .slice(1)
    .filter(f => String(f[def.email]).trim() !== '' && esSi_(f[def.activo]));
}

/** Minúsculas, sin espacios ni tildes: "Jardín " → "jardin" */
function normalizar_(valor) {
  return String(valor).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function esSi_(valor) {
  return normalizar_(valor) === 'si';
}

function responder_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Prueba manual desde el editor: autoriza Sheets y Groups y muestra el resultado en el registro. */
function probar() {
  Logger.log(obtenerPerfil_('nicolas.trotvil@' + DOMINIO));
  Logger.log(obtenerPerfil_('mantenimiento@' + DOMINIO));
  Logger.log(obtenerPerfil_('alumno.prueba@' + DOMINIO));
  Logger.log(responsablesDe_('mantenimiento', 'Primario'));
  Logger.log(responsablesDe_('st', 'Secundario'));
}
