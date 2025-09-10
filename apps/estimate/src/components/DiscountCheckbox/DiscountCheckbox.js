import { store } from '../../state/store.js';

export function initializeDiscountCheckbox(){
    const discountCheckbox = document.getElementById('device-discount-checkbox');
    discountCheckbox.addEventListener('change', ()=>{
        const discountChecked = discountCheckbox.checked;
        store.setDiscountCheckbox(discountChecked);
    });
}