// ===============================
// ФАЙЛ place_an_order.js - Оформление заказа
// ===============================

// Получаем данные корзины из единого источника
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

const orderFlexbox = document.getElementById("order-flexbox");
const checkoutList = document.getElementById("checkout-list");
const totalPriceSpan = document.getElementById("total-price");

// Функция отображения корзины
function renderCart() {
    if (!orderFlexbox || !checkoutList || !totalPriceSpan) {
        console.error("Required elements not found!");
        return;
    }
    
    orderFlexbox.innerHTML = "";
    checkoutList.innerHTML = "";
    let total = 0;
    
    if (cartItems.length === 0) {
        orderFlexbox.innerHTML = '<p style="color: #8a9aa8; text-align: center; width: 100%;">Your cart is empty. Go to <a href="index.html" style="color: #ff4654;">catalog</a> to add skins.</p>';
        checkoutList.innerHTML = '<li style="color: #8a9aa8;">No items</li>';
        totalPriceSpan.textContent = "0";
        return;
    }
    
    cartItems.forEach((item, index) => {
        // Карточки в виде скинов
        const div = document.createElement("div");
        div.className = "item-card";
        div.innerHTML = `
            <img src="${item.img || 'images/default-skin.jpg'}" alt="${item.name}" onerror="this.src='images/default-skin.jpg'">
            <h4>${item.name}</h4>
            <p class="price">${item.price} VP</p>
            <p class="quantity">Quantity: ${item.qty || 1}</p>
            <button onclick="removeItem(${index})" class="remove-btn">REMOVE</button>
        `;
        orderFlexbox.appendChild(div);
        
        // Список для оформления с учетом количества
        const li = document.createElement("li");
        li.innerHTML = `${item.name} x${item.qty || 1} <span>${(item.price * (item.qty || 1))} VP</span>`;
        checkoutList.appendChild(li);
        
        total += item.price * (item.qty || 1);
    });
    
    totalPriceSpan.textContent = total;
}

// Удаление из корзины
window.removeItem = function(index) {
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    renderCart();
};

// Логика времени доставки
const timeLabel = document.getElementById("time-label");
const deliveryTimeInput = document.getElementById("delivery-time");

if (timeLabel && deliveryTimeInput) {
    document.querySelectorAll('input[name="delivery_time"]').forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "specified" && radio.checked) {
                timeLabel.classList.remove("hidden");
                deliveryTimeInput.classList.remove("hidden");
            } else if (radio.value === "asap" && radio.checked) {
                timeLabel.classList.add("hidden");
                deliveryTimeInput.classList.add("hidden");
            }
        });
    });
}

