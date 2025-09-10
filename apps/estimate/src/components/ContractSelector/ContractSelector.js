import { store } from '../../state/store.js';

export function initializeContractSelector(){
    const contractType = document.getElementById('contract-select');
    if(contractType){
        contractType.addEventListener('change', ()=>{
            const selectedContractType = contractType.value;
            store.setSelectedContractType(selectedContractType);

            console.log(selectedContractType);

            const latestState = store.getState();
            console.log(latestState.currentDeviceDiscount);
        });
    }
}