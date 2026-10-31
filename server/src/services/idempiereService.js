/**
 * iDempiere ERP REST API v1 Authentication Service
 * 
 * Reglas Estrictas iDempiere REST API v1:
 * 1. Endpoint: POST /api/v1/auth/tokens (plural: /tokens)
 * 2. Headers: Content-Type: application/json, Accept: application/json
 * 3. Payload:
 *    {
 *      "userName": "admin @ gardenworld.com",
 *      "password": "GardenAdmin",
 *      "parameters": {
 *        "clientId": 11,
 *        "roleId": 102,
 *        "organizationId": 11,
 *        "warehouseId": 103,
 *        "language": "es_ES"
 *      }
 *    }
 */

const DEFAULT_IDEMPIERE_URL = process.env.IDEMPIERE_BASE_URL || 'http://localhost:8080';

// Active tokens store in memory for verification
const activeSessions = new Map();

/**
 * Authenticate against iDempiere ERP REST API v1
 */
async function authenticate({ userName, password, parameters = {}, customBaseUrl = null }) {
  const baseUrl = (customBaseUrl || DEFAULT_IDEMPIERE_URL).replace(/\/+$/, '');
  const endpoint = `${baseUrl}/api/v1/auth/tokens`;

  // Normalize parameters according to strict iDempiere specifications
  const clientId = Number(parameters.clientId !== undefined ? parameters.clientId : 11);
  const roleId = Number(parameters.roleId !== undefined ? parameters.roleId : 102);
  const organizationId = Number(parameters.organizationId !== undefined ? parameters.organizationId : (parameters.orgId !== undefined ? parameters.orgId : 11));
  const warehouseId = Number(parameters.warehouseId !== undefined ? parameters.warehouseId : 103);
  const language = parameters.language || 'es_ES';

  const strictPayload = {
    userName: userName ? String(userName).trim() : '',
    password: password ? String(password) : '',
    parameters: {
      clientId,
      roleId,
      organizationId,
      warehouseId,
      language
    }
  };

  console.log(`[iDempiere REST v1] Enviando POST a: ${endpoint}`);
  console.log(`[iDempiere REST v1] Payload parameters: clientId=${clientId}, roleId=${roleId}, organizationId=${organizationId}, warehouseId=${warehouseId}, language=${language}`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(strictPayload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await response.json().catch(() => null);

    if (response.ok && data) {
      // iDempiere returns token and context information
      const token = data.token || data.access_token || data.id_token;
      const sessionData = {
        token,
        tokenType: data.tokenType || 'Bearer',
        user: {
          userName: strictPayload.userName,
          name: data.name || strictPayload.userName,
          email: data.email || strictPayload.userName
        },
        parameters: strictPayload.parameters,
        idempiereUrl: baseUrl,
        isMockFallback: false,
        authenticatedAt: new Date().toISOString()
      };

      activeSessions.set(token, sessionData);
      return { success: true, data: sessionData };
    }

    // Handled error from iDempiere (e.g. 401, 400)
    console.warn(`[iDempiere REST v1] Respuesta no exitosa: HTTP ${response.status}`, data);
    return {
      success: false,
      status: response.status,
      error: data?.detail || data?.message || data?.error || `Credenciales o parámetros inválidos en iDempiere (HTTP ${response.status})`
    };

  } catch (networkError) {
    console.warn(`[iDempiere REST v1] Error de red o timeout al conectar a ${endpoint}:`, networkError.message);

    // MODO DE CONTINGENCIA / TOLERANCIA A FALLOS (Fallback Resiliente):
    // Permite validar credenciales de prueba estándar si iDempiere no se encuentra en línea
    const normalizedUser = (userName || '').replace(/\s+/g, '').toLowerCase();
    const isGardenWorldDemo = (normalizedUser === 'admin@gardenworld.com' || normalizedUser === 'admin') && password === 'GardenAdmin';
    const isSuperUserDemo = (normalizedUser === 'superuser' || normalizedUser === 'system') && password === 'System';

    if (isGardenWorldDemo || isSuperUserDemo) {
      console.log(`[iDempiere REST v1] Activando sesión de contingencia/demo para ${userName}`);
      const mockToken = `idempiere_jwt_mock_${Buffer.from(`${userName}:${Date.now()}`).toString('base64')}`;

      const sessionData = {
        token: mockToken,
        tokenType: 'Bearer',
        user: {
          userName: strictPayload.userName,
          name: isGardenWorldDemo ? 'GardenWorld Administrator' : 'SuperUser System Admin',
          email: isGardenWorldDemo ? 'admin@gardenworld.com' : 'superuser@system.org'
        },
        parameters: strictPayload.parameters,
        idempiereUrl: baseUrl,
        isMockFallback: true,
        warning: `iDempiere ERP no respondió en ${baseUrl}. Modo de contingencia/simulación activo para desarrollo e inspección.`,
        authenticatedAt: new Date().toISOString()
      };

      activeSessions.set(mockToken, sessionData);
      return { success: true, data: sessionData };
    }

    return {
      success: false,
      status: 503,
      error: `No se pudo establecer conexión con iDempiere ERP en ${endpoint}. Detalle: ${networkError.message}. Verifique la variable IDEMPIERE_BASE_URL o utilice las credenciales de demostración GardenWorld.`
    };
  }
}

/**
 * Validate active session token
 */
function validateSession(token) {
  if (!token) return null;
  const cleanToken = token.replace(/^Bearer\s+/i, '');
  return activeSessions.get(cleanToken) || null;
}

/**
 * Remove session
 */
function logoutSession(token) {
  if (!token) return true;
  const cleanToken = token.replace(/^Bearer\s+/i, '');
  activeSessions.delete(cleanToken);
  return true;
}

/**
 * Get iDempiere configuration and connectivity status
 */
async function getStatus(customBaseUrl = null) {
  const baseUrl = (customBaseUrl || DEFAULT_IDEMPIERE_URL).replace(/\/+$/, '');
  let isReachable = false;
  let responseTimeMs = null;

  try {
    const start = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    // Ping base url or swagger/api
    const res = await fetch(`${baseUrl}/api/v1/auth/tokens`, {
      method: 'OPTIONS',
      signal: controller.signal
    }).catch(() => null);

    clearTimeout(timeout);
    responseTimeMs = Date.now() - start;
    isReachable = !!res;
  } catch (e) {
    isReachable = false;
  }

  return {
    configuredUrl: baseUrl,
    isReachable,
    responseTimeMs,
    activeSessionsCount: activeSessions.size
  };
}

module.exports = {
  authenticate,
  validateSession,
  logoutSession,
  getStatus
};
