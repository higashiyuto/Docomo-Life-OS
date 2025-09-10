import { store } from "../../state/store.js";

function renderDeviceOptions(devices){
    const deviceSelect = document.getElementById('device-select');
    if(!deviceSelect) return;
    deviceSelect.length = 1;
    devices.forEach(device=>{
        const option = document.createElement('option');
        option.value = device.name;
        option.textContent = device.name;
        deviceSelect.appendChild(option);
    });
}

export function initializeDeviceSelector(devices){
    renderDeviceOptions(devices);
    const deviceSelect = document.getElementById('device-select');
    if(deviceSelect){
        deviceSelect.addEventListener('change', ()=>{
            const selectedDeviceName = deviceSelect.value;
            const selectedDevice = devices.find(d=>d.name===selectedDeviceName) || null;
            store.setSelectedDevice(selectedDevice);
        });
    }
}