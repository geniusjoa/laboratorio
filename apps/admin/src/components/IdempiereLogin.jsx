import React, { useState } from 'react';

export default function IdempiereLogin({ onLoginSuccess }) {
  const [userName, setUserName] = useState('admin @ gardenworld.com');
  const [password, setPassword] = useState('GardenAdmin');
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customBaseUrl, setCustomBaseUrl] = useState('');

  // Strict iDempiere Context Parameters
  const [parameters, setParameters] = useState({
    clientId: 11,
    roleId: 102,
    organizationId: 11, // Strict: organizationId (NUNCA orgId)
    warehouseId: 103,
    language: 'es_ES'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Quick Preset Handlers
  const handleLoadGardenWorld = () => {
    setUserName('admin @ gardenworld.com');
    setPassword('GardenAdmin');
    setParameters({
      clientId: 11,
      roleId: 102,
      organizationId: 11,
      warehouseId: 103,
      language: 'en_US'
    });
    setErrorMsg(null);
  };

  const handleLoadSuperUser = () => {
    setUserName('SuperUser');
    setPassword('System');
    setParameters({
      clientId: 0,
      roleId: 0,
      organizationId: 0,
      warehouseId: 103,
      language: 'es_ES'
    });
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // Direct call to our backend proxy which strictly fulfills:
      // POST /api/v1/auth/tokens with { userName, password, parameters: { clientId, roleId, organizationId, warehouseId, language } }
      const res = await fetch('/api/auth/idempiere-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userName,
          password,
          parameters,
          customBaseUrl: customBaseUrl.trim() || undefined
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        localStorage.setItem('galaxy_idempiere_session', JSON.stringify(data.data));
        onLoginSuccess(data.data);
      } else {
        setErrorMsg(data.error || 'Credenciales o parámetros inválidos en iDempiere ERP.');
      }
    } catch (err) {
      setErrorMsg(`Error de comunicación: ${err.message}. Verifique la conexión con el servidor.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0B0C10 0%, #151821 100%)',
      padding: '24px',
      color: '#0F172A'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        padding: '36px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #FF9F1C, #D97706)',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: '0 8px 20px rgba(217, 119, 6, 0.3)',
            marginBottom: '12px'
          }}>
            🍔
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Galaxy Burgers &bull; Admin
          </h1>
          <div style={{
            display: 'inline-block',
            background: '#FEF3C7',
            color: '#B45309',
            fontSize: '0.75rem',
            fontWeight: '800',
            padding: '3px 12px',
            borderRadius: '9999px',
            border: '1px solid #FDE68A',
            letterSpacing: '0.04em'
          }}>
            🔐 ACCESO iDempiere ERP REST API v1
          </div>
        </div>

        {/* Technical Directive Badge */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '12px 14px',
          marginBottom: '20px',
          fontSize: '0.78rem',
          color: '#475569',
          lineHeight: 1.45
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            <span>⚡ Servidor ERP:</span>
            <code style={{ background: '#E2E8F0', padding: '1px 5px', borderRadius: '4px', fontSize: '0.74rem', color: '#0F172A' }}>
              https://test.idempiere.org:443
            </code>
          </div>
          <div>
            Ruta: <code style={{ color: '#D97706', fontWeight: '700' }}>POST /api/v1/auth/tokens</code> con <code style={{ color: '#D97706', fontWeight: '700' }}>"parameters.organizationId"</code>.
          </div>
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={handleLoadGardenWorld}
            style={{
              flex: 1,
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              padding: '8px 10px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#334155',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Cargar admin @ gardenworld.com / GardenAdmin"
          >
            🌱 GardenWorld Demo
          </button>
          <button
            type="button"
            onClick={handleLoadSuperUser}
            style={{
              flex: 1,
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              padding: '8px 10px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#334155',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Cargar SuperUser / System"
          >
            👑 SuperUser System
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #F87171',
            color: '#991B1B',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            marginBottom: '18px',
            lineHeight: 1.4
          }}>
            <strong>❌ Error de Autenticación:</strong> {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* User Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
              Usuario iDempiere (userName) *
            </label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="admin @ gardenworld.com"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '3px', display: 'block' }}>
              Formato exacto requerido por el LoginCredential de iDempiere.
            </span>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#1E293B' }}>
                Contraseña (password) *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: '#D97706', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="GardenAdmin"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Collapsible ERP Context Parameters */}
          <div style={{ marginBottom: '20px', border: '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#F8FAFC',
                border: 'none',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '800',
                color: '#334155'
              }}
            >
              <span>⚙️ Parámetros de Contexto ERP ({parameters.clientId}, {parameters.roleId}, {parameters.organizationId})</span>
              <span>{showAdvanced ? '▲' : '▼'}</span>
            </button>

            {showAdvanced && (
              <div style={{ padding: '14px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '3px' }}>
                      Client ID (clientId)
                    </label>
                    <input
                      type="number"
                      value={parameters.clientId}
                      onChange={(e) => setParameters({ ...parameters, clientId: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '3px' }}>
                      Role ID (roleId)
                    </label>
                    <input
                      type="number"
                      value={parameters.roleId}
                      onChange={(e) => setParameters({ ...parameters, roleId: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#D97706', display: 'block', marginBottom: '3px' }}>
                      Org ID (organizationId) *
                    </label>
                    <input
                      type="number"
                      value={parameters.organizationId}
                      onChange={(e) => setParameters({ ...parameters, organizationId: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #F59E0B', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '3px' }}>
                      Warehouse ID (warehouseId)
                    </label>
                    <input
                      type="number"
                      value={parameters.warehouseId}
                      onChange={(e) => setParameters({ ...parameters, warehouseId: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '3px' }}>
                      Idioma (language)
                    </label>
                    <select
                      value={parameters.language}
                      onChange={(e) => setParameters({ ...parameters, language: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                    >
                      <option value="es_ES">Español (es_ES)</option>
                      <option value="en_US">English (en_US)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '3px' }}>
                      URL Base ERP (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://test.idempiere.org:443"
                      value={customBaseUrl}
                      onChange={(e) => setCustomBaseUrl(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #FF9F1C, #D97706)',
              color: '#FFFFFF',
              border: 'none',
              padding: '13px 20px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '900',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(217, 119, 6, 0.35)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <span>⏳ Autenticando contra iDempiere REST v1...</span>
              </>
            ) : (
              <>
                <span>🚀 Conectar e Iniciar Sesión ERP</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.74rem', color: '#94A3B8' }}>
          Ecosistema Galaxy Burgers &bull; Arquitectura MasterGeniusjoa &bull; Dokploy Ready
        </div>

      </div>
    </div>
  );
}

