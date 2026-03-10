
const SUBMIT_URL = ""; 


const COMBOS = {
  1: { 
    id: 1, 
    name: "Reaver Collection", 
    collectionImg: "images/reaver-collection.jpg",
    items: [
      { id: "reaver-vandal", name: "Reaver Vandal", price: 1775, img: "images/reaver-vandal.jpg", type: "rifle" },
      { id: "reaver-phantom", name: "Reaver Phantom", price: 1775, img: "images/reaver-phantom.jpg", type: "rifle" },
      { id: "reaver-operator", name: "Reaver Operator", price: 1775, img: "images/reaver-operator.jpg", type: "sniper" },
      { id: "reaver-sheriff", name: "Reaver Sheriff", price: 1775, img: "images/reaver-sheriff.jpg", type: "pistol" }
    ],
    discount: "20%",
    description: "Dark and menacing collection with purple accents"
  },
  2: { 
    id: 2, 
    name: "Prime Collection", 
    collectionImg: "images/prime-collection.jpg",
    items: [
      { id: "prime-phantom", name: "Prime Phantom", price: 1775, img: "images/prime-phantom.jpg", type: "rifle" },
      { id: "prime-vandal", name: "Prime Vandal", price: 1775, img: "images/prime-vandal.jpg", type: "rifle" },
      { id: "prime-axe", name: "Prime Axe", price: 3550, img: "images/prime-axe.jpg", type: "melee" }
    ],
    discount: "15%",
    description: "Classic gold and black collection"
  },
  3: { 
    id: 3, 
    name: "RGX 11z Pro Bundle", 
    collectionImg: "images/rgx-collection.jpg",
    items: [
      { id: "rgx-vandal", name: "RGX Vandal", price: 2175, img: "images/rgx-vandal.jpg", type: "rifle" },
      { id: "rgx-phantom", name: "RGX Phantom", price: 2175, img: "images/rgx-phantom.jpg", type: "rifle" },
      { id: "rgx-blade", name: "RGX Blade", price: 3550, img: "images/rgx-blade.jpg", type: "melee" },
      { id: "rgx-sheriff", name: "RGX Sheriff", price: 1775, img: "images/rgx-sheriff.jpg", type: "pistol" }
    ],
    discount: "25%",
    description: "High-tech digital collection with color-changing effects"
  }
};

// -----------------------------
// ДАННЫЕ ОТДЕЛЬНЫХ СКИНОВ (для фильтрации)
// -----------------------------
const ALL_SKINS = [
  // Reaver Collection
  { id: "reaver-vandal", name: "Reaver Vandal", price: 1775, img: "images/reaver-vandal.jpg", type: "rifle", collection: "Reaver" },
  { id: "reaver-phantom", name: "Reaver Phantom", price: 1775, img: "images/reaver-phantom.jpg", type: "rifle", collection: "Reaver" },
  { id: "reaver-operator", name: "Reaver Operator", price: 1775, img: "images/reaver-operator.jpg", type: "sniper", collection: "Reaver" },
  { id: "reaver-sheriff", name: "Reaver Sheriff", price: 1775, img: "images/reaver-sheriff.jpg", type: "pistol", collection: "Reaver" },
  
  // Prime Collection
  { id: "prime-vandal", name: "Prime Vandal", price: 1775, img: "images/prime-vandal.jpg", type: "rifle", collection: "Prime" },
  { id: "prime-phantom", name: "Prime Phantom", price: 1775, img: "images/prime-phantom.jpg", type: "rifle", collection: "Prime" },
  { id: "prime-axe", name: "Prime Axe", price: 3550, img: "images/prime-axe.jpg", type: "melee", collection: "Prime" },
  
  // RGX Collection
  { id: "rgx-vandal", name: "RGX Vandal", price: 2175, img: "images/rgx-vandal.jpg", type: "rifle", collection: "RGX" },
  { id: "rgx-phantom", name: "RGX Phantom", price: 2175, img: "images/rgx-phantom.jpg", type: "rifle", collection: "RGX" },
  { id: "rgx-blade", name: "RGX Blade", price: 3550, img: "images/rgx-blade.jpg", type: "melee", collection: "RGX" },
  { id: "rgx-sheriff", name: "RGX Sheriff", price: 1775, img: "images/rgx-sheriff.jpg", type: "pistol", collection: "RGX" },
  
  // Дополнительные скины
  { id: "ion-operator", name: "Ion Operator", price: 1775, img: "images/ion-operator.jpg", type: "sniper", collection: "Ion" },
  { id: "glitchpop-vandal", name: "Glitchpop Vandal", price: 2175, img: "images/glitchpop-vandal.jpg", type: "rifle", collection: "Glitchpop" },
  { id: "glitchpop-knife", name: "Glitchpop Knife", price: 3550, img: "images/glitchpop-knife.jpg", type: "melee", collection: "Glitchpop" }
];


