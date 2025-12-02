# 📚 Proyecto: API CRUD Biblioteca con Node.js + Express + MongoDB (Mongoose)

## 📖 Descripción del Proyecto

Sistema de gestión de biblioteca que permite administrar libros, usuarios y préstamos mediante una API RESTful.

## 🎯 Características

- ✅ CRUD completo de Libros
- ✅ CRUD completo de Usuarios
- ✅ CRUD completo de Préstamos
- ✅ Control de disponibilidad de libros
- ✅ Gestión de estado de préstamos
- ✅ Validación de datos con Mongoose
- ✅ Persistencia de datos en MongoDB Atlas

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript
- **Express.js**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **dotenv**: Gestión de variables de entorno
- **CORS**: Manejo de peticiones entre dominios

## 📋 Requisitos Previos

- Node.js (versión LTS 16.x o superior)
- MongoDB Atlas (cuenta gratuita) o MongoDB local
- Postman (para pruebas de API)
- Git (opcional)
- Editor de código (VS Code recomendado)

## 📁 Estructura del Proyecto

```
proyecto-nosql/
├─ src/
│  ├─ config/
│  │  └─ db.js (opcional, la conexión está en server.js)
│  ├─ controllers/
│  │  ├─ libroController.js
│  │  ├─ usuarioController.js
│  │  └─ prestamoController.js
│  ├─ models/
│  │  ├─ Libro.js
│  │  ├─ Usuario.js
│  │  └─ Prestamo.js
│  ├─ routes/
│  │  ├─ libroRoutes.js
│  │  ├─ usuarioRoutes.js
│  │  └─ prestamoRoutes.js
├─ public/
│  └─ index.html
├─ .env (NO subir a Git)
├─ .env.example
├─ .gitignore
├─ package.json
├─ server.js
└─ README.md
```

## 🚀 Instalación y Configuración

### 1. Clonar o descargar el proyecto

```bash
git clone [url-del-repositorio]
cd proyecto-nosql
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
MONGO_URI=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/bibliotecaDB
PORT=3000
```

**Nota importante**: Reemplaza `tu_usuario`, `tu_password` y la URL del cluster con tus credenciales reales de MongoDB Atlas.

### 4. Crear cuenta en MongoDB Atlas (si no tienes)

1. Visita [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster
4. Configura acceso de red (0.0.0.0/0 para desarrollo)
5. Crea un usuario de base de datos
6. Obtén tu string de conexión

### 5. Iniciar el servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

### 6. Verificar conexión

Si todo está correcto, verás en consola:

```
✅ Conectado a MongoDB - BibliotecaDB
📊 Base de datos: bibliotecaDB
🚀 Servidor corriendo en http://localhost:3000
📡 Prueba la API en http://localhost:3000/api
```

## 📡 Endpoints de la API

### Base URL
```
http://localhost:3000/api
```

### 📖 Libros (`/api/libros`)

| Método | Endpoint | Descripción | Body Requerido |
|--------|----------|-------------|----------------|
| `GET` | `/api/libros` | Obtener todos los libros | No |
| `GET` | `/api/libros/:id` | Obtener libro por ID | No |
| `POST` | `/api/libros` | Crear nuevo libro | Sí |
| `PUT` | `/api/libros/:id` | Actualizar libro | Sí (parcial) |
| `DELETE` | `/api/libros/:id` | Eliminar libro | No |

**Ejemplo de Body para POST/PUT:**
```json
{
  "titulo": "Cien Años de Soledad",
  "autor": "Gabriel García Márquez",
  "isbn": "978-0307474728",
  "editorial": "Editorial Sudamericana",
  "anioPublicacion": 1967,
  "genero": "Realismo mágico",
  "numeroPaginas": 417,
  "copias": 3
}
```

### 👤 Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción | Body Requerido |
|--------|----------|-------------|----------------|
| `GET` | `/api/usuarios` | Obtener todos los usuarios | No |
| `GET` | `/api/usuarios/:id` | Obtener usuario por ID | No |
| `POST` | `/api/usuarios` | Crear nuevo usuario | Sí |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario | Sí (parcial) |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario | No |

**Ejemplo de Body para POST/PUT:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@email.com",
  "telefono": "+57 300 123 4567",
  "direccion": "Calle 123 #45-67",
  "fechaNacimiento": "1990-05-15"
}
```

### 📋 Préstamos (`/api/prestamos`)

| Método | Endpoint | Descripción | Body Requerido |
|--------|----------|-------------|----------------|
| `GET` | `/api/prestamos` | Obtener todos los préstamos | No |
| `GET` | `/api/prestamos/:id` | Obtener préstamo por ID | No |
| `POST` | `/api/prestamos` | Crear nuevo préstamo | Sí |
| `PUT` | `/api/prestamos/:id` | Actualizar préstamo | Sí (parcial) |
| `DELETE` | `/api/prestamos/:id` | Eliminar préstamo | No |

**Ejemplo de Body para POST:**
```json
{
  "usuarioId": "674a1b2c3d4e5f6g7h8i9j0k",
  "libroId": "674a1b2c3d4e5f6g7h8i9j0l",
  "fechaPrestamo": "2024-11-28",
  "fechaDevolucionEsperada": "2024-12-12"
}
```

**Ejemplo de Body para PUT (devolver libro):**
```json
{
  "estado": "devuelto",
  "fechaDevolucionReal": "2024-12-05"
}
```

## 🧪 Pruebas con Postman

### Importar Colección

1. Descarga el archivo `Biblioteca_API_Collection.json` (incluido en el proyecto)
2. Abre Postman
3. Click en "Import" → "Upload Files"
4. Selecciona el archivo JSON
5. La colección aparecerá en tu sidebar

### Configurar Entorno

1. Crea un nuevo entorno llamado "Local Development"
2. Agrega la variable:
   - `base_url`: `http://localhost:3000/api`
