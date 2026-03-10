
// Загружаем заказы из localStorage
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// УДАЛЯЕМ тестовые данные - они больше не добавляются автоматически


// Сортируем по дате (новые сначала)
if (orders.length > 0) {
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const ordersTableBody = document.querySelector("#ordersTable tbody");

// Функция отображения заказов
function renderOrders() {
    if (!ordersTableBody) {
        console.error("Orders table body not found!");
        return;
    }
    
    ordersTableBody.innerHTML = "";
    
    if (orders.length === 0) {
        // Показываем сообщение, если заказов нет
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 50px; color: #ff4654;">
                <h3>No orders found</h3>
                <p>Go to <a href="skins.html" style="color: #ff4654;">Browse Skins</a> to make your first order!</p>
            </td>
        `;
        ordersTableBody.appendChild(tr);
        return;
    }
    
    orders.forEach((order, index) => {
        const tr = document.createElement("tr");
        
        // Форматируем состав заказа для отображения
        const itemsList = Array.isArray(order.items) 
            ? order.items.join(', ') 
            : (order.items || "No items");
        
        // Статус заказа
        const status = order.status || "Processing";
        const statusColor = status === "Completed" ? "#4CAF50" : "#ff4654";
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.date || "N/A"}</td>
            <td>
                <div style="max-width: 300px;">
                    <strong>${itemsList}</strong>
                    ${order.riot_id ? `<br><small style="color: #8a9aa8;">Riot: ${order.riot_id}</small>` : ''}
                </div>
            </td>
            <td style="color: #ff4654; font-weight: bold;">${order.total || 0} VP</td>
            <td>
                <div>
                    ${order.delivery_time ? 
                      `<span>${order.delivery_time}</span>` : 
                      `<span>As soon as possible</span>`}
                    <br>
                    <small style="color: #8a9aa8;">${order.delivery_type || "Standard"}</small>
                </div>
            </td>
            <td>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <i class="bi bi-eye" onclick="viewOrder(${index})" 
                       style="color: #ff4654; cursor: pointer; font-size: 20px;"
                       title="View details"></i>
                    <i class="bi bi-pencil" onclick="editOrder(${index})" 
                       style="color: #ff4654; cursor: pointer; font-size: 20px;"
                       title="Edit order"></i>
                    <i class="bi bi-trash" onclick="deleteOrder(${index})" 
                       style="color: #ff4654; cursor: pointer; font-size: 20px;"
                       title="Delete order"></i>
                    <span style="color: ${statusColor}; font-size: 12px; padding: 2px 5px; border: 1px solid ${statusColor}; border-radius: 3px;">
                        ${status}
                    </span>
                </div>
            </td>
        `;
        ordersTableBody.appendChild(tr);
    });
}

// Функции для модальных окон
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "block";
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "none";
    }
}

// Просмотр деталей заказа
function viewOrder(index) {
    const order = orders[index];
    if (!order) return;
    
    const detailsDiv = document.getElementById("orderDetails");
    if (!detailsDiv) return;
    
    const itemsList = Array.isArray(order.items) 
        ? order.items.map(item => `• ${item}`).join('<br>') 
        : order.items || "No items";
    
    detailsDiv.innerHTML = `
        <div style="background: #0f1923; padding: 20px; border-radius: 10px;">
            <h3 style="color: #ff4654; margin-bottom: 15px;">Order #${index + 1}</h3>
            
            <p><strong style="color: #ff4654;">👤 Customer:</strong> ${order.full_name || "N/A"}</p>
            <p><strong style="color: #ff4654;">🎮 Riot ID:</strong> ${order.riot_id || "N/A"}</p>
            <p><strong style="color: #ff4654;">📧 Email:</strong> ${order.email || "N/A"}</p>
            <p><strong style="color: #ff4654;">📞 Phone:</strong> ${order.phone || "N/A"}</p>
            <p><strong style="color: #ff4654;">📍 Address:</strong> ${order.delivery_address || "N/A"}</p>
            <p><strong style="color: #ff4654;">🚚 Delivery:</strong> ${order.delivery_type || "Standard"} ${order.delivery_time ? 'at ' + order.delivery_time : ''}</p>
            <p><strong style="color: #ff4654;">📝 Comment:</strong> ${order.comment || "No comments"}</p>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ff4654;">
                <p><strong style="color: #ff4654;">🛒 Items:</strong></p>
                <div style="background: #1f2c3a; padding: 10px; border-radius: 5px;">
                    ${itemsList}
                </div>
            </div>
            
            <p style="margin-top: 15px; font-size: 20px;">
                <strong style="color: #ff4654;">Total:</strong> 
                <span style="color: #ff4654; font-weight: bold;">${order.total || 0} VP</span>
            </p>
            
            <p style="margin-top: 10px;">
                <strong style="color: #ff4654;">Status:</strong> 
                <span style="color: ${order.status === 'Completed' ? '#4CAF50' : '#ff4654'};">${order.status || "Processing"}</span>
            </p>
        </div>
    `;
    
    openModal("viewModal");
}

