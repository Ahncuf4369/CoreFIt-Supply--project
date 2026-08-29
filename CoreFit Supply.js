// CoreFit Supply 

// Product information
const products = [
    {
        id: 1,
        name: "Resistance Band Set",
        price: 19.99,
        description: "A set of resistance bands for strength and mobility workouts.",
        stock: 5,
        image: "images/resistance-bands.png"
    },
    {
        id: 2,
        name: "Fitness Exercise Mat",
        price: 24.99,
        description: "A comfortable exercise mat for home workouts.",
        stock: 5,
        image: "images/exercise-mat.png"
    },
    {
        id: 3,
        name: "Jump Rope",
        price: 12.99,
        description: "A lightweight jump rope for cardio workouts.",
        stock: 5,
        image: "images/jump-rope.png"
    },
    {
        id: 4,
        name: "Push-Up Bars",
        price: 17.99,
        description: "Push-up bars designed to support upper body workouts.",
        stock: 5,
        image: "images/push-up-bars.png"
    },
    {
        id: 5,
        name: "Non-Slip Yoga Mat",
        price: 29.99,
        description: "A non-slip mat for yoga, stretching, and exercise.",
        stock: 5,
        image: "images/yoga-mat.png"
    },
    {
        id: 6,
        name: "15 lb Kettlebell",
        price: 34.99,
        description: "A kettlebell for strength and full-body workouts.",
        stock: 5,
        image: "images/kettlebell.png"
    },
    {
        id: 7,
        name: "CoreFit Water Bottle",
        price: 14.99,
        description: "A reusable water bottle for workouts and everyday use.",
        stock: 5,
        image: "images/water-bottle.png"
    },
    {
        id: 8,
        name: "Foam Roller",
        price: 22.99,
        description: "A foam roller for recovery and muscle stretching.",
        stock: 5,
        image: "images/foam-roller.png"
    },
    {
        id: 9,
        name: "Adjustable Ankle Weights",
        price: 27.99,
        description: "Adjustable weights for leg and strength training.",
        stock: 5,
        image: "images/ankle-weights.png"
    },
    {
        id: 10,
        name: "Workout Gloves",
        price: 18.99,
        description: "Comfortable gloves for strength training workouts.",
        stock: 5,
        image: "images/workout-gloves.png"
    }
];


// Get saved cart from localStorage
let cart = JSON.parse(localStorage.getItem("coreFitCart")) || [];


// Save cart
function saveCart() {
    localStorage.setItem("coreFitCart", JSON.stringify(cart));
}


// Calculate how many of a product are currently in the cart
function getQuantityInCart(productId) {

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        return cartItem.quantity;
    }

    return 0;
}


// Get available stock
function getAvailableStock(product) {

    return product.stock - getQuantityInCart(product.id);
}


// Display products on the Shop page
const productList = document.getElementById("product-list");

if (productList) {

    function displayProducts() {

        productList.innerHTML = "";

        for (let i = 0; i < products.length; i++) {

            const product = products[i];

            const availableStock = getAvailableStock(product);

            let buttonText = "Add to Cart";
            let disabled = "";

            if (availableStock <= 0) {
                buttonText = "Out of Stock";
                disabled = "disabled";
            }

            productList.innerHTML += `
                <article>

                    <img

                        src="${product.image}"
                        alt="${product.name}"
                        class="product-image"
            >
                        ${product.name}
                    </div>

                    <h3>${product.name}</h3>

                    <p>
                        ${product.description}
                    </p>

                    <p class="price">
                        $${product.price.toFixed(2)}
                    </p>

                    <p>
                        Available: ${availableStock}
                    </p>

                    <button
                        class="button add-cart-button"
                        data-id="${product.id}"
                        title="${availableStock <= 0 ? "Out of Stock" : "Add item to cart"}"
                        ${disabled}
                    >
                        ${buttonText}
                    </button>

                </article>
            `;
        }


        // Add event listeners to all Add to Cart buttons
        const addButtons = document.querySelectorAll(".add-cart-button");

        addButtons.forEach(button => {

            button.addEventListener("click", function() {

                const productId = Number(this.dataset.id);

                addToCart(productId);

            });

        });

    }


    displayProducts();

}


// Add product to cart
function addToCart(productId) {

    const product = products.find(product => product.id === productId);

    if (!product) {
        return;
    }


    // Check available inventory
    if (getAvailableStock(product) <= 0) {

        showFeedback("This product is Out of Stock.");

        return;
    }


    // Check if product is already in cart
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {

        cartItem.quantity++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });

    }


    saveCart();

    showFeedback(product.name + " was added to your cart!");

    // Refresh product display if on Shop page
    if (productList) {
        displayProducts();
    }

}


// Show feedback when an item is added
function showFeedback(message) {

    const feedback = document.getElementById("cart-feedback");

    if (feedback) {

        feedback.textContent = message;

        setTimeout(function() {
            feedback.textContent = "";
        }, 3000);

    } else {

        alert(message);

    }

}


// Display shopping cart
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

if (cartList) {

    displayCart();

}


