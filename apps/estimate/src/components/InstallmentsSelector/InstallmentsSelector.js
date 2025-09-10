import { store } from '../../state/store.js';

export function initializeInstallmentsSelector(){
    const installmentsSelect = document.getElementById('installments-select');
    installmentsSelect.addEventListener('change', ()=>{
        const installmentsNum = installmentsSelect.value;
        store.setInstallmentsNum(installmentsNum);
    });
}