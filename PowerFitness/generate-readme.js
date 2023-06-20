import * as fs from 'fs';
import { execSync } from 'child_process';

// Obtén la lista de dependencias del archivo package.json
const packageJson = require('./package.json');
const dependencies = packageJson.dependencies;
const devDependencies = packageJson.devDependencies;

// Genera el contenido del archivo README.md
let readmeContent = `# My Project

This is a description of my project.

## Dependencies

### Runtime Dependencies
`;

// Agrega las dependencias del tiempo de ejecución
for (const dependency in dependencies) {
  readmeContent += `- ${dependency}: ${dependencies[dependency]}\n`;
}

readmeContent += `
### Development Dependencies
`;

// Agrega las dependencias de desarrollo
for (const dependency in devDependencies) {
  readmeContent += `- ${dependency}: ${devDependencies[dependency]}\n`;
}

// Escribe el contenido en el archivo README.md
fs.writeFileSync('README.md', readmeContent);

// Instala las dependencias del proyecto
execSync('npm install');