// Отправка заказа - УЛУЧШЕННАЯ ВЕРСИЯ С ОТЛАДКОЙ
document.getElementById("submit-btn")?.addEventListener("click", () => {
    console.log("Submit button clicked");
    
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // Пробуем разные возможные ID для поля имени
    const nameInput = document.getElementById("username") || 
                      document.getElementById("fullname") || 
                      document.getElementById("fio") || 
                      document.getElementById("name");
    
    const emailInput = document.getElementById("email");
    const riotIdInput = document.getElementById("riot-id");
    const addressInput = document.getElementById("address");
    const phoneInput = document.getElementById("phone");
    const commentsInput = document.getElementById("order-comments");
    
    // Отладка: выводим найденные элементы
    console.log("Name input found:", nameInput);
    console.log("Email input found:", emailInput);
    
    if (!nameInput) {
        alert("Error: Name input field not found on the page!");
        return;
    }
    
    // Получаем значения полей
    const username = nameInput.value.trim();
    const email = emailInput ? emailInput.value.trim() : "";
    const riotId = riotIdInput ? riotIdInput.value.trim() : "";
    const address = addressInput ? addressInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const comments = commentsInput ? commentsInput.value.trim() : "";
    
    console.log("Username value:", username);
    
    // Проверяем только имя (должно быть не пустым)
    if (!username) {
        alert("Please enter your name!");
        return;
    }
    
    const deliveryTypeRadio = document.querySelector('input[name="delivery_time"]:checked');
    if (!deliveryTypeRadio) {
        alert("Please select delivery type!");
        return;
    }
    const deliveryType = deliveryTypeRadio.value;
    
    // Формируем список товаров с учетом количества
    const items = [];
    cartItems.forEach(item => {
        for (let i = 0; i < (item.qty || 1); i++) {
            items.push(item.name);
        }
    });
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    
    const order = {
        id: "ORD-" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        full_name: username,
        email: email || "not@provided.com",
        phone: phone || "Not provided",
        riot_id: riotId || "Guest#0000",
        delivery_address: address || "Digital delivery",
        delivery_type: deliveryType === "asap" ? "Immediate delivery" : "Scheduled delivery",
        delivery_time: deliveryType === "specified" ? (deliveryTimeInput?.value || "") : "",
        items: items,
        total: total,
        comment: comments || "",
        date: new Date().toLocaleString(),
        status: "Pending"
    };
    
    console.log("Order created:", order);
    
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Очищаем корзину
    cartItems = [];
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    renderCart();
    showSuccessPopup();
    
    // Очищаем форму
    if (nameInput) nameInput.value = "";
    if (emailInput) emailInput.value = "";
    if (phoneInput) phoneInput.value = "";
    if (riotIdInput) riotIdInput.value = "";
    if (addressInput) addressInput.value = "";
    if (commentsInput) commentsInput.value = "";
    if (deliveryTimeInput) deliveryTimeInput.value = "";
    
    // Сбрасываем радио на "asap"
    document.querySelectorAll('input[name="delivery_time"]').forEach(r => {
        if (r.value === 'asap') r.checked = true;
    });
    if (timeLabel && deliveryTimeInput) {
        timeLabel.classList.add("hidden");
        deliveryTimeInput.classList.add("hidden");
    }
});

// Сброс формы
document.getElementById("reset-btn")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your cart and reset the form?")) {
        cartItems = [];
        localStorage.removeItem("cartItems");
        renderCart();
        
        // Очищаем поля формы
        const nameInput = document.getElementById("username") || document.getElementById("fullname") || document.getElementById("fio");
        const emailInput = document.getElementById("email");
        const phoneInput = document.getElementById("phone");
        const riotIdInput = document.getElementById("riot-id");
        const addressInput = document.getElementById("address");
        const commentsInput = document.getElementById("order-comments");
        
        if (nameInput) nameInput.value = "";
        if (emailInput) emailInput.value = "";
        if (phoneInput) phoneInput.value = "";
        if (riotIdInput) riotIdInput.value = "";
        if (addressInput) addressInput.value = "";
        if (commentsInput) commentsInput.value = "";
        if (deliveryTimeInput) deliveryTimeInput.value = "";
        
        // Сбрасываем радио на "asap"
        document.querySelectorAll('input[name="delivery_time"]').forEach(r => {
            if (r.value === 'asap') r.checked = true;
        });
        if (timeLabel && deliveryTimeInput) {
            timeLabel.classList.add("hidden");
            deliveryTimeInput.classList.add("hidden");
        }
    }
});

// Попап успешного заказа
const successPopup = document.getElementById("success-popup");
const okBtn = document.getElementById("ok-btn");

function showSuccessPopup() {
    if (successPopup) {
        successPopup.classList.remove("hidden");
    }
}

if (okBtn) {
    okBtn.addEventListener("click", () => {
        if (successPopup) {
            successPopup.classList.add("hidden");
        }
    });
}

// Добавляем стили для кнопок удаления
const style = document.createElement('style');
style.textContent = `
    .remove-btn {
        background: #ff4654;
        color: #0f1923;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        font-family: 'Valorant', sans-serif;
        margin-top: 10px;
        transition: all 0.3s ease;
    }
    
    .remove-btn:hover {
        background: #ff6a76;
        transform: scale(1.05);
    }
    
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);

// Инициализация
renderCart();
console.log("Place order page loaded with", cartItems.length, "items");