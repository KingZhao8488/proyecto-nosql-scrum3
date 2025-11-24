console.log('🔍 Diagnóstico de archivos...\n');

const fs = require('fs');

const archivos = [
  'src/routes/libroRoutes.js',
  'src/routes/usuarioRoutes.js',
  'src/routes/prestamoRoutes.js',
  'src/controllers/libroController.js',
  'src/controllers/usuarioController.js',
  'src/controllers/prestamoController.js'
];

archivos.forEach(archivo => {
  if (fs.existsSync(archivo)) {
    console.log(`✅ ${archivo} existe`);
    try {
      const modulo = require(`./${archivo}`);
      console.log(`   ✅ Se puede importar`);
      console.log(`   Tipo: ${typeof modulo}`);
      if (typeof modulo === 'function') {
        console.log(`   ✅ Es una función (correcto para router)`);
      } else if (typeof modulo === 'object') {
        console.log(`   Métodos disponibles:`, Object.keys(modulo));
      }
    } catch (error) {
      console.log(`   ❌ Error al importar:`, error.message);
    }
  } else {
    console.log(`❌ ${archivo} NO existe`);
  }
  console.log('');
});
