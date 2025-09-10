import { store } from '../../state/store.js';

const planOptions = {
    max: [
        { label: "~1GB", price: 5698 },
        { label: "1GB~3GB", price: 6798 },
        { label: "無制限", price: 8448 },
    ],
    mini: [
        { label: "4GB", price: 2750 },
        { label: "10GB", price: 3850 },
    ],
    ahamo: [
        { label: "30GB", price: 2970 },
        { label: "110GB", price: 4950 },
    ]
};

export function initializePlanSelector(){
    const planButton = document.querySelectorAll('.plan-button');
    planButton.forEach(button => {
        button.addEventListener('click', ()=> {
            planButton.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderStorageButton();
        });
    });

    const firstPlanButton = document.querySelector('.plan-button');
    if(firstPlanButton) firstPlanButton.click();
}

function renderStorageButton(){
    const storageContainer = document.querySelector('.plan-storage');
    if(!storageContainer) return;
    storageContainer.innerHTML = "";
    store.setBasePlanPrice(null,0);

    const activeButton = document.querySelector('.plan-button.active');
    if(!activeButton) return;

    const planType = [...activeButton.classList].find(cls=>planOptions[cls]);
    if(!planType) return;

    planOptions[planType].forEach((option, index) => {
        const btn = document.createElement('button');
        btn.classList.add('storage-button');
        btn.textContent = `${option.label} (${option.price.toLocaleString()}円)`;

        btn.addEventListener('click', ()=>{
            storageContainer.querySelectorAll('.storage-button').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');

            store.setBasePlanPrice(planType,option.price);
        });
        storageContainer.appendChild(btn);

        if(index === 0) btn.click();
    });
}