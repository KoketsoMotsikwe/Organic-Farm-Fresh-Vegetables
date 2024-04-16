
// toggle
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  }
// Selecting DOM elements
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');

// Arrays to hold product and cart data
let products = [];
let cart = [];

// Toggle cart visibility on icon click
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Close cart on close button click
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Function to add product data to HTML
const addDataToHTML = () => {
    // Clear default data from HTML
    // (Assuming you would clear listProductHTML here if needed)

    // Add new product data to HTML
    if(products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${formatPrice(product.price)}</div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

// Function to format price with "R" symbol
const formatPrice = (price) => {
    return price.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });
}

// Event listener for adding items to cart
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// Function to add product to cart
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
}

// Event listeners for cart item delete buttons
const deleteButtons = document.querySelectorAll('.delete-item');
deleteButtons.forEach((button) => {
    button.addEventListener('click', removeCartItem);
});

// Function to remove item from cart
function removeCartItem(event) {
    const cartItem = event.target.parentElement;
    cartItem.remove();
}

// Function to save cart data to local storage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to display cart data in HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            let subtotal = info.price * item.quantity;
            totalPrice += subtotal; 

            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            let formattedPrice = formatPrice(subtotal);

            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">${formattedPrice}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>`;
        });
    }

    iconCartSpan.innerText = totalQuantity;
    iconCartSpan.nextElementSibling.innerText = formatPrice(totalPrice);
}

// Event listener for changing cart item quantities
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
});

// Function to change cart item quantity
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            default:
                cart[positionItemInCart].quantity -= 1;
                if (cart[positionItemInCart].quantity <= 0) {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

// Initialize the application
const initApp = () => {
    // Fetch product data
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // Load cart data from local storage
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    });
}

// Start the application
initApp();
