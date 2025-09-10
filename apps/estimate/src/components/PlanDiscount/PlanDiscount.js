import { store, addObserver } from '../../state/store.js';

const planDiscountsData = {
    'family-discount': {
        // ▼▼▼ 修正点: typeを'checkbox-select'に変更 ▼▼▼
        type: 'checkbox-select', 
        label: 'ファミリー割引',
        optionKey: 'family',
        items: [
            { label: '未加入', price: 0 },
            { label: '2人', price: 550 },
            { label: '3人以上', price: 1210 },
        ],
        plans: ['max', 'mini'],
    },
    'hikari-home5g-discount': {
        type: 'checkbox',
        label: 'ドコモ光/home5Gセット割',
        optionKey: 'wifi',
        price: 1100,
        plans: ['max', 'mini'],
    },
    'dcard-discount': {
        type: 'checkbox',
        label: 'dカードお支払割',
        optionKey: 'dcard',
        price: 187,
        plans: ['max', 'mini'],
    },
    'denki-discount': {
        type: 'checkbox',
        label: 'ドコモでんき',
        optionKey: 'electricity',
        price: 110,
        plans: ['max', 'mini', 'ahamo']
    }
};

export function initializePlanDiscounts() {
    addObserver(renderPlanDiscounts);
    renderPlanDiscounts();
}

function renderPlanDiscounts() {
    const state = store.getState();
    const currentPlan = state.selectedPlanType;
    const container = document.querySelector('.plan-discount-container');

    if (!currentPlan || !container) {
        if(container) container.innerHTML = '';
        return;
    }
    container.innerHTML = '';

    Object.entries(planDiscountsData).forEach(([discountId, discountInfo]) => {
        if (discountInfo.plans.includes(currentPlan)) {
            const item = document.createElement('div');
            item.className = 'plan-discount-item';

            // ▼▼▼ 修正点: 'checkbox-select'の描画ロジックを追加 ▼▼▼
            if (discountInfo.type === 'checkbox-select') {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                // 割引が適用されている(価格が0より大きい)場合にチェックを入れる
                checkbox.checked = state.planDiscounts[discountInfo.optionKey] > 0;
                
                label.appendChild(checkbox);
                
                const select = document.createElement('select');
                discountInfo.items.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.price;
                    // ラベルに割引名を含めず、人数だけを表示
                    option.textContent = `${discountInfo.label} (${opt.label})`; 
                    if (state.planDiscounts[discountInfo.optionKey] === opt.price) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });

                select.addEventListener('change', (e) => {
                    const price = Number(e.target.value);
                    store.setPlanDiscount(discountInfo.optionKey, price);
                });
                
                // チェックボックスのクリックでセレクトボックスの有効/無効を切り替え
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        // チェックが入ったら、セレクトボックスの現在の値で割引を適用
                        const price = Number(select.value);
                        store.setPlanDiscount(discountInfo.optionKey, price);
                    } else {
                        // チェックが外れたら、割引を0にし、セレクトを「未加入」に戻す
                        store.setPlanDiscount(discountInfo.optionKey, 0);
                        select.value = 0;
                    }
                });

                label.appendChild(select);
                item.appendChild(label);

            } else if (discountInfo.type === 'checkbox') {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = state.planDiscounts[discountInfo.optionKey] > 0;
                
                label.appendChild(checkbox);
                label.append(` ${discountInfo.label}`);
                item.appendChild(label);
                
                checkbox.addEventListener('change', (e) => {
                    const price = e.target.checked ? discountInfo.price : 0;
                    store.setPlanDiscount(discountInfo.optionKey, price);
                });
            }

            const priceSpan = document.createElement('span');
            priceSpan.className = 'price';
            priceSpan.textContent = `-${state.planDiscounts[discountInfo.optionKey] || 0} 円`;
            item.appendChild(priceSpan);

            container.appendChild(item);
        }
    });
}