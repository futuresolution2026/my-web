const products = [
  {id:1,name:"TP-Link Archer C64",desc:"AC1200 Dual Band Wi-Fi",price:2450,old:2890,badge:"-15%",cat:"router"},
  {id:2,name:"Tenda AC10",desc:"AC1200 Smart Wi-Fi",price:2150,old:2450,badge:"NEW",cat:"router",dark:true},
  {id:3,name:"Xiaomi Router 4C",desc:"300Mbps Wi-Fi Router",price:1450,old:1790,badge:"-10%",cat:"router"},
  {id:4,name:"Huawei WS5200",desc:"Dual Band Gigabit Router",price:4150,old:4650,badge:"HOT",cat:"router"}
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let cart = JSON.parse(localStorage.getItem("futureCart") || "[]");
let selectedCategory = "all";

function money(n){ return "৳ " + n.toLocaleString("en-BD"); }
function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove("show"),2200);
}
function saveCart(){ localStorage.setItem("futureCart",JSON.stringify(cart)); renderCart(); updateCartCount(); }
function updateCartCount(){ $("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0); }

function renderProducts(){
  const q=$("#searchInput").value.trim().toLowerCase();
  const list=products.filter(p=>(selectedCategory==="all"||p.cat===selectedCategory) &&
    (!q || (p.name+" "+p.desc).toLowerCase().includes(q)));
  $("#productGrid").innerHTML=list.map(p=>`
    <article class="product">
      <span class="badge ${p.badge==="NEW"?"new":p.badge==="HOT"?"hot":""}">${p.badge}</span>
      <div class="product-visual"><div class="mini-router ${p.dark?"dark":""}"><i></i></div></div>
      <h3>${p.name}</h3><p>${p.desc}</p>
      <div class="stars">★★★★★ <span style="color:#9eabc0">4.8 (256)</span></div>
      <div class="price"><div><strong>${money(p.price)}</strong> <del>${money(p.old)}</del></div>
        <button class="add-cart" data-id="${p.id}" aria-label="Add ${p.name}">🛒</button>
      </div>
    </article>`).join("") || `<p class="empty">No products found.</p>`;
  $$(".add-cart").forEach(b=>b.addEventListener("click",()=>addToCart(+b.dataset.id)));
}
function addToCart(id){
  const p=products.find(x=>x.id===id); const row=cart.find(x=>x.id===id);
  if(row) row.qty++; else cart.push({id,qty:1});
  saveCart(); toast(`${p.name} added to cart`);
}
function renderCart(){
  const box=$("#cartItems");
  if(!cart.length){box.innerHTML='<p class="empty">Your cart is empty.</p>';$("#cartTotal").textContent="৳ 0";return;}
  let total=0;
  box.innerHTML=cart.map(x=>{
    const p=products.find(y=>y.id===x.id); total+=p.price*x.qty;
    return `<div class="cart-row"><div class="mini-router ${p.dark?"dark":""}"><i></i></div>
      <div class="cart-info"><strong>${p.name}</strong><small>${money(p.price)} × ${x.qty}</small></div>
      <button class="remove" data-remove="${p.id}">Remove</button></div>`;
  }).join("");
  $("#cartTotal").textContent=money(total);
  $$("[data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==+b.dataset.remove);saveCart();});
}
function openPanel(id){ $(id).classList.add("open"); }
function closePanels(){ $$(".side-panel").forEach(x=>x.classList.remove("open")); }
function setCategory(cat){
  toast(cat==="all"?"Showing all products":`Category: ${cat}`);
}

$("#menuBtn").onclick=()=>{$("#drawer").classList.add("open");$("#backdrop").classList.add("open")};
$("#closeDrawer").onclick=()=>{$("#drawer").classList.remove("open");$("#backdrop").classList.remove("open")};
$("#backdrop").onclick=()=>{$("#drawer").classList.remove("open");$("#backdrop").classList.remove("open");closePanels()};
$("#drawerCategory").onclick=()=>$("#drawerCategories").classList.toggle("open");
$$("[data-category]").forEach(b=>b.onclick=()=>setCategory(b.dataset.category));
$("#profileBtn").onclick=()=>$("#profileMenu").classList.toggle("open");
document.addEventListener("click",e=>{
  if(!e.target.closest(".profile-wrap")) $("#profileMenu").classList.remove("open");
});
$("#searchInput").addEventListener("input",renderProducts);
$("#cartBtn").onclick=()=>openPanel("#cartPanel");
$("#notifyBtn").onclick=()=>openPanel("#notifyPanel");
$$(".close-panel").forEach(b=>b.onclick=closePanels);
$("#checkoutBtn").onclick=()=>cart.length?toast("Checkout flow ready — connect your payment gateway here."):toast("Your cart is empty");
$("#viewAllBtn").onclick=()=>{selectedCategory="all";$("#searchInput").value="";renderProducts();document.querySelector(".products-section").scrollIntoView({behavior:"smooth"});};
$$(".order-btn").forEach(b=>b.onclick=()=>{addToCart(1);openPanel("#cartPanel");});
$$(".slider-dots button").forEach((b,i)=>b.onclick=()=>{$$(".slider-dots button").forEach(x=>x.classList.remove("active"));b.classList.add("active");toast(`Banner ${i+1} selected`)});
$("#newsletter").onsubmit=e=>{e.preventDefault();toast("Thanks! Newsletter subscription saved.");e.target.reset();};
$("#logoutBtn").onclick=()=>toast("Logout action connected — add your auth endpoint here.");
$("#drawerLogout").onclick=()=>toast("Logout action connected — add your auth endpoint here.");

renderProducts();renderCart();updateCartCount();