// ВНУТРЕННЕЕ СОСТОЯНИЕ ЗАКАЗА

let order = {}; // ключ = itemId, value = { id, name, price, qty, img, type }

// -----------------------------
// УТИЛИТЫ
// -----------------------------
const byId = id => document.getElementById(id);

function formatPrice(n) { 
    return Number(n).toFixed(0); 
}

// ппоказать уведомление в стиле Valorant
function showValorantNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? '#ff4654' : '#0f1923'};
        color: ${isError ? '#0f1923' : '#ff4654'};
        padding: 15px 25px;
        border-radius: 8px;
        font-family: 'Valorant', 'perpetua', sans-serif;
        font-size: 16px;
        z-index: 9999;
        border: 2px solid #ff4654;
        box-shadow: 0 0 20px rgba(255, 70, 84, 0.5);
        animation: slideIn 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// ФУНКЦИИ РАБОТЫ С ЗАКАЗОМ

// добавление/увеличение позиции
function addToOrder(item) {
    if (!item || !item.id) return;
    
    if (order[item.id]) {
        order[item.id].qty += 1;
        showValorantNotification(`+1 ${item.name} (Total: ${order[item.id].qty})`);
    } else {
        order[item.id] = { ...item, qty: 1 };
        showValorantNotification(`${item.name} added to cart!`);
    }
    
    saveOrder();
    renderOrder();
}

// уменьшение количества
function decreaseQty(itemId) {
    if (!order[itemId]) return;
    
    order[itemId].qty -= 1;
    if (order[itemId].qty <= 0) {
        delete order[itemId];
        showValorantNotification(`${order[itemId]?.name || 'Item'} removed from cart`);
    } else {
        showValorantNotification(`${order[itemId].name} quantity: ${order[itemId].qty}`);
    }
    
    saveOrder();
    renderOrder();
}

// увеличение количества
function increaseQty(itemId) {
    if (!order[itemId]) return;
    
    order[itemId].qty += 1;
    showValorantNotification(`${order[itemId].name} quantity: ${order[itemId].qty}`);
    
    saveOrder();
    renderOrder();
}

// сброс заказа
function resetAll() {
    if (Object.keys(order).length === 0) return;
    
    order = {};
    saveOrder();
    renderOrder();
    
    // очищаем все поля формы
    ['fullname', 'email', 'phone', 'address', 'order-comments', 'delivery-time'].forEach(id => {
        const el = byId(id);
        if (!el) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
        else el.value = '';
    });
    
    // сбрасываем радио кнопки на "как можно скорее"
    document.querySelectorAll('input[name="delivery_time"]').forEach(r => {
        if (r.value === 'asap') r.checked = true;
    });
    
    toggleTimeInput();
    showValorantNotification('Cart cleared', true);
}

// сохранение заказа в localStorage
function saveOrder() {
    // Сохраняем в формате для корзины
    const cartItems = Object.values(order).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.img,
        qty: item.qty,
        type: item.type
    }));
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Загрузка заказа из localStorage
function loadOrder() {
    const saved = JSON.parse(localStorage.getItem('cartItems')) || [];
    order = {};
    saved.forEach(item => {
        order[item.id] = item;
    });
}

// Подсчет общей стоимости
function calculateTotal() {
    let total = 0;
    for (const id in order) {
        total += order[id].price * order[id].qty;
    }
    return total;
}

