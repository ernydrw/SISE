import { useState } from 'react';

export function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Credenciales inválidas');
      }

      console.log('Respuesta del servidor:', data);

      // Notificamos a App.jsx que el login fue exitoso para abrir el Dashboard
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.cardContainer}>
        {/* Lado Izquierdo: Branding & Visual */}
        <div style={styles.brandPanel}>
          <div style={styles.brandBadge}>SISE ERP</div>
          <div style={styles.brandContent}>
            <h2 style={styles.brandTitle}>Gestión Integral y Operaciones</h2>
            <p style={styles.brandSubtitle}>
              Plataforma centralizada para administración de procesos, recursos y analítica en tiempo real.
            </p>
          </div>
          <div style={styles.brandFooter}>© 2026 Sistema empresarial</div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div style={styles.formPanel}>
          <div style={styles.header}>
            <h1 style={styles.title}>Bienvenido de nuevo</h1>
            <p style={styles.subtitle}>Ingresa tus credenciales para acceder</p>
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="nombre@empresa.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <label htmlFor="password" style={styles.label}>
                  Contraseña
                </label>
                <a href="#forgot" style={styles.forgotLink}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.optionsRow}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                Mantener sesión activa
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div style={styles.supportFooter}>
            ¿Necesitas ayuda? <a href="mailto:soporte@empresa.com" style={styles.supportLink}>Contactar a Soporte TI</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: '20px',
  },
  cardContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '900px',
    minHeight: '520px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
  },
  brandPanel: {
    flex: '1',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#ffffff',
    borderRight: '1px solid #334155',
  },
  brandBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#38bdf8',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(56, 189, 248, 0.3)',
  },
  brandContent: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  brandTitle: {
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '12px',
    color: '#f8fafc',
  },
  brandSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.6',
  },
  brandFooter: {
    fontSize: '12px',
    color: '#64748b',
  },
  formPanel: {
    flex: '1',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: '28px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textAlign: 'left',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    outline: 'none',
  },
  optionsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#475569',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#2563eb',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  forgotLink: {
    fontSize: '12px',
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '6px',
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  supportFooter: {
    marginTop: '28px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
  },
  supportLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500',
  },
};