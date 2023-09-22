const fs = require('fs');
const path = require('path');

// Ruta del directorio de tu proyecto Angular
const projectDirectory = __dirname;

// Función para exportar el código de un archivo a un archivo de texto unificado
function exportCode(filePath, outputFile) {
  const fullPath = path.join(projectDirectory, filePath);
  const code = fs.readFileSync(fullPath, 'utf8');
  fs.appendFileSync(outputFile, `\n\n/* ${filePath} */\n\n${code}`);
}

// Archivo de salida unificado
const outputFilePath = path.join(projectDirectory, 'unified-code.txt');

// Directorio de la carpeta "components"
const componentsDirectory = path.join(projectDirectory, 'src', 'app', 'components');

// Función para buscar y exportar archivos en un directorio y sus subdirectorios
function exportFilesInDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      exportCode(path.relative(projectDirectory, filePath), outputFilePath);
    } else if (stats.isDirectory()) {
      exportFilesInDirectory(filePath);
    }
  });
}

// Inicia el proceso de exportación desde la carpeta "components"
exportFilesInDirectory(componentsDirectory);

console.log(`Código exportado exitosamente a ${outputFilePath}`);
