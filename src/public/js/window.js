//------------------------menu button-------------------------------------//
const sidebar = document.querySelector('.sidebar');
const menu_button=document.getElementById("menu-button");
menu_button.addEventListener("click",function(){
    sidebar.classList.toggle('compressed');
})


//----------------------Title Bar----------------------------------//
const { ipcRenderer } = require('electron');

document.getElementById('minimize').addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
});

document.getElementById('maximize').addEventListener('click', () => {
    ipcRenderer.send('maximize-window');
});

document.getElementById('close').addEventListener('click', () => {
    ipcRenderer.send('close-window');
});
