import { useState } from 'react';
import Clientes from './Clientes';
import Productos from './Productos';
import Inventario from './Inventario';

export function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('clientes');

  // Mapeo para mostrar títulos limpios (ej. "Clientes" en lugar de "CLIENTES")
  const titulosModulos = {
    clientes: 'Gestión de Clientes',
    productos: 'Productos & Servicios',
    inventario: 'Inventario y Stock'
  };

  return (
    <div style={styles.layout}>
      {/* Menú Lateral Moderno */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brandContainer}>
            <div style={styles.brandLogo}>SISE</div>
            <span style={styles.sidebarBrand}>SISE ERP</span>
          </div>

          <nav style={styles.nav}>
            <button 
              onClick={() => setActiveTab('clientes')} 
              style={{ 
                ...styles.navButton, 
                ...(activeTab === 'clientes' ? styles.navButtonActive : {}) 
              }}
            >
              <span style={styles.navIcon}>👥</span> Clientes
            </button>
            <button 
              onClick={() => setActiveTab('productos')} 
              style={{ 
                ...styles.navButton, 
                ...(activeTab === 'productos' ? styles.navButtonActive : {}) 
              }}
            >
              <span style={styles.navIcon}>📦</span> Productos & Servicios
            </button>
            <button 
              onClick={() => setActiveTab('inventario')} 
              style={{ 
                ...styles.navButton, 
                ...(activeTab === 'inventario' ? styles.navButtonActive : {}) 
              }}
            >
              <span style={styles.navIcon}>📊</span> Inventario y Stock
            </button>
          </nav>
        </div>

        <div style={styles.sidebarFooter}>
          <button onClick={onLogout} style={styles.logoutButton}>
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main style={styles.mainContent}>
        <header style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <h2 style={styles.topbarTitle}>{titulosModulos[activeTab]}</h2>
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.userBadge}>
              <div style={styles.userAvatar}>👤</div>
              <span style={styles.userName}>Administrador</span>
            </div>
          </div>
        </header>

        <div style={styles.contentContainer}>
          {activeTab === 'clientes' && <Clientes />}
          {activeTab === 'productos' && <Productos />}
          {activeTab === 'inventario' && <Inventario />}
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: { 
    display: 'flex', 
    height: '100vh', 
    overflow: 'hidden', 
    backgroundColor: '#f1f5f9', // Fondo general ligeramente más limpio y moderno
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif' 
  },
  sidebar: { 
    width: '280px', 
    backgroundColor: '#090d16', // Tono oscuro profundo más elegante
    color: '#ffffff', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    padding: '24px 16px',
    height: '100vh', 
    boxSizing: 'border-box',
    flexShrink: 0,
    borderRight: '1px solid #1e293b'
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingLeft: '12px',
    marginBottom: '36px'
  },
  brandLogo: {
    width: '36px',
    height: '36px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '15px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
  },
  sidebarBrand: { 
    fontSize: '18px', 
    fontWeight: '700', 
    color: '#ffffff', 
    letterSpacing: '0.5px' 
  },
  nav: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px' 
  },
  navButton: { 
    padding: '12px 16px', 
    textAlign: 'left', 
    border: 'none', 
    backgroundColor: 'transparent',
    color: '#94a3b8', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease'
  },
  navButtonActive: { 
    backgroundColor: '#1e293b', 
    color: '#38bdf8', 
    fontWeight: '600',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)'
  },
  navIcon: {
    fontSize: '16px'
  },
  sidebarFooter: {
    paddingTop: '16px',
    borderTop: '1px solid #1e293b'
  },
  logoutButton: { 
    width: '100%',
    padding: '12px 16px', 
    backgroundColor: 'rgba(220, 38, 38, 0.1)', 
    color: '#f87171', 
    border: '1px solid rgba(220, 38, 38, 0.2)', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  mainContent: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh', 
    overflow: 'hidden' 
  },
  topbar: { 
    height: '75px', 
    backgroundColor: '#ffffff', 
    borderBottom: '1px solid #e2e8f0', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: '0 36px', 
    flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
  },
  topbarLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  topbarTitle: { 
    fontSize: '18px', 
    fontWeight: '600',
    color: '#0f172a', 
    margin: 0 
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f8fafc',
    padding: '6px 14px',
    borderRadius: '30px',
    border: '1px solid #e2e8f0'
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    backgroundColor: '#e2e8f0',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px'
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155'
  },
  contentContainer: { 
    padding: '36px', 
    flex: 1, 
    overflowY: 'auto' 
  }
};