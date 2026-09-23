import { useState, useEffect } from 'react';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({ codigo: '', nombre: '', descripcion: '', precio: '', stock_actual: '', tipo: 'producto' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.codigo || !formData.nombre || !formData.precio) {
      setError('Código, nombre y precio son obligatorios.');
      return;
    }

    try {
      const url = editId 
        ? `http://localhost:5000/api/productos/${editId}` 
        : 'http://localhost:5000/api/productos';
      
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar producto');

      setSuccessMsg(editId ? 'Producto actualizado correctamente' : 'Producto registrado con éxito');
      setFormData({ codigo: '', nombre: '', descripcion: '', precio: '', stock_actual: '', tipo: 'producto' });
      setEditId(null);
      obtenerProductos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (prod) => {
    setEditId(prod.id);
    setFormData({
      codigo: prod.codigo || '',
      nombre: prod.nombre || '',
      descripcion: prod.descripcion || '',
      precio: prod.precio || '',
      stock_actual: prod.stock_actual || '',
      tipo: prod.tipo || 'producto',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar producto');
      obtenerProductos();
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setFormData({ codigo: '', nombre: '', descripcion: '', precio: '', stock_actual: '', tipo: 'producto' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerTitle}>
        <h2 style={styles.title}>Módulo de Productos & Servicios</h2>
        <p style={styles.subtitle}>Catálogo general y control de tarifas o existencias</p>
      </div>

      {/* Tarjeta de Formulario */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>{editId ? 'Editar Producto / Servicio' : 'Nuevo Producto o Servicio'}</h3>
        
        {error && <div style={styles.alertError}>{error}</div>}
        {successMsg && <div style={styles.alertSuccess}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Código *</label>
            <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} placeholder="Ej. PROD-001" style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del artículo" style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Precio ($) *</label>
            <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} placeholder="0.00" style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Tipo</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} style={styles.input}>
              <option value="producto">Producto</option>
              <option value="servicio">Servicio</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Stock Inicial</label>
            <input type="number" name="stock_actual" value={formData.stock_actual} onChange={handleChange} placeholder="0" style={styles.input} />
          </div>

          <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Descripción</label>
            <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Detalles o especificaciones" style={styles.input} />
          </div>

          <div style={styles.btnContainer}>
            {editId && (
              <button type="button" onClick={cancelarEdicion} style={styles.btnSecondary}>Cancelar</button>
            )}
            <button type="submit" style={styles.btnPrimary}>{editId ? 'Actualizar Producto' : 'Guardar Producto'}</button>
          </div>
        </form>
      </div>

      {/* Tabla de Productos */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Listado de Artículos ({productos.length})</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Stock</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyCell}>No hay productos registrados.</td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}><code>{p.codigo}</code></td>
                    <td style={styles.td}><strong>{p.nombre}</strong></td>
                    <td style={styles.td}>
                      <span style={p.tipo === 'servicio' ? styles.badgeService : styles.badgeProduct}>
                        {p.tipo}
                      </span>
                    </td>
                    <td style={styles.td}>${Number(p.precio).toFixed(2)}</td>
                    <td style={styles.td}>{p.stock_actual}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button onClick={() => handleEdit(p)} style={styles.editBtn} title="Editar">✏️</button>
                      <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn} title="Eliminar">🗑️</button>
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
  container: { padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' },
  headerTitle: { marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '24px', border: '1px solid #e2e8f0' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#475569' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#0f172a', outline: 'none', backgroundColor: '#fff' },
  btnContainer: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' },
  btnPrimary: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  btnSecondary: { backgroundColor: '#e2e8f0', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  alertError: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', border: '1px solid #fecaca' },
  alertSuccess: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', border: '1px solid #bbf7d0' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  thRow: { borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' },
  th: { padding: '12px 16px', fontWeight: '600', color: '#475569' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', color: '#334155' },
  emptyCell: { textAlign: 'center', padding: '30px', color: '#94a3b8' },
  badgeProduct: { backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  badgeService: { backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  editBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginRight: '8px' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
};