const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const costumerName = document.getElementById("costumer-name");
const costumerNameWarn = document.getElementById("name-warn");
const spanItem = document.getElementById("date-span");

let cart = [];
let total = 0;

// Abrir modal do carrinho
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar modal clicando fora
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

menu.addEventListener("click", (e) => {
  let parentBtn = e.target.closest(".add-to-cart-btn");

  if (parentBtn) {
    const parentDiv = parentBtn.closest("div[data-name]");
    const name = parentDiv.getAttribute("data-name");
    const price = parseFloat(parentDiv.getAttribute("data-price"));

    // Add no carrinho
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const hasItem = cart.find((item) => item.name === name);

  if (hasItem) {
    hasItem.quantity += 1;
    return;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-btn" data-name="${item.name}">Remover</button>
        </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const name = e.target.getAttribute("data-name");
    removeItemCart(name);
  }
});
function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    } else {
      cart.splice(index, 1);
      updateCartModal();
    }
  }
}

costumerName.addEventListener("input", (e) => {
  let inputValue = e.target.value;

  if (inputValue !== "") {
    costumerName.classList.remove("border-red-500");
    costumerNameWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", () => {
  const isOpen = checkHour();
  // if (!isOpen) {
  //   Toastify({
  //     text: "A Glacimó está fechada",
  //     duration: 3000,
  //     close: true,
  //     gravity: "top", // `top` or `bottom`
  //     position: "right", // `left`, `center` or `right`
  //     stopOnFocus: true, // Prevents dismissing of toast on hover
  //     style: {
  //       background: "linear-gradient(to right, #ef4444, #ef4440)",
  //     },
  //   }).showToast();
  //   return;
  // }

  if (cart.length === 0) return;

  if (costumerName.value === "") {
    costumerNameWarn.classList.remove("hidden");
    costumerName.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return `${item.name}\nQuantidade: ${
        item.quantity
      }\nPreço: ${item.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`;
    })
    .join("");

  console.log(
    cartItems,
    "\n",
    total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  );

  const message = encodeURIComponent(
    cartItems,
    total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  );
  const phone = "+5521972874002";

  window.open(
    `https://wa.me/${phone}?text=${message} Nome: ${costumerName.value}`,
    "_blank"
  );

  cart = [];
  updateCartModal();
});

function checkHour() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 10 && hora <= 20;
}
const isOpen = checkHour();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
