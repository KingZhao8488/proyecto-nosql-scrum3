// app.js - Lógica del Frontend de Biblioteca
const API_URL = 'http://localhost:3000/api';

let libroEditando = null;

// ============================================
// FUNCIONES DE NAVEGACIÓN
// ============================================

function cambiarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    // Mostrar sección seleccionada
    document.getElementById(seccion).classList.add('active');
    event.target.classList.add('active');
    
    // Cargar datos según la sección
    switch(seccion) {
        case 'libros':
            cargarLibros();
            break;
        case 'usuarios':
            cargarUsuarios();
            break;
        case 'prestamos':
            cargarPrestamos();
            break;
        case 'estadisticas':
            cargarEstadisticas();
            break;
    }
}

// ============================================
// LIBROS
// ============================================

async function cargarLibros() {
    const categoria = document.getElementById('filtroCategoria').value;
    const estado = document.getElementById('filtroEstado').value;
    
    let url = `${API_URL}/libros?`;
    if (categoria) url += `categoria=${categoria}&`;
    if (estado) url += `estado=${estado}&`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        mostrarLibros(data.libros);
    } catch (error) {
        console.error('Error al cargar libros:', error);
        mostrarAlerta('listaLibros', 'Error al cargar libros', 'error');
    }
}

function mostrarLibros(libros) {
    const lista = document.getElementById('listaLibros');
    
    if (libros.length === 0) {
        lista.innerHTML = '<p style="text-align: center; padding: 40px; color: #888;">No se encontraron libros</p>';
        return;
    }
    
    lista.innerHTML = libros.map(libro => `
        <div class="card">
            <h3>${libro.titulo}</h3>
            <p><strong>Autor:</strong> ${libro.autor}</p>
            <p><strong>Categoría:</strong> ${libro.categoria}</p>
            <p><strong>Ubicación:</strong> ${libro.ubicacion}</p>
            <span class="badge badge-${libro.estado.toLowerCase()}">${libro.estado}</span>
            <div class="card-actions">
                <button class="btn btn-small btn-secondary" onclick="editarLibro('${libro._id}')">✏️ Editar</button>
                <button class="btn btn-small btn-danger" onclick="eliminarLibro('${libro._id}')">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

async function buscarLibros() {
    const titulo = document.getElementById('buscarLibro').value;
    if (titulo.length < 2) {
        cargarLibros();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/libros/buscar?titulo=${titulo}`);
        const libros = await response.json();
        mostrarLibros(libros);
    } catch (error) {
        console.error('Error al buscar:', error);
    }
}

function mostrarModalLibro() {
    libroEditando = null;
    document.getElementById('tituloModalLibro').textContent = 'Agregar Libro';
    document.getElementById('formLibro').reset();
    document.getElementById('modalLibro').classList.add('active');
}

async function editarLibro(id) {
    try {
        const response = await fetch(`${API_URL}/libros/${id}`);
        const libro = await response.json();
        
        libroEditando = id;
        document.getElementById('tituloModalLibro').textContent = 'Editar Libro';
        document.getElementById('libroTitulo').value = libro.titulo;
        document.getElementById('libroAutor').value = libro.autor;
        document.getElementById('libroCategoria').value = libro.categoria;
        document.getElementById('libroUbicacion').value = libro.ubicacion;
        document.getElementById('libroEstado').value = libro.estado;
        
        document.getElementById('modalLibro').classList.add('active');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar libro');
    }
}

