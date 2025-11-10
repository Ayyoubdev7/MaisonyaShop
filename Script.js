const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCart = document.getElementById("close-cart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const cancelCheckout = document.getElementById("cancel-checkout");
const checkoutForm = document.getElementById("checkout-form");
const themeToggle = document.getElementById("theme-toggle");

let cart = [];

// Toggle theme (dark/light)
themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
}

// Cart sidebar open/close
cartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("active");
  overlay.classList.add("active");
});
closeCart.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);
function closeSidebar() {
  cartSidebar.classList.remove("active");
  overlay.classList.remove("active");
}

// Add to cart
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const image = card.dataset.image;

    const existing = cart.find((item) => item.name === name);
    if (existing) existing.qty++;
    else cart.push({ name, price, image, qty: 1 });

    updateCart();
  });
});

// Update cart display
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
    `;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  cartTotal.textContent = total.toFixed(2);
}

// Checkout open/close
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  checkoutModal.classList.add("active");
});
cancelCheckout.addEventListener("click", () => {
  checkoutModal.classList.remove("active");
});

// WhatsApp order
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  const merchantPhone = "212642778240"; // ✅ Correct format for Morocco
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);
  let message = `🏠 *New Order — Maisonya*%0A`;
  message += `👤 *Name:* ${name}%0A`;
  message += `📞 *Phone:* ${phone}%0A`;
  message += `📍 *Address:* ${address}%0A%0A`;
  message += `🛒 *Order Details:*%0A`;

  cart.forEach((item) => {
    message += `• ${item.name} x${item.qty} = $${(item.price * item.qty).toFixed(2)}%0A`;
  });

  message += `%0A💰 *Total:* $${total}%0A🕒 ${new Date().toLocaleString()}`;

  // Open WhatsApp
  const whatsappURL = `https://wa.me/${merchantPhone}?text=${message}`;
  window.open(whatsappURL, "_blank");

  // Reset
  cart = [];
  updateCart();
  checkoutModal.classList.remove("active");
});
// ✅ Handle Checkout Submit
document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutModal = document.getElementById("checkout-modal");
  const cartItems = document.getElementById("cart-items");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Show success message
      checkoutModal.innerHTML = `
        <div class="checkout-content">
          <h2>✅ شكراً لك!</h2>
          <p>تم إرسال طلبك بنجاح.</p>
          <p>سيتم إعادتك إلى الصفحة الرئيسية...</p>
        </div>
      `;

      // Clear cart data
      localStorage.removeItem("cartItems");
      cartItems.innerHTML = "";
      document.querySelector(".cart-total").textContent = "المجموع: 0 د.م";

      // Redirect after 3 seconds
      setTimeout(() => {
        checkoutModal.classList.remove("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 3000);
    });
  }
});
document.getElementById("goHome").addEventListener("click", function () {
    window.location.href = "Homepage.html"; 
});
