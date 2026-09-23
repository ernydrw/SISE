import { useState, useEffect } from 'react';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', empresa: '', direccion: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cargar clientes al montar el componente
  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clientes');
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.nombre || !formData.email) {
      setError('Nombre y Email son obligatorios.');
      return;
    }

    try {
      const url = editId 
        ? `http://localhost:5000/api/clientes/${editId}` 
        : 'http://localhost:5000/api/clientes';
      
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      setSuccessMsg(editId ? 'Cliente actualizado correctamente' : 'Cliente registrado con éxito');
      setFormData({ nombre: '', email: '', telefono: '', empresa: '', direccion: '' });
      setEditId(null);
      obtenerClientes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (cliente) => {
    setEditId(cliente.id);
    setFormData({
      nombre: cliente.nombre || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      empresa: cliente.empresa || '',
      direccion: cliente.direccion || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/clientes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      obtenerClientes();
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setFormData({ nombre: '', email: '', telefono: '', empresa: '', direccion: '' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerTitle}>
        <h2 style={styles.title}>Módulo de Clientes</h2>
        <p style={styles.subtitle}>Gestión del directorio y cartera comercial</p>
      </div>

      {/* Tarjeta del Formulario */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>{editId ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h3>
        
        {error && <div style={styles.alertError}>{error}</div>}
        {successMsg && <div style={styles.alertSuccess}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre completo *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan Pérez" style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo electrónico *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="cliente@correo.com" style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="3312345678" style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Empresa</label>
            <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} placeholder="Nombre de la empresa" style={styles.input} />
          </div>

          <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, número, ciudad" style={styles.input} />
          </div>

          <div style={styles.btnContainer}>
            {editId && (
              <button type="button" onClick={cancelarEdicion} style={styles.btnSecondary}>
                Cancelar
              </button>
            )}
            <button type="submit" style={styles.btnPrimary}>
              {editId ? 'Actualizar Cliente' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Registros */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Catálogo de Clientes ({clientes.length})</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Teléfono</th>
                <th style={styles.th}>Empresa</th>
                <th style={styles.th}>Dirección</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyCell}>No hay clientes registrados.</td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id} style={styles.tr}>
                    <td style={styles.td}><strong>{c.nombre}</strong></td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.telefono || '—'}</td>
                    <td style={styles.td}>{c.empresa || '—'}</td>
                    <td style={styles.td}>{c.direccion || '—'}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button onClick={() => handleEdit(c)} style={styles.editBtn} title="Editar">✏️</button>
                      <button onClick={() => handleDelete(c.id)} style={styles.deleteBtn} title="Eliminar">🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  headerTitle: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    marginBottom: '24px',
    border: '1px solid #e2e8f0',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    backgroundColor: '#fff',
  },
  btnContainer: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '8px',
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  alertError: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '14px',
    border: '1px solid #fecaca',
  },
  alertSuccess: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '14px',
    border: '1px solid #bbf7d0',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '14px',
  },
  thRow: {
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  th: {
    padding: '12px 16px',
    fontWeight: '600',
    color: '#475569',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '14px 16px',
    color: '#334155',
  },
  emptyCell: {
    textAlign: 'center',
    padding: '30px',
    color: '#94a3b8',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '8px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
};