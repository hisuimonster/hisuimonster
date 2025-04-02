// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to add items to cart
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
    updateCartDisplay();
}

// Function to update cart display
function updateCartDisplay() {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    
    if (!cartItems) return; // Ensure cart page exists before running
    
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₱${item.price}</td>
            <td>${item.quantity}</td>
            <td>₱${item.price * item.quantity}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartItems.appendChild(row);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = `Total: ₱${total}`;
}

// Function to remove items from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

// Checkout process
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    window.location.href = "checkout.html"; // Redirect to checkout page
}

// Payment confirmation function
function confirmPayment() {
    let paymentMethod = document.getElementById("payment-method").value;

    if (!paymentMethod) {
        alert("Please select a payment method!");
        return;
    }

    let checkoutCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];

    if (checkoutCart.length === 0) {
        alert("No items in checkout!");
        return;
    }

    let completedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    completedOrders.push({
        items: checkoutCart,
        date: new Date().toLocaleString(),
        total: checkoutCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        method: paymentMethod
    });

    localStorage.setItem("orderHistory", JSON.stringify(completedOrders));
    localStorage.removeItem("checkoutCart"); // Clear checkoutCart, not "cart"

    alert("Payment Successful via " + paymentMethod);
    window.location.href = "history.html"; // Redirect to history
}

// Load checkout and order history data
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("cart-items")) {
        updateCartDisplay();
    }

    if (document.getElementById("checkout-items")) {
        let checkoutCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
        let checkoutTable = document.getElementById("checkout-items");
        let checkoutTotal = document.getElementById("checkout-total");

        checkoutTable.innerHTML = "";
        let total = 0;

        checkoutCart.forEach((item) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>₱${item.price}</td>
                <td>${item.quantity}</td>
                <td>₱${item.price * item.quantity}</td>
            `;
            checkoutTable.appendChild(row);
            total += item.price * item.quantity;
        });

        checkoutTotal.textContent = `Total: ₱${total}`;
    }

    if (document.getElementById("order-history")) {
        let historyTable = document.getElementById("order-history");
        let completedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];

        historyTable.innerHTML = "";
        completedOrders.forEach(order => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.date}</td>
                <td>${order.items.map(item => item.name + " x" + item.quantity).join(", ")}</td>
                <td>₱${order.total}</td>
                <td>${order.method}</td>
            `;
            historyTable.appendChild(row);
        });
    }

    // Add event listener for confirm payment button if it exists
    let paymentButton = document.getElementById("confirm-payment");
    if (paymentButton) {
        paymentButton.addEventListener("click", confirmPayment);
    }

    // Add event listeners for "Add to Cart" buttons if they exist
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            let itemBox = this.closest(".item-box");
            let itemName = itemBox.getAttribute("data-name");
            let itemPrice = parseInt(itemBox.getAttribute("data-price"));
            addToCart(itemName, itemPrice);
        });
    });
});
