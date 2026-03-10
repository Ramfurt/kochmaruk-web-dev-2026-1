// ===============================
// ФАЙЛ load_skins.js
// ===============================

// Функция для загрузки скинов с сервера
async function loadSkins() {
    // Адрес API (замените на свой, если нужно)
    const apiURL = 'https://your-api.com/valorant-skins'; // ЗДЕСЬ НУЖНО УКАЗАТЬ ВАШ API
    
    try {
        const response = await fetch(apiURL);
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        
        const skins = await response.json();
        console.log(`Загружено ${skins.length} скинов`);
        
        // Инициализация интерфейса
        initializeFilters();
        initializeAddButtons(skins);
        
    } catch (error) {
        console.warn('Не удалось загрузить скины:', error);
        // Если сервер недоступен, используем локальные данные
        initializeFilters();
        initializeAddButtons();
    }
}

// Инициализация фильтров
function initializeFilters() {
    // Фильтры для оружия
    const filterBtns = document.querySelectorAll("#weapon-items .filter-btn");
    const itemsGrid = document.querySelector("#weapon-items .items-grid");
    
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filter = btn.dataset.filter;
            const items = itemsGrid.querySelectorAll(".item");
            
            items.forEach(item => {
                if (filter === "all" || item.dataset.type === filter) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
    
    // Фильтры для холодного оружия
    const meleeFilterBtns = document.querySelectorAll("#melee-items .melee-filter-btn");
    const meleeGrid = document.querySelector("#melee-items .items-grid");
    
    meleeFilterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            meleeFilterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filter = btn.dataset.filter;
            const items = meleeGrid.querySelectorAll(".item");
            
            items.forEach(item => {
                if (filter === "all" || item.dataset.type === filter) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
}

// Инициализация кнопок "Добавить в корзину"
function initializeAddButtons(serverSkins = null) {
    const addButtons = document.querySelectorAll(".add-btn");
    
    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const itemCard = btn.closest(".item");
            const id = itemCard.dataset.id;
            const name = itemCard.dataset.name;
            const price = parseInt(itemCard.dataset.price);
            const img = itemCard.querySelector("img").src;
            
            let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            
            cartItems.push({ id, name, price, img });
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            
            alert(`${name} added to cart!`);
        });
    });
}

// Автоматический запуск
document.addEventListener("DOMContentLoaded", loadSkins);