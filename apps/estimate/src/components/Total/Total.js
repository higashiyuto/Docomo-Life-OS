import { store } from '../../state/store.js';

export function renderTotal(){
    const state = store.getState();
    const totalPriceEl = document.getElementById('total-price-value');
    if(!totalPriceEl) return;

    totalPriceEl.textContent = `${state.totalMonthlyPrice.toLocaleString()} 円`;
}