async function guardarLibro(event) {
    event.preventDefault();
    
    const libro = {
        titulo: document.getElementById('libroTitulo').value,
        autor: document.getElementById('libroAutor').value,
        categoria: document.getElementById('libroCategoria').value,
        ubicacion: document.getElementById('libroUbicacion').value,
        estado: document.getElementById('libroEstado').value
    };
    
    try {
        const url = libroEditando 
            ? `${API_URL}/libros/${libroEditando}`
            : `${API_URL}/libros`;
        
        const method = libroEditando ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(libro)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            cerrarModal('modalLibro');
            cargarLibros();
            mostrarNotificacion(`Libro ${libroEditando ? 'actualizado' : 'creado'} exitosamente`, 'success');
        } else {
            mostrarAlertaModal('alertLibro', data.mensaje, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlertaModal('alertLibro', 'Error al guardar libro', 'error');
    }
}

async function eliminarLibro(id) {
    if (!confirm('¿Estás seguro de eliminar este libro?')) return;
    
    try {
        const response = await fetch(`${API_URL}/libros/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            cargarLibros();
            mostrarNotificacion('Libro eliminado exitosamente', 'success');
        } else {
            const data = await response.json();
            alert(data.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar libro');
    }
}

// ============================================
// USUARIOS
// ============================================

async function cargarUsuarios() {
    const tipo = document.getElementById('filtroTipoUsuario').value;
    const url = tipo 
        ? `${API_URL}/usuarios?tipo=${tipo}`
        : `${API_URL}/usuarios`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        mostrarUsuarios(data.usuarios);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

function mostrarUsuarios(usuarios) {
    const lista = document.getElementById('listaUsuarios');
    
    if (usuarios.length === 0) {
        lista.innerHTML = '<p style="text-align: center; padding: 40px; color: #888;">No se encontraron usuarios</p>';
        return;
    }
    
    lista.innerHTML = usuarios.map(usuario => `
        <div class="card">
            <h3>${usuario.nombre}</h3>
            <p><strong>ID:</strong> ${usuario.identificacion}</p>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
            <p><strong>Tipo:</strong> ${usuario.tipo}</p>
            <p><strong>Préstamos activos:</strong> ${usuario.prestamosActivos}/3</p>
            <div class="card-actions">
                <button class="btn btn-small btn-danger" onclick="eliminarUsuario('${usuario._id}')">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

function mostrarModalUsuario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('modalUsuario').classList.add('active');
}

async function guardarUsuario(event) {
    event.preventDefault();
    
    const usuario = {
        nombre: document.getElementById('usuarioNombre').value,
        identificacion: document.getElementById('usuarioIdentificacion').value,
        email: document.getElementById('usuarioEmail').value,
        telefono: document.getElementById('usuarioTelefono').value,
        tipo: document.getElementById('usuarioTipo').value
    };
    
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            cerrarModal('modalUsuario');
            cargarUsuarios();
            mostrarNotificacion('Usuario creado exitosamente', 'success');
        } else {
            mostrarAlertaModal('alertUsuario', data.mensaje, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlertaModal('alertUsuario', 'Error al guardar usuario', 'error');
    }
}

async function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            cargarUsuarios();
            mostrarNotificacion('Usuario eliminado exitosamente', 'success');
        } else {
            alert(data.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar usuario');
    }
}

// ============================================
// PRÉSTAMOS
// ============================================

async function cargarPrestamos() {
    const estado = document.getElementById('filtroEstadoPrestamo').value;
    const url = estado 
        ? `${API_URL}/prestamos?estado=${estado}`
        : `${API_URL}/prestamos`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        mostrarPrestamos(data.prestamos);
    } catch (error) {
        console.error('Error al cargar préstamos:', error);
    }
}

function mostrarPrestamos(prestamos) {
    const lista = document.getElementById('listaPrestamos');
    
    if (prestamos.length === 0) {
        lista.innerHTML = '<p style="text-align: center; padding: 40px; color: #888;">No hay préstamos registrados</p>';
        return;
    }
    
    lista.innerHTML = prestamos.map(prestamo => {
        const fechaPrestamo = new Date(prestamo.fechaPrestamo).toLocaleDateString();
        const fechaDevolucion = new Date(prestamo.fechaDevolucion).toLocaleDateString();
        const diasRestantes = Math.ceil((new Date(prestamo.fechaDevolucion) - new Date()) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="card">
                <h3>📖 ${prestamo.libro.titulo}</h3>
                <p><strong>Usuario:</strong> ${prestamo.usuario.nombre}</p>
                <p><strong>ID:</strong> ${prestamo.usuario.identificacion}</p>
                <p><strong>Préstamo:</strong> ${fechaPrestamo}</p>
                <p><strong>Devolución:</strong> ${fechaDevolucion}</p>
                ${prestamo.estado === 'Activo' ? `
                    <p><strong>${diasRestantes > 0 ? 'Días restantes' : 'Días de retraso'}:</strong> ${Math.abs(diasRestantes)}</p>
                ` : ''}
                <span class="badge badge-${prestamo.estado.toLowerCase()}">${prestamo.estado}</span>
                ${prestamo.estado === 'Activo' ? `
                    <div class="card-actions">
                        <button class="btn btn-small btn-secondary" onclick="devolverLibro('${prestamo._id}')">✅ Devolver</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

async function mostrarModalPrestamo() {
    // Cargar usuarios y libros disponibles
    try {
        const [usuarios, libros] = await Promise.all([
            fetch(`${API_URL}/usuarios`).then(r => r.json()),
            fetch(`${API_URL}/libros?estado=Disponible`).then(r => r.json())
        ]);
        
        const selectUsuario = document.getElementById('prestamoUsuario');
        const selectLibro = document.getElementById('prestamoLibro');
        
        selectUsuario.innerHTML = '<option value="">Seleccionar usuario...</option>' +
            usuarios.usuarios.map(u => `<option value="${u._id}">${u.nombre} (${u.identificacion})</option>`).join('');
        
        selectLibro.innerHTML = '<option value="">Seleccionar libro...</option>' +
            libros.libros.map(l => `<option value="${l._id}">${l.titulo} - ${l.autor}</option>`).join('');
        
        document.getElementById('modalPrestamo').classList.add('active');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar datos para el préstamo');
    }
}

async function guardarPrestamo(event) {
    event.preventDefault();
    
    const prestamo = {
        usuario: document.getElementById('prestamoUsuario').value,
        libro: document.getElementById('prestamoLibro').value
    };
    
    try {
        const response = await fetch(`${API_URL}/prestamos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prestamo)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            cerrarModal('modalPrestamo');
            cargarPrestamos();
            mostrarNotificacion('Préstamo creado exitosamente', 'success');
        } else {
            mostrarAlertaModal('alertPrestamo', data.mensaje, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlertaModal('alertPrestamo', 'Error al crear préstamo', 'error');
    }
}

async function devolverLibro(id) {
    if (!confirm('¿Confirmar devolución del libro?')) return;
    
    try {
        const response = await fetch(`${API_URL}/prestamos/${id}/devolver`, {
            method: 'PUT'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            cargarPrestamos();
            const mensaje = data.diasRetraso > 0 
                ? `Libro devuelto con ${data.diasRetraso} días de retraso`
                : 'Libro devuelto a tiempo';
            mostrarNotificacion(mensaje, 'success');
        } else {
            alert(data.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al devolver libro');
    }
}

async function cargarPrestamosVencidos() {
    try {
        const response = await fetch(`${API_URL}/prestamos/vencidos`);
        const prestamos = await response.json();
        
        if (prestamos.length === 0) {
            mostrarNotificacion('No hay préstamos vencidos', 'success');
        } else {
            mostrarPrestamos(prestamos);
            mostrarNotificacion(`Se encontraron ${prestamos.length} préstamos vencidos`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// ============================================
// ESTADÍSTICAS
// ============================================

async function cargarEstadisticas() {
    try {
        const [libros, usuarios, prestamos] = await Promise.all([
            fetch(`${API_URL}/libros`).then(r => r.json()),
            fetch(`${API_URL}/usuarios`).then(r => r.json()),
            fetch(`${API_URL}/prestamos`).then(r => r.json())
        ]);
        
        const librosDisponibles = libros.libros.filter(l => l.estado === 'Disponible').length;
        const prestamosActivos = prestamos.prestamos.filter(p => p.estado === 'Activo').length;
        
        const stats = document.getElementById('statsContainer');
        stats.innerHTML = `
            <div class="stat-card">
                <h3>${libros.total}</h3>
                <p>Total de Libros</p>
            </div>
            <div class="stat-card">
                <h3>${librosDisponibles}</h3>
                <p>Libros Disponibles</p>
            </div>
            <div class="stat-card">
                <h3>${usuarios.total}</h3>
                <p>Usuarios Registrados</p>
            </div>
            <div class="stat-card">
                <h3>${prestamosActivos}</h3>
                <p>Préstamos Activos</p>
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function cerrarModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function mostrarAlertaModal(elementId, mensaje, tipo) {
    const alert = document.getElementById(elementId);
    alert.innerHTML = `<div class="alert alert-${tipo === 'error' ? 'error' : 'success'}">${mensaje}</div>`;
    setTimeout(() => alert.innerHTML = '', 5000);
}

function mostrarNotificacion(mensaje, tipo) {
    const notif = document.createElement('div');
    notif.className = `alert alert-${tipo === 'error' ? 'error' : 'success'}`;
    notif.textContent = mensaje;
    notif.style.position = 'fixed';
    notif.style.top = '20px';
    notif.style.right = '20px';
    notif.style.zIndex = '9999';
    notif.style.minWidth = '300px';
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ============================================
// INICIALIZACIÓN
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    cargarLibros();
    
    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});

