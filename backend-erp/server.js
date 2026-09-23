const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'erp_db',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos MySQL:', err.message);
    return;
  }
  console.log('¡Conectado exitosamente a la base de datos MySQL!');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Ruta de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  });
});

// --- RUTAS DE CLIENTES ---
app.get('/api/clientes', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener clientes' });
    res.json(results);
  });
});

app.post('/api/clientes', (req, res) => {
  const { nombre, email, telefono, empresa, direccion } = req.body;
  const query = 'INSERT INTO clientes (nombre, email, telefono, empresa, direccion) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, email, telefono, empresa, direccion || ''], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al registrar cliente' });
    }
    res.json({ success: true, id: result.insertId, message: 'Cliente registrado con éxito' });
  });
});

// --- RUTAS DE PRODUCTOS ---
app.get('/api/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });
    res.json(results);
  });
});

app.post('/api/productos', (req, res) => {
  const { codigo, nombre, descripcion, precio, stock_actual, tipo } = req.body;
  const query = 'INSERT INTO productos (codigo, nombre, descripcion, precio, stock_actual, tipo) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [codigo, nombre, descripcion, precio, stock_actual || 0, tipo || 'producto'], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al registrar producto' });
    res.json({ success: true, id: result.insertId, message: 'Producto registrado con éxito' });
  });
});

// --- RUTAS DE INVENTARIO ---
app.get('/api/inventario', (req, res) => {
  const query = `
    SELECT m.*, p.nombre AS producto_nombre, p.codigo 
    FROM inventario_movimientos m 
    JOIN productos p ON m.producto_id = p.id 
    ORDER BY m.fecha DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener movimientos' });
    res.json(results);
  });
});

app.post('/api/inventario', (req, res) => {
  const { producto_id, tipo, cantidad, motivo } = req.body;
  
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });

    const insertMovQuery = 'INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo) VALUES (?, ?, ?, ?)';
    db.query(insertMovQuery, [producto_id, tipo, cantidad, motivo], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ error: 'Error al registrar movimiento' }));
      }

      const operacion = tipo === 'entrada' ? '+' : '-';
      const updateStockQuery = `UPDATE productos SET stock_actual = stock_actual ${operacion} ? WHERE id = ?`;
      
      db.query(updateStockQuery, [cantidad, producto_id], (err) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ error: 'Error al actualizar stock' }));
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ error: 'Error al confirmar transacción' }));
          }
          res.json({ success: true, message: 'Movimiento registrado y stock actualizado' });
        });
      });
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

// --- ACTUALIZAR CLIENTE ---
app.put('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, empresa, direccion } = req.body;
  const query = 'UPDATE clientes SET nombre = ?, email = ?, telefono = ?, empresa = ?, direccion = ? WHERE id = ?';
  
  db.query(query, [nombre, email, telefono, empresa, direccion || '', id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar cliente' });
    res.json({ success: true, message: 'Cliente actualizado con éxito' });
  });
});

// --- ELIMINAR CLIENTE ---
app.delete('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clientes WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar cliente' });
    res.json({ success: true, message: 'Cliente eliminado con éxito' });
  });
});

// --- ACTUALIZAR PRODUCTO ---
app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, descripcion, precio, stock_actual, tipo } = req.body;
  const query = 'UPDATE productos SET codigo = ?, nombre = ?, descripcion = ?, precio = ?, stock_actual = ?, tipo = ? WHERE id = ?';
  
  db.query(query, [codigo, nombre, descripcion, precio, stock_actual || 0, tipo || 'producto', id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar producto' });
    res.json({ success: true, message: 'Producto actualizado con éxito' });
  });
});

// --- ELIMINAR PRODUCTO ---
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar producto' });
    res.json({ success: true, message: 'Producto eliminado con éxito' });
  });
});

