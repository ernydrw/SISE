import { useState, useEffect } from 'react';

export default function Inventario() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({ producto_id: '', tipo: 'entrada', cantidad: '', motivo: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resMov, resProd] = await Promise.all([
        fetch('http://localhost:5000/api/inventario'),
        fetch('http://localhost:5000/api/productos')
      ]);
      const dataMov = await resMov.json();
      const dataProd = await resProd.json();
      setMovimientos(dataMov);
      setProductos(dataProd);
    } catch (err) {
      console.error('Error al cargar inventario:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.producto_id || !formData.cantidad || Number(formData.cantidad) <= 0) {
      setError('Selecciona un producto y una cantidad válida.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar movimiento');

      setSuccessMsg('Movimiento registrado y stock actualizado con éxito');
      setFormData({ producto_id: '', tipo: 'entrada', cantidad: '', motivo: '' });
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerTitle}>
        <h2 style={styles.title}>Módulo de Inventario y Stock</h2>
        <p style={styles.subtitle}>Control de entradas, salidas y trazabilidad de almacén</p>
      </div>

      {/* Tarjeta de Registro de Movimiento */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Registrar Movimiento de Almacén</h3>
        
        {error && <div style={styles.alertError}>{error}</div>}
        {successMsg && <div style={styles.alertSuccess}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Producto *</label>
            <select name="producto_id" value={formData.producto_id} onChange={handleChange} style={styles.input} required>
              <option value="">Selecciona un producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.codigo} - {p.nombre} (Stock actual: {p.stock_actual})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Tipo de Movimiento *</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} style={styles.input}>
              <option value="entrada">Entrada (Compra / Abastecimiento)</option>
              <option value="salida">Salida (Venta / Merma)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Cantidad *</label>
            <input type="number" name="cantidad" min="1" value={formData.cantidad} onChange={handleChange} placeholder="Ej. 10" style={styles.input} required />
          </div>

          <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Motivo / Observaciones</label>
            <input type="text" name="motivo" value={formData.motivo} onChange={handleChange} placeholder="Ej. Compra a proveedor / Ajuste de inventario" style={styles.input} />
          </div>

          <div style={styles.btnContainer}>
            <button type="submit" style={styles.btnPrimary}>Registrar Movimiento</button>
          </div>
        </form>
      </div>

      {/* Historial de Movimientos */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Historial de Movimientos ({movimientos.length})</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Cantidad</th>
                <th style={styles.th}>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyCell}>No hay movimientos registrados.</td>
                </tr>
              ) : (
                movimientos.map((m) => (
                  <tr key={m.id} style={styles.tr}>
                    <td style={styles.td}>{new Date(m.fecha).toLocaleString()}</td>
                    <td style={styles.td}><code>{m.codigo}</code></td>
                    <td style={styles.td}><strong>{m.producto_nombre}</strong></td>
                    <td style={styles.td}>
                      <span style={m.tipo === 'entrada' ? styles.badgeEntrada : styles.badgeSalida}>
                        {m.tipo.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <strong style={{ color: m.tipo === 'entrada' ? '#16a34a' : '#dc2626' }}>
                        {m.tipo === 'entrada' ? `+${m.cantidad}` : `-${m.cantidad}`}
                      </strong>
                    </td>
                    <td style={styles.td}>{m.motivo || '—'}</td>
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
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#475569' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#0f172a', outline: 'none', backgroundColor: '#fff' },
  btnContainer: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' },
  btnPrimary: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  alertError: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', border: '1px solid #fecaca' },
  alertSuccess: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', border: '1px solid #bbf7d0' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  thRow: { borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' },
  th: { padding: '12px 16px', fontWeight: '600', color: '#475569' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', color: '#334155' },
  emptyCell: { textAlign: 'center', padding: '30px', color: '#94a3b8' },
  badgeEntrada: { backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' },
  badgeSalida: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' },
};