// Function to display cart
function displayCart() {

    if (!cartList) {
        return;
    }


    cartList.innerHTML = "";


    // If cart is empty
    if (cart.length === 0) {

        cartList.innerHTML = `
            <p>Your cart is currently empty.</p>
        `;

        if (cartTotal) {
            cartTotal.textContent = "$0.00";
        }

        return;
    }


    let total = 0;


    // Loop through cart items
    for (let i = 0; i < cart.length; i++) {

        const item = cart[i];

        const itemTotal = item.price * item.quantity;

        total += itemTotal;


        cartList.innerHTML += `

            <article class="cart-item">

                <h3>${item.name}</h3>

                <p>Price: $${item.price.toFixed(2)}</p>

                <label>
                    Quantity:
                    <input
                        type="number"
                        min="1"
                        max="${products.find(product => product.id === item.id).stock}"
                        value="${item.quantity}"
                        data-id="${item.id}"
                        class="quantity-input"
                    >
                </label>

                <p>
                    Item Total: $${itemTotal.toFixed(2)}
                </p>

                <button
                    class="button remove-button"
                    data-id="${item.id}"
                >
                    Remove
                </button>

            </article>

        `;

    }


    // Display total
    if (cartTotal) {

        cartTotal.textContent = "$" + total.toFixed(2);

    }


    // Quantity buttons
    const quantityInputs = document.querySelectorAll(".quantity-input");

    quantityInputs.forEach(input => {

        input.addEventListener("change", function() {

            const productId = Number(this.dataset.id);

            const newQuantity = Number(this.value);

            updateQuantity(productId, newQuantity);

        });

    });


    // Remove buttons
    const removeButtons = document.querySelectorAll(".remove-button");

    removeButtons.forEach(button => {

        button.addEventListener("click", function() {

            const productId = Number(this.dataset.id);

            removeFromCart(productId);

        });

    });

}


// Update item quantity
function updateQuantity(productId, newQuantity) {

    const product = products.find(product => product.id === productId);

    const cartItem = cart.find(item => item.id === productId);


    if (!product || !cartItem) {
        return;
    }


    // Do not allow quantity above stock
    if (newQuantity > product.stock) {

        alert("You cannot add more than the available stock.");

        newQuantity = product.stock;

    }


    if (newQuantity < 1) {

        removeFromCart(productId);

        return;

    }


    cartItem.quantity = newQuantity;

    saveCart();

    displayCart();

}


// Remove item from cart
function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    saveCart();

    displayCart();

}


// Clear entire cart
const clearCartButton = document.getElementById("clear-cart");

if (clearCartButton) {

    clearCartButton.addEventListener("click", function() {

        cart = [];

        saveCart();

        displayCart();

    });

}

// Place Order button

const placeOrderButton = document.getElementById("place-order");
const orderConfirmation = document.getElementById("order-confirmation");

if (placeOrderButton && orderConfirmation) {

    placeOrderButton.addEventListener("click", function () {

        // Get the forms
        const checkoutForm = document.getElementById("checkout-form");
        const shippingForm = document.getElementById("shipping-form");

        // Check if required payment fields are completed
        if (!checkoutForm.checkValidity() || !shippingForm.checkValidity()) {

            orderConfirmation.textContent =
                "Please complete all required fields before placing your order.";

            return;
        }

        // Successful order
        orderConfirmation.textContent =
            "Thank you! Your order has been placed successfully.";

        // Clear the cart
        cart = [];

        saveCart();

        // Reset the forms
        checkoutForm.reset();
        shippingForm.reset();
    });

}


// Checkout order confirmation
const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();


        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;

        }


        // Clear cart after successful checkout
        cart = [];

        saveCart();


        const confirmation = document.getElementById("order-confirmation");

        if (confirmation) {

            confirmation.textContent =
                "Thank you! Your order has been placed successfully.";

        }


        checkoutForm.reset();

    });

}
// Product Details Page

const productName = document.getElementById("product-name");

if (productName) {

    // Get the product number from the URL
    const urlParameters = new URLSearchParams(window.location.search);

    const productId = Number(urlParameters.get("product"));

    // Find the matching product
    const selectedProduct = products.find(function(product) {
        return product.id === productId;
    });

    if (selectedProduct) {

        // Display product information
        document.getElementById("product-image").textContent =
            selectedProduct.name;

        productName.textContent =
            selectedProduct.name;

        document.getElementById("product-description").textContent =
            selectedProduct.description;

        document.getElementById("product-price").textContent =
            "$" + selectedProduct.price.toFixed(2);

        document.getElementById("product-stock").textContent =
            "Available: " + getAvailableStock(selectedProduct);

        // Add product to cart
        const addProductButton =
            document.getElementById("product-add-cart");

        if (getAvailableStock(selectedProduct) <= 0) {

            addProductButton.textContent = "Out of Stock";
            addProductButton.disabled = true;
            addProductButton.title = "Out of Stock";

        } else {

            addProductButton.addEventListener("click", function() {

                addToCart(selectedProduct.id);

                document.getElementById("product-stock").textContent =
                    "Available: " +
                    getAvailableStock(selectedProduct);

                if (getAvailableStock(selectedProduct) <= 0) {

                    addProductButton.textContent = "Out of Stock";
                    addProductButton.disabled = true;
                    addProductButton.title = "Out of Stock";

                }

            });

        }

    }

}

// Display cart items on the Checkout page

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

if (checkoutItems && checkoutTotal) {

    checkoutItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Your cart is currently empty.</p>
        `;

    } else {

        for (let i = 0; i < cart.length; i++) {

            const item = cart[i];

            const itemTotal = item.price * item.quantity;

            total += itemTotal;

            checkoutItems.innerHTML += `
                <p>
                    ${item.name} -
                    Quantity: ${item.quantity} -
                    $${itemTotal.toFixed(2)}
                </p>
            `;
        }
    }

    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// Coupon code

const couponInput = document.getElementById("coupon-code");
const couponMessage = document.getElementById("coupon-message");

if (couponInput && couponMessage) {

    couponInput.addEventListener("input", function () {

        const coupon = couponInput.value.trim().toUpperCase();

        if (coupon === "FIT10") {

            couponMessage.textContent =
                "Coupon applied! You received 10% off.";

        } else if (coupon === "") {

            couponMessage.textContent = "";

        } else {

            couponMessage.textContent =
                "Invalid coupon code.";
        }
    });
}