/*
 * permisos.gs — Portal Institucional Colegio Westminster
 *
 * Lee la planilla de permisos y responde qué rol y sector tiene quien ingresa.
 * Los permisos se gestionan solo desde la planilla: este código no se toca para dar o quitar acceso.
 *
 * Despliegue (cuenta tecnologia@colegiowestminster.com.ar):
 *   1. Configuración del proyecto → Propiedades de la secuencia de comandos:
 *        PERMISOS_SHEET_ID = ID de la planilla permisos-portal-westminster
 *        CLIENT_ID         = OAuth Client ID del portal (Google Cloud)
 *   2. Implementar → Nueva implementación → Aplicación web
 *        Ejecutar como: Yo (tecnologia@)
 *        Quién tiene acceso: Cualquier usuario
 *      El acceso real lo controla verificarToken_(): sin token válido del dominio, no responde datos.
 *   3. Ejecutar probar() una vez desde el editor para autorizar el acceso a la planilla.
 *
 * Llamada desde el portal (POST, Content-Type text/plain para evitar preflight CORS):
 *   { "accion": "permisos", "idToken": "<ID token de Google Sign-In>" }
 * Respuesta:
 *   { "ok": true, "email": "...", "nombre": "...", "rol": "institucional|editor|admin", "sector": "mantenimiento|st|todos|null" }
 */

const DOMINIO = 'colegiowestminster.com.ar';
const HOJA_PERMISOS = 'Permisos';

// Columnas de la pestaña Permisos (base 0)
const COL = { email: 0, nombre: 1, rol: 2, sector: 3, activo: 4 };

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const usuario = verificarToken_(body.idToken);

    if (body.accion === 'permisos') {
      return responder_(Object.assign({ ok: true }, usuario, buscarPermiso_(usuario.email)));
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
 * Busca el email en la planilla. Sin fila activa = usuario institucional.
 */
function buscarPermiso_(email) {
  const sheetId = PropertiesService.getScriptProperties().getProperty('PERMISOS_SHEET_ID');
  const filas = SpreadsheetApp.openById(sheetId)
    .getSheetByName(HOJA_PERMISOS)
    .getDataRange()
    .getValues()
    .slice(1);

  const fila = filas.find(f =>
    String(f[COL.email]).trim().toLowerCase() === email &&
    esActivo_(f[COL.activo])
  );

  if (!fila) return { rol: 'institucional', sector: null };

  const rol = String(fila[COL.rol]).trim().toLowerCase();
  const sector = String(fila[COL.sector]).trim().toLowerCase();
  if (rol !== 'editor' && rol !== 'admin') return { rol: 'institucional', sector: null };

  return { rol: rol, sector: rol === 'admin' ? 'todos' : sector };
}

/**
 * Control que deben usar los paneles antes de devolver o modificar datos de un sector.
 */
function puedeEditar_(permiso, sector) {
  if (permiso.rol === 'admin') return true;
  return permiso.rol === 'editor' && permiso.sector === sector;
}

function esActivo_(valor) {
  const v = String(valor).trim().toUpperCase();
  return v === 'SÍ' || v === 'SI';
}

function responder_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Prueba manual desde el editor: autoriza el acceso y muestra el resultado en el registro. */
function probar() {
  Logger.log(buscarPermiso_('nicolas.trotvil@' + DOMINIO));
  Logger.log(buscarPermiso_('alejo@' + DOMINIO));
  Logger.log(buscarPermiso_('alguien@' + DOMINIO));
}
