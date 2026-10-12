/*
 * portal-config.js
 * Datos de conexión del portal. No son secretos: el Client ID solo funciona desde el origen
 * autorizado (https://tecnologia-westminster.github.io) y el Apps Script valida cada pedido.
 *
 * CLIENT_ID: OAuth Client ID "Portal web", proyecto credencial-westminster de Google Cloud
 *   (compartido con la credencial Fan West; pantalla de consentimiento Interno, app "Colegio Westminster").
 * APPS_SCRIPT_URL: URL /exec del Apps Script. Vacía hasta el despliegue: mientras tanto, cualquier
 *   cuenta del dominio entra a Infraestructura / IT y el formulario no guarda.
 */

const PORTAL_CONFIG = {
  CLIENT_ID: '556789473588-ktrruc6cvmbo9tsjni1gr268ugcdfjev.apps.googleusercontent.com',
  DOMINIO: 'colegiowestminster.com.ar',
  APPS_SCRIPT_URL: ''
};
