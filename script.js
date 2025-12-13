// ---------- LOGIN & SIGNUP ----------
function createUser(){
  let name = document.getElementById("signupName").value;
  let email = document.getElementById("signupEmail").value;
  let pass = document.getElementById("signupPass").value;
  if(!name || !email || !pass){
    alert("Fill all fields");
    return;
  }
  let user = { name, email, pass };
  localStorage.setItem("user", JSON.stringify(user));
  alert("Account Created!");
  window.location.href = "login.html";
}

function loginUser(){
  let email = document.getElementById("loginEmail").value;
  let pass = document.getElementById("loginPass").value;
  let user = JSON.parse(localStorage.getItem("user"));
  if(!user){
    alert("Signup first");
    return;
  }
  if(email === user.email && pass === user.pass){
    localStorage.setItem("loggedIn", true);
    alert("Login Successful!");
    window.location.href = "index.html";
  } else {
    alert("Wrong credentials!");
  }
}

function logout(){
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

function checkLogin(){
  if(!localStorage.getItem("loggedIn")){
    window.location.href = "login.html";
  }
}

// ---------- PROFILE ----------
function loadProfile(){
  let user = JSON.parse(localStorage.getItem("user"));
  if(!user) return;
  document.getElementById("userName").innerText = user.name;
  document.getElementById("userEmail").innerText = user.email;
}

function editProfile(){
  let user = JSON.parse(localStorage.getItem("user"));
  let newName = prompt("New Name", user.name);
  let newEmail = prompt("New Email", user.email);
  user.name = newName;
  user.email = newEmail;
  localStorage.setItem("user", JSON.stringify(user));
  loadProfile();
}

// ---------- PRODUCTS ----------
function initializeProducts(){
  let existing = JSON.parse(localStorage.getItem("products"));
  if(!existing){
    let products = [
      {id:1, name:"Headphones", price:3999, category:"Audio", image:"images/headphones.jpg", reviews:[]},
      {id:2, name:"Smart Watch", price:2200, category:"Electronics", image:"images/smartwatch.jpg", reviews:[]},
      {id:3, name:"Gray-Nicolls Bat", price:10799, category:"Sports", image:"images/gray-nicolls.jpg", reviews:[]},
      {id:4, name:"Earbuds", price:1500, category:"Audio", image:"images/earbuds.jpg", reviews:[]}
    ];
    localStorage.setItem("products", JSON.stringify(products));
  }
}

function loadProducts(){
  initializeProducts();
  displayProducts(JSON.parse(localStorage.getItem("products")));
}

function displayProducts(products){
  let box = document.getElementById("productBox");
  if(!box) return;
  box.innerHTML = "";
  products.forEach(p=>{
    box.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" style="width:150%; height:250px; object-fit:cover;">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
        <button onclick="addToWishlist(${p.id})">Wishlist</button>
      </div>
    `;
  });
}

function displayProducts(products){
  let box = document.getElementById("productBox");
  if(!box) return;

  box.innerHTML = "";
  products.forEach(p=>{
    box.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" class="product-img">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
        <button onclick="addToWishlist(${p.id})">Wishlist</button>
      </div>
    `;
  });
}

function viewDetails(id){
  localStorage.setItem("selectedProduct", id);
  window.location.href = "product.html";
}

function searchProducts(){
  let query = document.getElementById("searchInput").value.toLowerCase();
  let products = JSON.parse(localStorage.getItem("products"));
  let filtered = products.filter(p => p.name.toLowerCase().includes(query));
  displayProducts(filtered);
}

function filterCategory(cat){
  let products = JSON.parse(localStorage.getItem("products"));
  if(cat === "All") displayProducts(products);
  else displayProducts(products.filter(p => p.category === cat));
}

// ---------- CART ----------
function addToCart(id){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let products = JSON.parse(localStorage.getItem("products"));
  let item = products.find(p => p.id === id);
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart!");
}

function loadCart(){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let box = document.getElementById("cartItems");
  if(!box) return;
  box.innerHTML = "";
  let total = 0;
  cart.forEach((c, i) => {
    total += c.price;
    box.innerHTML += `<div>${c.name} - ₹${c.price} <button onclick="removeFromCart(${i})">Remove</button></div>`;
  });
  document.getElementById("total").innerText = "Total: ₹" + total;
}

function removeFromCart(i){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(i,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// ---------- WISHLIST ----------
function addToWishlist(id){
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if(!wishlist.includes(id)){
    wishlist.push(id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to Wishlist!");
  }
}

function loadWishlist(){
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let products = JSON.parse(localStorage.getItem("products"));
  let box = document.getElementById("wishlistItems");
  if(!box) return;
  box.innerHTML = "";
  wishlist.forEach(id => {
    let p = products.find(pr => pr.id === id);
    box.innerHTML += `<div>${p.name} - ₹${p.price} <button onclick="removeFromWishlist(${id})">Remove</button></div>`;
  });
}

function removeFromWishlist(id){
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter(i => i !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  loadWishlist();
}

// ---------- ORDERS ----------
function saveOrder(items){
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push({ items, date: new Date().toLocaleString() });
  localStorage.setItem("orders", JSON.stringify(orders));
}

function loadOrders(){
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let box = document.getElementById("ordersBox");
  if(!box) return;
  box.innerHTML = "";
  orders.forEach(o => {
    box.innerHTML += `<div style="background:#eee; padding:10px; margin:10px; border-radius:6px;">
      <h3>Order Date: ${o.date}</h3>
      ${o.items.map(i => `<p>${i.name} - ₹${i.price}</p>`).join('')}
    </div>`;
  });
}

// ---------- PAYMENT ----------
function makePayment(){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0){
    alert("Cart is empty!");
    return;
  }
  saveOrder(cart);
  localStorage.removeItem("cart");
  alert("Payment Successful!");
  window.location.href = "order.html";
}

// ---------- ADMIN PANEL ----------
function addProduct(){
  let name = document.getElementById("prodName").value;
  let price = Number(document.getElementById("prodPrice").value);
  let category = document.getElementById("prodCategory").value;
  let image = document.getElementById("prodImage").value;
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let id = products.length + 1;
  products.push({ id, name, price, category, image, reviews: [] });
  localStorage.setItem("products", JSON.stringify(products));
  loadAdminProducts();
}

function loadAdminProducts(){
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let box = document.getElementById("adminProducts");
  if(!box) return;
  box.innerHTML = "";
  products.forEach((p, i) => {
    box.innerHTML += `<div>${p.name} - ₹${p.price} <button onclick="removeProduct(${i})">Remove</button></div>`;
  });
}

function removeProduct(i){
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.splice(i, 1);
  localStorage.setItem("products", JSON.stringify(products));
  loadAdminProducts();
}

// ---------- DARK MODE ----------
function toggleDark(){
  document.body.classList.toggle("dark-mode");
}
// ---------- PRODUCT DETAILS PAGE ----------
function loadDetails(){
  let id = localStorage.getItem("selectedProduct");
  if(!id) return;

  let products = JSON.parse(localStorage.getItem("products"));
  let p = products.find(item => item.id == id);

  let box = document.getElementById("detailsBox");
  box.innerHTML = `
    <img src="${p.image}" class="product-details-img">
    <h2>${p.name}</h2>
    <p><b>Price:</b> ₹${p.price}</p>
    <p><b>Category:</b> ${p.category}</p>

    <button onclick="addToCart(${p.id})">Add to Cart</button>
    <button onclick="addToWishlist(${p.id})">Add to Wishlist</button>
  `;
}