// Рендер списка заказа
function renderOrder() {
    const list = byId('order-list');
    const totalEl = byId('order-total');
    
    if (!list || !totalEl) return;
    
    list.innerHTML = '';
    let total = 0;
    
    for (const id in order) {
        const it = order[id];
        
        const li = document.createElement('li');
        li.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #ff4654;
            color: #ece8e1;
        `;
        
        // Информация о товаре с миниатюрой
        const itemInfo = document.createElement('div');
        itemInfo.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 2;
        `;
        
        // Миниатюра скина
        const thumb = document.createElement('img');
        thumb.src = it.img || 'images/default-skin.jpg';
        thumb.alt = it.name;
        thumb.style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: 5px;
            border: 2px solid #ff4654;
            object-fit: cover;
        `;
        thumb.onerror = function() {
            this.src = 'images/default-skin.jpg';
        };
        
        // Название
        const name = document.createElement('span');
        name.textContent = it.name;
        name.style.fontFamily = "'Valorant', 'perpetua', sans-serif";
        
        itemInfo.appendChild(thumb);
        itemInfo.appendChild(name);
        
        // Количество
        const qtyControl = document.createElement('div');
        qtyControl.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 15px;
        `;
        
        const decBtn = document.createElement('button');
        decBtn.textContent = '−';
        decBtn.style.cssText = `
            width: 30px;
            height: 30px;
            background: transparent;
            border: 2px solid #ff4654;
            color: #ff4654;
            border-radius: 5px;
            cursor: pointer;
            font-size: 18px;
            transition: all 0.3s ease;
        `;
        decBtn.addEventListener('mouseenter', () => {
            decBtn.style.background = '#ff4654';
            decBtn.style.color = '#0f1923';
        });
        decBtn.addEventListener('mouseleave', () => {
            decBtn.style.background = 'transparent';
            decBtn.style.color = '#ff4654';
        });
        decBtn.addEventListener('click', () => decreaseQty(id));
        
        const qtySpan = document.createElement('span');
        qtySpan.textContent = it.qty;
        qtySpan.style.fontWeight = 'bold';
        qtySpan.style.color = '#ff4654';
        
        const incBtn = document.createElement('button');
        incBtn.textContent = '+';
        incBtn.style.cssText = decBtn.style.cssText;
        incBtn.addEventListener('mouseenter', () => {
            incBtn.style.background = '#ff4654';
            incBtn.style.color = '#0f1923';
        });
        incBtn.addEventListener('mouseleave', () => {
            incBtn.style.background = 'transparent';
            incBtn.style.color = '#ff4654';
        });
        incBtn.addEventListener('click', () => increaseQty(id));
        
        qtyControl.appendChild(decBtn);
        qtyControl.appendChild(qtySpan);
        qtyControl.appendChild(incBtn);
        
        // Цена
        const price = document.createElement('span');
        price.textContent = `${formatPrice(it.price * it.qty)} VP`;
        price.style.color = '#ff4654';
        price.style.fontWeight = 'bold';
        price.style.minWidth = '80px';
        price.style.textAlign = 'right';
        
        // кнопка удалить
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.cssText = `
            width: 30px;
            height: 30px;
            background: transparent;
            border: 2px solid #ff4654;
            color: #ff4654;
            border-radius: 5px;
            cursor: pointer;
            font-size: 18px;
            margin-left: 10px;
            transition: all 0.3s ease;
        `;
        removeBtn.addEventListener('mouseenter', () => {
            removeBtn.style.background = '#ff4654';
            removeBtn.style.color = '#0f1923';
        });
        removeBtn.addEventListener('mouseleave', () => {
            removeBtn.style.background = 'transparent';
            removeBtn.style.color = '#ff4654';
        });
        removeBtn.addEventListener('click', () => {
            delete order[id];
            saveOrder();
            renderOrder();
            showValorantNotification(`${it.name} removed`, true);
        });
        
        li.appendChild(itemInfo);
        li.appendChild(qtyControl);
        li.appendChild(price);
        li.appendChild(removeBtn);
        
        list.appendChild(li);
        
        total += it.price * it.qty;
    }
    
    totalEl.textContent = formatPrice(total);
    
    // обновляем счетчик в заголовке
    updateCartCounter();
}