3. Guarda y selecciona este entorno

### Ejecutar Tests

Ejecuta las peticiones en este orden:

1. ✅ **GET** `/api` - Verificar que la API funciona
2. 📖 **POST** `/api/libros` - Crear libro de prueba
3. 👤 **POST** `/api/usuarios` - Crear usuario de prueba
4. 📋 **POST** `/api/prestamos` - Crear préstamo
5. 📋 **PUT** `/api/prestamos/:id` - Devolver libro
6. Prueba los demás endpoints GET, PUT, DELETE

## 📸 Capturas de Pantalla Requeridas

Para la entrega del proyecto, necesitas capturas de:

1. **POST Create** - Respuesta 201 con objeto creado
2. **GET All** - Respuesta 200 con array de objetos
3. **GET By ID** - Respuesta 200 con un objeto
4. **PUT Update** - Respuesta 200 con objeto actualizado
5. **DELETE** - Respuesta 200 con mensaje de confirmación
6. **Errores** - 404 Not Found, 400 Bad Request, etc.

### Cómo tomar capturas en Postman:
- Asegúrate de que se vea el método, URL, status code y body de respuesta
- Usa herramientas como Snipping Tool, Lightshot o la captura nativa de tu SO

## 📊 Modelos de Datos

### Libro
```javascript
{
  titulo: String (requerido),
  autor: String (requerido),
  isbn: String (requerido, único),
  editorial: String,
  anioPublicacion: Number,
  genero: String,
  numeroPaginas: Number,
  copias: Number (default: 1),
  disponibles: Number (calculado automáticamente),
  timestamps: true
}
```

### Usuario
```javascript
{
  nombre: String (requerido),
  apellido: String (requerido),
  email: String (requerido, único),
  telefono: String,
  direccion: String,
  fechaNacimiento: Date,
  activo: Boolean (default: true),
  timestamps: true
}
```

### Préstamo
```javascript
{
  usuario: ObjectId (ref: Usuario),
  libro: ObjectId (ref: Libro),
  fechaPrestamo: Date (requerido),
  fechaDevolucionEsperada: Date (requerido),
  fechaDevolucionReal: Date,
  estado: String [activo, devuelto, retrasado],
  timestamps: true
}
```

## 🔒 Seguridad

- Las credenciales de MongoDB están en `.env` (NO subir a Git)
- Se incluye `.gitignore` para proteger archivos sensibles
- CORS habilitado para desarrollo

## 🐛 Solución de Problemas

### Error: Cannot connect to MongoDB
- Verifica tu string de conexión en `.env`
- Asegúrate de que el nombre de la base de datos esté al final de la URI
- Verifica que tu IP esté en la whitelist de MongoDB Atlas

### Error: Port 3000 already in use
- Cambia el puerto en `.env` a otro disponible (ej: 3001)
- O mata el proceso que está usando el puerto 3000

### Error: Libro no disponible para préstamo
- Verifica que el libro tenga copias disponibles
- Revisa el campo `disponibles` del libro

### Los datos no persisten
- Asegúrate de que el nombre de la base de datos esté en la URI
- Verifica la conexión a MongoDB Atlas

## 📝 Buenas Prácticas Implementadas

- ✅ Separación de responsabilidades (MVC)
- ✅ Validación de datos con Mongoose
- ✅ Manejo de errores básico
- ✅ Variables de entorno para configuración
- ✅ Estructura de carpetas organizada
- ✅ Documentación clara

## 🚀 Mejoras Futuras (Opcionales)

- [ ] Autenticación con JWT
- [ ] Validación avanzada con express-validator
- [ ] Paginación en endpoints GET
- [ ] Sistema de multas por retrasos
- [ ] Historial de préstamos por usuario
- [ ] Búsqueda avanzada de libros
- [ ] Tests automatizados con Jest
- [ ] Frontend con React/Vue
- [ ] Deploy en Heroku/Railway

## 👨‍💻 Autor

**Andres Guerrero, Jeison Sanchez, David Blanco**
- Email: davidjaime195@gmail.com, jeisonsanchez1702@gmail.com, gguerrerouxed@gmail.com
- GitHub: [@kingzhao8488](https://github.com/KingZhao8488)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 🙏 Agradecimientos

- Documentación de [MongoDB](https://docs.mongodb.com/)
- Documentación de [Mongoose](https://mongoosejs.com/)
- Documentación de [Express](https://expressjs.com/)

---

**Fecha de última actualización**: Diciembre 2024

**Versión**: 1.0.0
