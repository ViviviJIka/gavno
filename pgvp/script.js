const jsonData = `[
    { "name": "Услуга 1", "price": 150, "photo": "img/services/1.png", "description": "Описание услуги 3" },
    { "name": "Услуга 2", "price": 250, "photo": "img/services/1.png", "description": "Описание услуги 2" },
    { "name": "Услуга 3", "price": 350, "photo": "img/services/1.png", "description": "Описание услуги 3" }
]`;

let productsFromJSON = JSON.parse(jsonData)

let servicesList = document.querySelector('.services__list');
let productTemplate = document.getElementById('service-item');

    //Рендер услуг из JSON 
let itemTemplate = document.getElementById('product');

function renderServices() {

    for (let product in productsFromJSON) {
        let serviceItem = productTemplate.content.cloneNode(true);
        
        serviceItem.querySelector('.services__item-price').textContent = productsFromJSON[product].price;
        serviceItem.querySelector('.services__item-name').textContent = productsFromJSON[product].name;
        serviceItem.querySelector('.services__item-desc').textContent = productsFromJSON[product].description;
        serviceItem.querySelector('img').setAttribute('src', productsFromJSON[product].photo);

        addToCartFunction(serviceItem, product);

        servicesList.appendChild(serviceItem);
    }
}

renderServices();

// Переменные с DOM-объектами;
let cartButton = document.querySelector('.button__cart'); // Кнопка открытия корзины
let cartMenu = document.querySelector('.show-menu'); // Корзина
let cartItemList = document.querySelector('.cart-menu-list'); // Список для товаров в корзине
let cartPrice = document.querySelector('.cart-price'); // Общая стоимость товаров в корзине
let cartClearButton = document.querySelector('.cart-clear-button'); // Кнопка очистки корзины

cartItemList.innerHTML = '';


let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

    // Функция добавления товара в корзину
function addToCartFunction(serviceItem, product) {
    serviceItem.querySelector('.services__item-cart').addEventListener('click', function(e) {

        let templateClone = itemTemplate.content.cloneNode(true);
        let itemsInCart = document.querySelectorAll('.cart-item-name');
        let found = false;

        if (itemsInCart.length != 0) {

            for (item of itemsInCart) {
                if (item.textContent === productsFromJSON[product].name) {
                    let currentItem = item.closest('.cart-menu-item');
                    let currentCount = currentItem.querySelector('.cart-item-count');
                    currentCount.textContent = Number(currentCount.textContent) + 1;
                    
                    // Обновление количества товара в объекте cart
                    cart[productsFromJSON[product].name].quantity++;
                    
                    found = true;
                    break;
                }
            }
        }

        // Если товар не найден, добавляем его в DOM и в объект cart
        if (!found) { 
            templateClone.querySelector('.cart-item-name').textContent = productsFromJSON[product].name;
            templateClone.querySelector('.cart-item-price').textContent = productsFromJSON[product].price;

            let incButton = templateClone.querySelector('.increase-cart-item');
            let decButton = templateClone.querySelector('.decrease-cart-item');

            addControlButtonEvents(incButton, decButton);
            cartItemList.appendChild(templateClone);

            // Добавление нового товара в объект cart
            cart[productsFromJSON[product].name] = {
                price: productsFromJSON[product].price,
                quantity: 1
            };
        }

        saveCart();
        calculateCartPrice();
    });
}

    // Функция загрузки корзины при старте страницы
function loadCart() {
    for (let product in cart) {
        let templateClone = itemTemplate.content.cloneNode(true);
    
        templateClone.querySelector('.cart-item-name').textContent = product;
        templateClone.querySelector('.cart-item-price').textContent = cart[product].price;
        templateClone.querySelector('.cart-item-count').textContent = cart[product].quantity;
    
        let incButton = templateClone.querySelector('.increase-cart-item');
        let decButton = templateClone.querySelector('.decrease-cart-item');
    
        addControlButtonEvents(incButton, decButton);
        cartItemList.appendChild(templateClone);
    }
}
    
    // Загрузка корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', loadCart);

    // Функция добавления обработчиков событий на кнопки + и -
function addControlButtonEvents(incButton, decButton) {

    incButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const cartItem = this.closest('.cart-menu-item');
        const itemName = cartItem.querySelector('.cart-item-name').textContent;
        const quantityInput = cartItem.querySelector('.cart-item-count');
        quantityInput.textContent = Number(quantityInput.textContent) + 1;

        // Обновляем количество в объекте cart
        cart[itemName].quantity++;
        saveCart(); 

        calculateCartPrice();
    });

    decButton.addEventListener('click', function(e) {
        e.preventDefault();
    
        const cartItem = this.closest('.cart-menu-item');
        const itemName = cartItem.querySelector('.cart-item-name').textContent;
        const quantityInput = cartItem.querySelector('.cart-item-count');
        const newQuantity = Number(quantityInput.textContent) - 1;

        if (newQuantity >= 1) {

            quantityInput.textContent = newQuantity;
            cart[itemName].quantity--;
            saveCart(); 

        } else {

            cartItem.remove();
            delete cart[itemName];
            saveCart();
        }

        calculateCartPrice();
    });
}

    // Функция подсчёта общей стоимости корзины
function calculateCartPrice() {
    let totalPrice = 0;

    let allCartItems = document.querySelectorAll('.cart-menu-item');
    allCartItems.forEach(function(item) {
        totalPrice += Number(item.querySelector('.cart-item-count').textContent) * Number(item.querySelector('.cart-item-price').textContent.replace('Р', ''));
    })

    cartPrice.textContent = `Общая цена: ${totalPrice} руб.`;
}

    // Открывание / закрывание меню
cartButton.addEventListener('click', function(e) { 
    e.preventDefault();
    cartMenu.classList.toggle('show');
    cartButton.classList.toggle('isActive');
    calculateCartPrice();
});

    // Кнопка очистки корзины
cartClearButton.addEventListener('click', function(e) {
    e.preventDefault();

    let cartList = document.querySelectorAll('.cart-menu-item');

    cartList.forEach(function(item) {
        item.remove();
    })

    cart = {};
    localStorage.removeItem('cart');
    cartItemList.innerHTML = '';
    cartPrice.textContent = `Общая цена: 0 руб.`;
});