// обновление счетчика товаров в корзине
function updateCartCounter() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    const count = Object.keys(order).length;
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'inline' : 'none';
}


// РЕНДЕР СКИНОВ
function renderSkins() {
    const weaponGrid = document.querySelector('#weapon-items .items-grid');
    const meleeGrid = document.querySelector('#melee-items .items-grid');
    
    if (!weaponGrid || !meleeGrid) return;
    
    // очищаем гриды
    weaponGrid.innerHTML = '';
    meleeGrid.innerHTML = '';
    
    // Рендерим все скины
    ALL_SKINS.forEach(skin => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.dataset.id = skin.id;
        itemDiv.dataset.name = skin.name;
        itemDiv.dataset.price = skin.price;
        itemDiv.dataset.type = skin.type;
        
        itemDiv.innerHTML = `
            <img src="${skin.img}" alt="${skin.name}" onerror="this.src='images/default-skin.jpg'">
            <h3>${skin.name}</h3>
            <p class="price">${skin.price} VP</p>
            <button class="add-btn">ADD TO CART</button>
        `;
        
        // Добавляем в соответствующий грид
        if (skin.type === 'melee') {
            meleeGrid.appendChild(itemDiv);
        } else {
            weaponGrid.appendChild(itemDiv);
        }
    });
}


// ФИЛЬТРЫ

function initFilters() {
    // Фильтры для оружия
    document.querySelectorAll('#weapon-items .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#weapon-items .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            document.querySelectorAll('#weapon-items .item').forEach(it => {
                const type = it.dataset.type;
                it.style.display = (filter === 'all' || filter === type) ? 'block' : 'none';
            });
        });
    });
    
    // Фильтры для ножей
    document.querySelectorAll('#melee-items .melee-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#melee-items .melee-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            document.querySelectorAll('#melee-items .item').forEach(it => {
                const type = it.dataset.type;
                it.style.display = (filter === 'all' || filter === type) ? 'block' : 'none';
            });
        });
    });
}


// КОМБО
function initComboClicks() {
    document.querySelectorAll('#skin-bundles .combo').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.dataset.comboId;
            if (!COMBOS[id]) return;
            
            // Добавляем все предметы из комбо
            COMBOS[id].items.forEach(it => {
                addToOrder({ 
                    id: it.id, 
                    name: it.name, 
                    price: Number(it.price),
                    img: it.img,
                    type: it.type
                });
            });
            
            // Визуальный эффект
            el.style.transform = 'scale(0.98)';
            el.style.borderColor = '#ff6a76';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
                el.style.borderColor = '#ff4654';
            }, 200);
            
            showValorantNotification(`${COMBOS[id].name} added to cart! (Save ${COMBOS[id].discount})`);
        });
        
        // Поддержка клавиатуры
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });
}


// КНОПКИ ДОБАВЛЕНИЯ

function initAddButtons() {
    document.querySelectorAll('.item .add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemEl = e.target.closest('.item');
            const id = itemEl.dataset.id;
            const name = itemEl.dataset.name;
            const price = Number(itemEl.dataset.price);
            const type = itemEl.dataset.type;
            const img = itemEl.querySelector('img')?.src || 'images/default-skin.jpg';
            
            addToOrder({ id, name, price, img, type });
            
            // Анимация кнопки
            btn.style.transform = 'scale(0.95)';
            btn.style.background = '#ff6a76';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
                btn.style.background = '#ff4654';
            }, 200);
        });
    });
}


// СОРТИРОВКА ПО ЦЕНЕ

