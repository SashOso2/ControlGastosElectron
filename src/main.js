// Importar dependencias
const { app, BrowserWindow, ipcMain } = require('electron');
const express = require('express');
const path = require('path');

// Configurar la aplicación de Express
const expressApp = express();
const PORT = 3000;
let ventanaPrincipal;

// Configuración de Express
expressApp.set('view engine', 'ejs');
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(express.json());

// Rutas Express
const IngresoRoutes = require('./routes/IngresoRoutes');
const GastoRoutes = require('./routes/GastoRoutes');
const FuenteIngresoRoutes = require('./routes/FuenteIngresoRoutes');
const GrupoGastoRoutes = require('./routes/GrupoGastoRoutes');
const CategoriaGastoRoutes = require('./routes/CategoriaGastoRoutes');

// Usar las rutas
expressApp.use(IngresoRoutes);
expressApp.use(GastoRoutes);
expressApp.use(FuenteIngresoRoutes);
expressApp.use(GrupoGastoRoutes);
expressApp.use(CategoriaGastoRoutes);

// Rutas de renderización con EJS
expressApp.get('/', (req, res) => {
    res.render('login');
});

expressApp.get('/resumen', (req, res) => {
    res.render('resumen');
});

expressApp.get('/categorias-gasto', (req, res) => {
    res.render('categorias-gasto');
});

expressApp.get('/fuentes-ingreso', (req, res) => {
    res.render('fuentes-ingreso');
});

expressApp.get('/gastos', (req, res) => {
    res.render('gastos');
});

expressApp.get('/grupos-gasto', (req, res) => {
    res.render('grupos-gasto');
});

expressApp.get('/ingresos', (req, res) => {
    res.render('ingresos');
});

// Iniciar el servidor Express
expressApp.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});

// Función para crear la ventana principal de Electron
function createWindow() {
    if (ventanaPrincipal) {
        ventanaPrincipal.focus();
        return;
    }

    ventanaPrincipal = new BrowserWindow({
        width: 1024,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    ventanaPrincipal.setMenu(null); // Quitar menú

    ventanaPrincipal.loadURL(`http://localhost:${PORT}`); // Cargar la aplicación desde el servidor Express

    ventanaPrincipal.on('closed', () => {
        ventanaPrincipal = null; // Limpiar la referencia cuando la ventana se cierra
    });
}

// Iniciar la aplicación Electron
app.whenReady().then(createWindow);

// Cerrar la aplicación cuando todas las ventanas están cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (ventanaPrincipal === null) {
        createWindow();
    }
});




/*
---------------------------------------------------------------
npm init --yes
npm install electron --save-dev
npm install express
npm install sqlite3
npm install ejs

{
    ...
    "main": "src/main.js",
    "scripts": {
        "start": "electron src/main.js"
    },
    ...
}

npm start
----------------------------------------------------------------
npm i electron-packager

{
    "productName":"Control Gastos",
    ...
    "scripts": {
        ...
        "package-mac": "electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds",
        "package-win": "electron-packager . electron-tutorial-app --overwrite --platform=win32 --asar --arch=x64 --icon=assets/icons/win/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=\"Electron Tutorial App\"",    
        "package-linux": "electron-packager . electron-tutorial-app --overwrite --asar=true --platform=linux --arch=x64 --icon=assets/icons/png/1024x1024.png --prune=true --out=release-builds"
    },
    ...
}

npm run package-win
npm run package-mac
npm run package-linux
-------------------------------Subir a git------------------------
.gitignore

git init
git add .
git commit -m "Primer commit"
git remote add origin https://github.com/SashOso2/ControlGastosElectron.git
git push -u origin master
------------------------------Clonar -------------------------
git clone https://github.com/SashOso2/ControlGastosElectron.git
----------------------------Guardar cabmaios--------------------------
git add .
git commit -m "agregar commit"
git push
------------------------------------------------------------------
git pull origin master
git status
*/