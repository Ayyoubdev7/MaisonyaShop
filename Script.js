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

// ------------------- THEME TOGGLE -------------------
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

// ------------------- CART SIDEBAR -------------------
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

// ------------------- ADD TO CART -------------------
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
    showAddToCartPopup(name);
  });
});

// ------------------- POPUP EFFECT -------------------
function showAddToCartPopup(productName) {
  const popup = document.createElement("div");
  popup.className = "cart-popup";
  popup.innerHTML = `🛒 تم إضافة <strong>${productName}</strong> إلى السلة ✅`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("show");
  }, 10);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 500);
  }, 2000);
}

// ------------------- UPDATE CART DISPLAY -------------------
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>${(item.price * item.qty).toFixed(2)} DH</span>
    `;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  cartTotal.textContent = total.toFixed(2);
}

// ------------------- CHECKOUT -------------------
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("🛍️ سلتك فارغة!");
    return;
  }
  checkoutModal.classList.add("active");
});
cancelCheckout.addEventListener("click", () => {
  checkoutModal.classList.remove("active");
});

// ------------------- GOOGLE SHEET + WHATSAPP -------------------
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSr9sEcLa0ABeR12D8oe5etlp-Qaacp_WLTdhwoxIqQsjouBUlkh7C6vJaYy8MhoBh/exec";
const MERCHANT_WHATSAPP = "212642778240"; // your WhatsApp number

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);

  const orderText = cart
    .map((i) => `${i.name} x${i.qty} (${(i.price * i.qty).toFixed(2)} DH)`)
    .join(" | ");

  // 🟢 Send to Google Sheets
  const params = new URLSearchParams({
    name,
    phone,
    address,
    total,
    order: orderText,
    date: new Date().toLocaleString(),
  });

  try {
    await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
  } catch (err) {
    console.error("Google Sheet error:", err);
  }

  // 🟢 Send WhatsApp message
  let message = `🏠 *New Order — Maisonya*%0A`;
  message += `👤 *Name:* ${encodeURIComponent(name)}%0A`;
  message += `📞 *Phone:* ${encodeURIComponent(phone)}%0A`;
  message += `📍 *Address:* ${encodeURIComponent(address)}%0A%0A`;
  message += `🛒 *Order Details:*%0A`;
  cart.forEach((item) => {
    message += `• ${encodeURIComponent(item.name)} x${item.qty} = ${(item.price * item.qty).toFixed(2)} DH%0A`;
  });
  message += `%0A💰 *Total:* ${total} DH%0A🕒 ${encodeURIComponent(new Date().toLocaleString())}`;

  const whatsappURL = `https://wa.me/${MERCHANT_WHATSAPP}?text=${message}`;
  window.open(whatsappURL, "_blank");

  // 🟢 Show success message
  checkoutModal.innerHTML = `
    <div class="checkout-content">
      <h2>✅ شكراً لك!</h2>
      <p>تم إرسال طلبك بنجاح.</p>
      <p>سيتم إعادتك إلى الصفحة الرئيسية...</p>
    </div>
  `;

  // Clear cart
  cart = [];
  updateCart();

  setTimeout(() => {
    checkoutModal.classList.remove("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 3000);
});

// ------------------- REDIRECT HOME -------------------
document.getElementById("goHome").addEventListener("click", function () {
  window.location.href = "https://ayyoubdev7.github.io/MaisonyaShop/";
});

// ------------------- POPUP CSS -------------------
const popupStyle = document.createElement("style");
popupStyle.textContent = `
.cart-popup {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(45deg, #6c63ff, #ff6ec7);
  color: white;
  padding: 15px 25px;
  border-radius: 20px;
  font-size: 18px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  z-index: 9999;
}
.cart-popup.show {
  opacity: 1;
  transform: translateY(0);
}
`;
document.head.appendChild(popupStyle);