function initSorting() {
    const sortAscBtn = document.createElement('button');
    sortAscBtn.textContent = 'PRICE ↑';
    sortAscBtn.className = 'sort-btn';
    sortAscBtn.style.cssText = `
        padding: 10px 20px;
        background: transparent;
        border: 2px solid #ff4654;
        color: #ff4654;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Valorant', sans-serif;
        margin: 0 5px;
        transition: all 0.3s ease;
    `;
    
    const sortDescBtn = document.createElement('button');
    sortDescBtn.textContent = 'PRICE ↓';
    sortDescBtn.style.cssText = sortAscBtn.style.cssText;
    
    // контейнер для кнопок сортировки
    const sortContainer = document.createElement('div');
    sortContainer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin: 20px 0;
    `;
    sortContainer.appendChild(sortAscBtn);
    sortContainer.appendChild(sortDescBtn);
    
    // добавляем перед сеткой товаров
    const weaponSection = document.getElementById('weapon-items');
    if (weaponSection) {
        const itemsGrid = weaponSection.querySelector('.items-grid');
        weaponSection.insertBefore(sortContainer, itemsGrid);
    }
    
    // функция сортировки по цене
    function sortItems(order) {
        const sections = ['#weapon-items .items-grid', '#melee-items .items-grid'];
        
        sections.forEach(selector => {
            const grid = document.querySelector(selector);
            if (!grid) return;
            
            const items = Array.from(grid.children);
            
            items.sort((a, b) => {
                const priceA = parseInt(a.dataset.price);
                const priceB = parseInt(b.dataset.price);
                return order === 'asc' ? priceA - priceB : priceB - priceA;
            });
            
            grid.innerHTML = '';
            items.forEach(item => grid.appendChild(item));
        });
        
        // обновляем кнопки после сортировки
        initAddButtons();
    }
    
    sortAscBtn.addEventListener('click', () => sortItems('asc'));
    sortDescBtn.addEventListener('click', () => sortItems('desc'));
    
    // эффекты наведения
    [sortAscBtn, sortDescBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#ff4654';
            btn.style.color = '#0f1923';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'transparent';
            btn.style.color = '#ff4654';
        });
    });
}


// ВАЛИДАЦИЯ И ОТПРАВКА

function validateForm() {
    const errors = [];
    
    if (Object.keys(order).length === 0) {
        errors.push("Your cart is empty!");
    }
    
    const fullname = byId('fullname')?.value.trim() || byId('fio')?.value.trim() || '';
    const email = byId('email')?.value.trim() || '';
    const phone = byId('phone')?.value.trim() || '';
    const address = byId('address')?.value.trim() || '';
    
    if (!fullname) errors.push("Full name is required.");
    if (!email) errors.push("Email is required.");
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push("Invalid email format.");
    if (!phone) errors.push("Phone number is required.");
    else if (!/^\+?\d{7,15}$/.test(phone)) errors.push("Invalid phone number format.");
    if (!address) errors.push("Delivery address is required.");
    
    const deliveryMode = document.querySelector('input[name="delivery_time"]:checked');
    if (deliveryMode && deliveryMode.value === 'specified') {
        const time = byId('delivery-time')?.value || byId('time-input')?.value;
        if (!time) errors.push("Please select delivery time.");
    }
    
    return errors;
}

function showMessage(text, isError = true) {
    showValorantNotification(text, isError);
}


// ВРЕМЯ ДОСТАВКИ

function toggleTimeInput() {
    const specified = document.querySelector('input[name="delivery_time"][value="specified"]')?.checked;
    const timeInput = byId('delivery-time') || byId('time-input');
    const label = byId('time-label') || byId('time-input-label');
    
    if (!timeInput || !label) return;
    
    if (specified) {
        timeInput.classList.remove('hidden');
        label.classList.remove('hidden');
        timeInput.required = true;
    } else {
        timeInput.classList.add('hidden');
        label.classList.add('hidden');
        timeInput.required = false;
    }
}

function initDeliveryRadio() {
    document.querySelectorAll('input[name="delivery_time"]').forEach(r => {
        r.addEventListener('change', toggleTimeInput);
    });
    toggleTimeInput();
}


// КНОПКИ СБРОСА

function initClearOrder() {
    const clearBtn = byId('clear-order');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            order = {};
            saveOrder();
            renderOrder();
            showValorantNotification('Cart cleared', true);
        });
    }
}

function initResetButton() {
    const resetBtn = byId('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAll);
    }
}


// ОТПРАВКА ЗАКАЗА

async function submitOrder() {
    const errors = validateForm();
    
    if (errors.length) {
        showMessage(errors.join('\n'), true);
        return;
    }
    
    const total = calculateTotal();
    const fullname = byId('fullname')?.value.trim() || byId('fio')?.value.trim() || '';
    const email = byId('email')?.value.trim() || '';
    const phone = byId('phone')?.value.trim() || '';
    const address = byId('address')?.value.trim() || '';
    const comments = byId('order-comments')?.value.trim() || '';
    const subscribe = byId('subscribe')?.checked || false;
    
    const deliveryMode = document.querySelector('input[name="delivery_time"]:checked')?.value || 'asap';
    const deliveryTime = deliveryMode === 'specified' 
        ? (byId('delivery-time')?.value || byId('time-input')?.value || '') 
        : '';
    
    // Формируем список товаров для отображения в заказе
    const itemsList = [];
    Object.values(order).forEach(item => {
        for (let i = 0; i < item.qty; i++) {
            itemsList.push(item.name);
        }
    });
    
    const payload = {
        full_name: fullname,
        email: email,
        phone: phone,
        delivery_address: address,
        delivery_type: deliveryMode === 'asap' ? "Immediate delivery" : "Scheduled delivery",
        delivery_time: deliveryTime,
        items: itemsList,
        total: total,
        comment: comments,
        status: "Pending",
        date: new Date().toLocaleString()
    };
    
    showMessage("Processing order...", false);
    
    if (!SUBMIT_URL) {
        console.log("Order payload:", payload);
        
        // сохраняем в историю заказов
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(payload);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        showSuccessPopup();
        order = {};
        saveOrder();
        renderOrder();
        return;
    }
    
    try {
        const resp = await fetch(SUBMIT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
        
        // сохраняем в историю
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({
            ...payload,
            date: new Date().toLocaleString(),
            status: "Confirmed"
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        
        showSuccessPopup();
        order = {};
        saveOrder();
        renderOrder();
    } catch (err) {
        console.error(err);
        showMessage("Error sending order: " + err.message, true);
    }
}




function showSuccessPopup() {
    const popup = byId('success-popup');
    const okBtn = byId('ok-btn') || byId('popup-ok-btn');
    
    if (!popup || !okBtn) return;
    
    popup.classList.remove('hidden');
    
   
    const popupContent = popup.querySelector('.popup-content');
    if (popupContent) {
        popupContent.innerHTML = `
            <h3 style="color: #ff4654; font-family: 'Valorant', sans-serif;">ORDER CONFIRMED!</h3>
            <p style="color: #ece8e1;">Your skins will be delivered to your address within 24 hours.</p>
            <p style="color: #ff4654;">Thank you for choosing Valorant Skins Marketplace!</p>
            <button id="popup-close-btn" class="primary-btn" style="margin-top: 20px;">OK</button>
        `;
    }
    
    const closeBtn = byId('popup-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.classList.add('hidden');
        });
    }
    
    okBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
    });
}

// ИНИЦИАЛИЗАЦИЯ

function init() {
    console.log("Valorant Skins Marketplace - Initializing...");
    
    loadOrder();
    renderSkins(); // Рендерим все скины
    initComboClicks();
    initAddButtons();
    initFilters();
    initSorting();
    initDeliveryRadio();
    initClearOrder();
    initResetButton();
    
    const submitBtn = byId('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitOrder);
    }
    
    renderOrder();
    
    //анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .cart-count {
            background: #ff4654;
            color: #0f1923;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
            margin-left: 5px;
        }
        
        .hidden {
            display: none !important;
        }
        
        /* Стили для комбо-наборов */
        #skin-bundles .combo {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        #skin-bundles .combo:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(255, 70, 84, 0.3);
        }
        
        /* Стили для карточек товаров */
        .item {
            transition: all 0.3s ease;
        }
        
        .item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(255, 70, 84, 0.3);
        }
        
        .item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid #ff4654;
        }
    `;
    document.head.appendChild(style);
    
    console.log("Valorant Skins Marketplace - Ready!");
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', init);