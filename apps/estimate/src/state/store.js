let observers = [];
export function addObserver(fn) { observers.push(fn); }
function notify() { observers.forEach(fn => fn()); }

let state = {
    selectedDevice: null,
    normalDevicePrice: 0,
    kaedokiPrice: 0,
    installmentsNum: 1,
    selectedContractType: null,
    useDeviceDiscount: false,
    basePlanPrice: 0,
    selectedOptions: {
        call: 0,
        mail: 0,
        warranty: 0,
        anshinSecurity: 0,
        virusBuster: 0,
    },
    planDiscounts: {
        family: 0,
        wifi: 0,
        dcard: 0,
        electricity: 0,
    },

    activeDevicePlan: 'none',

    currentDeviceDiscount: 0,

    normalPriceAfterDiscount: 0,
    kaedokiPriceAfterDiscount: 0,
    normalMonthlyPrice: 0,
    kaedokiMonthlyPrice: 0,

    totalPlanDiscount: 0,
    totalOptionsPrice: 0,
    totalMonthlyPrice: 0,
};

function recalculateAll() {
    if (state.selectedDevice) {
        // ▼▼▼ 修正点2: stateオブジェクトのプロパティを更新する ▼▼▼
        state.normalDevicePrice = state.selectedDevice.price;
        state.kaedokiPrice = state.selectedDevice.kaedoki;
        state.normalMonthlyPrice = Math.ceil(state.normalDevicePrice / state.installmentsNum);
        state.kaedokiMonthlyPrice = Math.ceil(state.kaedokiPrice / 23); 
    } else {
        // 端末が選択されていない場合は、価格を0にリセットする
        state.currentDeviceDiscount = 0;
        state.normalPriceAfterDiscount = 0;
        state.kaedokiPriceAfterDiscount = 0;
        state.normalMonthlyPrice = 0;
        state.kaedokiMonthlyPrice = 0;
        return; // ★★★ returnで関数を終了させるのが重要 ★★★
    }

    let potentialDiscount = 0;
    if(state.selectedContractType && state.selectedDevice.discount){
        switch(state.selectedContractType){
            case 'MNP':
                potentialDiscount = state.selectedDevice.discount.mnp || 0;
                break;
            case '新規':
                potentialDiscount = state.selectedDevice.discount.new || 0;
                break;
            case '機種変更':
                potentialDiscount = state.selectedDevice.discount.change || 0;
                break;

        }
    }
    state.currentDeviceDiscount = potentialDiscount;
    const finalDiscountAmount = state.useDeviceDiscount ? state.currentDeviceDiscount : 0;

    state.normalPriceAfterDiscount = state.selectedDevice.price - finalDiscountAmount;
    state.kaedokiPriceAfterDiscount = state.selectedDevice.kaedoki - finalDiscountAmount;

    state.normalMonthlyPrice = Math.ceil(state.normalPriceAfterDiscount / state.installmentsNum);
    state.kaedokiMonthlyPrice = Math.ceil(state.kaedokiPriceAfterDiscount / 23);

    let activeMonthlyDevicePrice = 0;
    if(state.activeDevicePlan === 'kaedoki'){
        activeMonthlyDevicePrice = state.kaedokiMonthlyPrice;
    }else if(state.activeDevicePlan === 'normal'){
        activeMonthlyDevicePrice = state.normalMonthlyPrice;
    }

    state.totalOptionsPrice = Object.values(state.selectedOptions).reduce((sum, price) => sum + price, 0);
    state.totalPlanDiscount = Object.values(state.planDiscounts).reduce((sum, price) => sum + price, 0);

    const planPrice = state.basePlanPrice || 0;
    const finalPlanPrice = planPrice - state.totalPlanDiscount;
    state.totalMonthlyPrice = activeMonthlyDevicePrice + finalPlanPrice + state.totalOptionsPrice;
}

export const store = {
    getState() {
        return { ...state };
    },
    setSelectedDevice(device) {
        state.selectedDevice = device;
        recalculateAll();
        notify();
    },
    setSelectedContractType(contractType){
        state.selectedContractType = contractType;
        recalculateAll();
        notify();
    },
    setDiscountCheckbox(checked){
        state.useDeviceDiscount = checked;
        recalculateAll();
        notify();
    },
    setInstallmentsNum(installmentsNum){
        state.installmentsNum = installmentsNum;
        recalculateAll();
        notify();
    },
    setActiveDevicePlan(devicePlan){
        state.activeDevicePlan = devicePlan;
        recalculateAll();
        notify();
    },
    setBasePlanPrice(planType,price){
        state.selectedPlanType = planType;
        state.basePlanPrice = price;
        Object.keys(state.selectedOptions).forEach(key => state.selectedOptions[key] = 0);
        recalculateAll();
        notify();
    },
    setSelectedOption(category, price){
        state.selectedOptions[category] = price;
        recalculateAll();
        notify();
    },
    setPlanDiscount(discountKey, price) {
        if (state.planDiscounts.hasOwnProperty(discountKey)) {
            state.planDiscounts[discountKey] = price;
            recalculateAll();
            notify();
        }
    }
};