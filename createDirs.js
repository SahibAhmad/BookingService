const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'src');
console.log(rootDir);
const directories = [
  'config',
  'controllers',
  'middlewares',
  'migrations',
  'models',
  'repository',
  'routes/v1',
  'seeders',
  'services',
  'utils/error-handlers'
];

// Function to create directories recursively
 function createDirectories() {
  directories.forEach(dir => {
    const dirPath = path.join(rootDir, dir);
    fs.mkdirSync(dirPath, { recursive: true });
      
  });
}

// Run the function
createDirectories();
