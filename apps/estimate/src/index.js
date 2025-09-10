import { store, addObserver } from './state/store.js';
import { fetchDevices } from './api/dataService.js';
import { initializeDeviceSelector } from './components/DeviceSelector/DeviceSelector.js';
import { initializeContractSelector} from './components/ContractSelector/ContractSelector.js';
import { initializeDiscountCheckbox } from './components/DiscountCheckbox/DiscountCheckbox.js';
import { initializeInstallmentsSelector } from './components/InstallmentsSelector/InstallmentsSelector.js';
import { initializeDeviceCheckbox } from './components/DeviceCheckbox/DeviceCheckbox.js';
import { initializePlanSelector } from './components/Plan/Plan.js';
import { initializeOptionSelector } from './components/Option/Option.js';
import { initializePlanDiscounts } from './components/PlanDiscount/PlanDiscount.js';
import { renderTotal } from './components/Total/Total.js';

function renderPriceDisplay() {
    const state = store.getState();
    const priceDisplay = document.getElementById('device-price-display');
    const normalPrice  = document.getElementById('normal-price');
    const kaedokiPrice = document.getElementById('kaedoki-price');
    const normalMonthlyPrice = document.getElementById('normal-monthly-price');
    const kaedokiMonthlyPrice = document.getElementById('kaedoki-monthly-price');

    if (!priceDisplay) return;

    if (state.selectedDevice && typeof state.selectedDevice.price === 'number') {
        priceDisplay.textContent = `${state.selectedDevice.price.toLocaleString()} 円`;
        normalPrice.textContent  = `${state.normalPriceAfterDiscount.toLocaleString()} 円 = `;
        kaedokiPrice.textContent = `${state.kaedokiPriceAfterDiscount.toLocaleString()} 円 = `;
        normalMonthlyPrice.textContent = `${state.normalMonthlyPrice.toLocaleString()} 円 / 月`;
        kaedokiMonthlyPrice.textContent = `${state.kaedokiMonthlyPrice.toLocaleString()} 円 / 月`;
    } else {
        priceDisplay.textContent = '0 円';
        normalPrice.textContent  = '0 円';
        kaedokiPrice.textContent = '0 円';
    }
}

async function main(){
    addObserver(renderPriceDisplay);
    addObserver(renderTotal);

    const devices = await fetchDevices();
    devices.forEach(device=>{
        initializeDeviceSelector(devices);
        console.log(device);
    });

    initializeContractSelector();
    initializeDiscountCheckbox();
    initializeInstallmentsSelector();
    initializeDeviceCheckbox();
    initializePlanSelector();
    initializeOptionSelector();
    initializePlanDiscounts();

    renderPriceDisplay();
    renderTotal();
}

main();