// Редактирование заказа
let editIndex = null;

function editOrder(index) {
    editIndex = index;
    const order = orders[index];
    if (!order) return;
    
    const form = document.getElementById("editForm");
    if (!form) return;
    
    // Заполняем форму данными
    form.full_name.value = order.full_name || '';
    form.email.value = order.email || '';
    form.phone.value = order.phone || '';
    form.delivery_address.value = order.delivery_address || '';
    form.delivery_type.value = order.delivery_type || 'Standard';
    form.delivery_time.value = order.delivery_time || '';
    form.comment.value = order.comment || '';
    form.riot_id.value = order.riot_id || '';
    
    openModal("editModal");
}

// Сохранение изменений
document.getElementById("editForm").onsubmit = function(e) {
    e.preventDefault();
    
    if (editIndex === null) return;
    
    const form = e.target;
    
    // Обновляем заказ
    orders[editIndex] = {
        ...orders[editIndex],
        full_name: form.full_name.value,
        email: form.email.value,
        phone: form.phone.value,
        riot_id: form.riot_id.value,
        delivery_address: form.delivery_address.value,
        delivery_type: form.delivery_type.value,
        delivery_time: form.delivery_time.value,
        comment: form.comment.value,
        status: orders[editIndex].status || "Updated"
    };
    
    // Сохраняем в localStorage
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Обновляем отображение
    renderOrders();
    closeModal("editModal");
    
    // Показываем уведомление
    alert("✅ Order updated successfully!");
};

// Удаление заказа
let deleteIndex = null;

function deleteOrder(index) {
    deleteIndex = index;
    openModal("deleteModal");
}

document.getElementById("confirmDelete").onclick = function() {
    if (deleteIndex === null) return;
    
    // Удаляем заказ
    orders.splice(deleteIndex, 1);
    
    // Сохраняем в localStorage
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Обновляем отображение
    renderOrders();
    closeModal("deleteModal");
    
    // Показываем уведомление
    alert("✅ Order deleted successfully!");
    
    deleteIndex = null;
};

// Функция для синхронизации с place_an_order
function syncWithCheckout() {
    // Загружаем заказы из localStorage (на случай, если они обновились)
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Сортируем по дате
    if (orders.length > 0) {
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    renderOrders();
}

// Проверяем новые заказы каждые 3 секунды
setInterval(syncWithCheckout, 3000);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log("Orders page loaded");
    
    // Очищаем localStorage от тестовых данных, если они там есть
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Проверяем, являются ли существующие заказы тестовыми
    if (existingOrders.length > 0) {
        const hasTestOrder1 = existingOrders.some(order => order.id === "ORD-001" && order.full_name === "John Wick");
        const hasTestOrder2 = existingOrders.some(order => order.id === "ORD-002" && order.full_name === "Jane Doe");
        
        // Если нашли тестовые заказы, очищаем localStorage
        if (hasTestOrder1 && hasTestOrder2) {
            console.log("Clearing test data from localStorage...");
            localStorage.removeItem('orders');
            orders = [];
        } else {
            orders = existingOrders;
        }
    }
    
    renderOrders();
    
    // Добавляем стили для модальных окон, если их нет
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(15, 25, 35, 0.9);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                background: linear-gradient(145deg, #1f2c3a, #0f1923);
                margin: 5% auto;
                padding: 30px;
                border: 3px solid #ff4654;
                border-radius: 15px;
                width: 60%;
                max-width: 600px;
                position: relative;
                color: #ece8e1;
            }
            
            .close {
                color: #ff4654;
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 30px;
                cursor: pointer;
            }
            
            .close:hover {
                color: #ff6a76;
            }
            
            #editForm input, #editForm textarea {
                width: 100%;
                padding: 10px;
                margin: 5px 0 15px 0;
                background: #0f1923;
                border: 2px solid #ff4654;
                border-radius: 5px;
                color: #ece8e1;
            }
            
            #editForm button {
                padding: 10px 20px;
                margin-right: 10px;
                background: #ff4654;
                color: #0f1923;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Valorant', sans-serif;
            }
            
            #editForm button:hover {
                background: #ff6a76;
            }
            
            #editForm button[type="button"] {
                background: transparent;
                border: 2px solid #ff4654;
                color: #ff4654;
            }
            
            #editForm button[type="button"]:hover {
                background: rgba(255, 70, 84, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
});

// Добавляем функцию для очистки тестовых данных вручную (на всякий случай)
function clearTestOrders() {
    localStorage.removeItem('orders');
    orders = [];
    renderOrders();
    console.log("All orders cleared");
}