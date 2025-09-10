import { store } from '../../state/store.js';

export function initializeDeviceCheckbox(){
    const normalCheckbox = document.getElementById('normal-checkbox');
    const kaedokiCheckbox = document.getElementById('kaedoki-checkbox');

    if(!normalCheckbox || !kaedokiCheckbox) return;

    normalCheckbox.addEventListener('change', ()=>{
        if(normalCheckbox.checked){
            kaedokiCheckbox.checked = false;
            store.setActiveDevicePlan('normal');
        }else{
            store.setActiveDevicePlan('none');
        }
    });

    kaedokiCheckbox.addEventListener('change', ()=>{
        if(kaedokiCheckbox.checked){
            normalCheckbox.checked = false;
            store.setActiveDevicePlan('kaedoki');
        }else{
            store.setActiveDevicePlan('none');
        }
    })
}