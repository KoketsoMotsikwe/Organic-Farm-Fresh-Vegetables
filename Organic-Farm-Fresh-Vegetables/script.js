
// toggle
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  }

   //Cart

let listProductHTML = document.querySelector('.listProduct');

let listCartHTML = document.querySelector('.listCart');

let iconCart = document.querySelector('.icon-cart');

let iconCartSpan = document.querySelector('.icon-cart span');

let body = document.querySelector('body');

let closeCart = document.querySelector('.close');

let products = [];

let cart = [];

 

iconCart.addEventListener('click', () => {

    body.classList.toggle('showCart');

})

closeCart.addEventListener('click', () => {

    body.classList.toggle('showCart');

})

 

const addDataToHTML = () => {

  // remove datas default from HTML

 

  // add new datas

  if(products.length > 0) // if has data

  {

      products.forEach(product => {

          let newProduct = document.createElement('div');

          newProduct.dataset.id = product.id;

          newProduct.classList.add('item');

          newProduct.innerHTML =

          `<img src="${product.image}" alt="">

          <h2>${product.name}</h2>

          <div class="price">${formatPrice(product.price)}</div> <!-- Use formatted price directly -->

          <button class="addCart">Add To Cart</button>`;

          listProductHTML.appendChild(newProduct);

      });

  }

}

 

// Function to format price with "R" symbol

const formatPrice = (price) => {

  return price.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });

}

 

    listProductHTML.addEventListener('click', (event) => {

        let positionClick = event.target;

        if(positionClick.classList.contains('addCart')){

            let id_product = positionClick.parentElement.dataset.id;

            addToCart(id_product);

        }

    })

const addToCart = (product_id) => {

    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);

    if(cart.length <= 0){

        cart = [{

            product_id: product_id,

            quantity: 1

        }];

    }else if(positionThisProductInCart < 0){

        cart.push({

            product_id: product_id,

            quantity: 1

        });

    }else{

        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;

    }

    addCartToHTML();

    addCartToMemory();

}

const addCartToMemory = () => {

    localStorage.setItem('cart', JSON.stringify(cart));

}

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
        })
    }

 
    iconCartSpan.innerText = totalQuantity;

    iconCartSpan.nextElementSibling.innerText = formatPrice(totalPrice);
}


 

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

})

const changeQuantityCart = (product_id, type) => {

    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

    if(positionItemInCart >= 0){

        let info = cart[positionItemInCart];

        switch (type) {

            case 'plus':

                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;

                break;

       

            default:

                let changeQuantity = cart[positionItemInCart].quantity - 1;

                if (changeQuantity > 0) {

                    cart[positionItemInCart].quantity = changeQuantity;

                }else{

                    cart.splice(positionItemInCart, 1);

                }

                break;

        }

    }

    addCartToHTML();

    addCartToMemory();

}

 

const initApp = () => {

    // get data product

    fetch('products.json')

    .then(response => response.json())

    .then(data => {

        products = data;

        addDataToHTML();

 

        // get data cart from memory

        if(localStorage.getItem('cart')){

            cart = JSON.parse(localStorage.getItem('cart'));

            addCartToHTML();

        }

    })

}

initApp();
