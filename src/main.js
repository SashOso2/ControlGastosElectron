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
const IngresoRouter = require('./routers/IngresoRouter');
const GastoRouter = require('./routers/GastoRouter');
const FuenteIngresoRouter = require('./routers/FuenteIngresoRouter');
const GrupoGastoRouter = require('./routers/GrupoGastoRouter');
const CategoriaGastoRouter = require('./routers/CategoriaGastoRouter');

// Usar las rutas
expressApp.use(IngresoRouter);
expressApp.use(GastoRouter);
expressApp.use(FuenteIngresoRouter);
expressApp.use(GrupoGastoRouter);
expressApp.use(CategoriaGastoRouter);

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
    ventanaPrincipal = new BrowserWindow({
        width: 1024,
        height: 600,
        //frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    ventanaPrincipal.setMenu(null); // Quitar menú

    ventanaPrincipal.loadURL(`http://localhost:${PORT}`); // Cargar la aplicación desde el servidor Express
}

// Eventos para minimizar, maximizar y cerrar la ventana
ipcMain.on('minimize-window', () => {
    ventanaPrincipal.minimize();
});

ipcMain.on('maximize-window', () => {
    if (ventanaPrincipal.isMaximized()) {
        ventanaPrincipal.unmaximize();
    } else {
        ventanaPrincipal.maximize();
    }
});

ipcMain.on('close-window', () => {
    ventanaPrincipal.close();
});

// Iniciar la aplicación Electron
app.whenReady().then(createWindow);

// Cerrar la aplicación cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // En macOS, las aplicaciones permanecen abiertas si hay ventanas
        app.quit();
    }
});

// Reabrir la ventana si la aplicación se activa y no hay ninguna ventana abierta (solo en macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
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