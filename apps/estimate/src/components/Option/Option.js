import { store, addObserver } from '../../state/store.js';

// オプションの全データを一元管理します
const optionsData = {
    'unlimited-call': {
        type: 'button',
        label: 'かけ放題',
        category: 'call',
        plans: { max: 1980, mini: 1980, ahamo: 1100 }
    },
    '5min-call': {
        type: 'button',
        label: '5分通話無料',
        category: 'call',
        plans: { max: 880, mini: 880, ahamo: 0 }
    },
    'docomo-mail': {
        type: 'button',
        label: 'ドコモメール',
        category: 'mail',
        plans: { mini: 330, ahamo: 330 }
    },
    'smart-warranty': {
        type: 'button',
        label: 'smartあんしん補償',
        category: 'warranty',
        plans: { max: true, mini: true, ahamo: true }
    },
    'mobile-e-warranty': {
        type: 'button',
        label: 'モバイルe保険',
        category: 'warranty',
        plans: { max: 700, mini: 700, ahamo: 700 }
    },
    'anshin-security': {
        type: 'select',
        label: 'あんしんセキュリティ',
        category: 'security',
        items: [
            // { label: '未加入', price: 0 }, // 「未加入」は動的に追加するのでここからは削除
            { label: 'スタンダード', price: 550 },
            { label: 'トータル', price: 770 },
        ],
        plans: { max: true, mini: true, ahamo: true }
    },
    'virus-buster': {
        type: 'select',
        label: 'ウイルスバスター',
        category: 'security',
        items: [
            // { label: '未加入', price: 0 },
            { label: '1台版', price: 770 },
            { label: '3台版', price: 990 },
        ],
        plans: { max: true, mini: true, ahamo: true }
    },
};

let activeCategory = 'call';

export function initializeOptionSelector() {
    initializeCategoryTabs();
    addObserver(renderOptionButtons);
    // 初期表示のために「通話」タブを名指しでクリックする
    const callTab = document.querySelector('.option-category-button[data-category="call"]');
    if(callTab) callTab.click();
}

function initializeCategoryTabs() {
    const categoryButtons = document.querySelectorAll('.option-category-button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const newCategory = event.currentTarget.dataset.category;
            if (!newCategory || newCategory === activeCategory) return;
            activeCategory = newCategory;
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            event.currentTarget.classList.add('active');
            renderOptionButtons();
        });
    });
}

function renderOptionButtons() {
    const state = store.getState();
    const currentPlan = state.selectedPlanType;
    const optionListWrapper = document.querySelector('.option-list-wrapper');

    if (!currentPlan || !optionListWrapper) return;
    optionListWrapper.innerHTML = '';

    Object.entries(optionsData).forEach(([optionId, optionInfo]) => {
        if (optionInfo.category === activeCategory) {
            if (optionInfo.plans && optionInfo.plans.hasOwnProperty(currentPlan)) {
                
                if (optionInfo.type === 'button') {
                    let price = optionInfo.plans[currentPlan];
                    if (optionId === 'smart-warranty' && state.selectedDevice) {
                        price = state.selectedDevice.warranty || 0;
                    }
                    const btn = document.createElement('button');
                    btn.classList.add('option-button');
                    btn.textContent = `${optionInfo.label} (${price === 0 ? '無料' : price.toLocaleString() + '円'})`;
                    if (state.selectedOptions[optionInfo.category] === price) {
                        btn.classList.add('active');
                    }
                    btn.addEventListener('click', () => {
                        const isAlreadyActive = btn.classList.contains('active');
                        optionListWrapper.querySelectorAll('.option-button').forEach(b => b.classList.remove('active'));
                        if (isAlreadyActive) {
                            store.setSelectedOption(optionInfo.category, 0);
                        } else {
                            btn.classList.add('active');
                            store.setSelectedOption(optionInfo.category, price);
                        }
                    });
                    optionListWrapper.appendChild(btn);

                } else if (optionInfo.type === 'select') {
                    const group = document.createElement('div');
                    group.className = 'option-group';

                    const select = document.createElement('select');
                    
                    // ▼▼▼ ここから修正 ▼▼▼
                    // 1. ラベルの代わりに、選択できない「見出し」をoptionとして追加
                    const titleOption = document.createElement('option');
                    titleOption.textContent = optionInfo.label;
                    titleOption.disabled = true;
                    // stateに保存されている価格が0（未加入）の場合、これを選択状態にする
                    if (!state.selectedOptions[optionId]) {
                        titleOption.selected = true;
                    }
                    select.appendChild(titleOption);

                    // 2. 「未加入」の選択肢を追加
                    const unselectedOption = document.createElement('option');
                    unselectedOption.value = 0;
                    unselectedOption.textContent = '未加入 (0円)';
                    if (state.selectedOptions[optionId] === 0) {
                        unselectedOption.selected = true;
                    }
                    select.appendChild(unselectedOption);
                    // ▲▲▲ ここまで修正 ▲▲▲

                    optionInfo.items.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.price;
                        option.textContent = `${item.label} (${item.price.toLocaleString()}円)`;
                        if (state.selectedOptions[optionId] === item.price) {
                            option.selected = true;
                        }
                        select.appendChild(option);
                    });

                    select.addEventListener('change', (event) => {
                        const price = Number(event.target.value);
                        store.setSelectedOption(optionId, price);
                    });

                    group.appendChild(select);
                    optionListWrapper.appendChild(group);
                }
            }
        }
    });
}