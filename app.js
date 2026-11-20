const $ = s => document.querySelector(s);
const menuItems = [
 {id:1,name:"Samosa",category:"Snacks",price:20,desc:"Golden, flaky & filled with spiced potato.",tag:"CAMPUS CLASSIC",image:"assets/samosa.svg"},
 {id:2,name:"Masala Chai",category:"Beverages",price:15,desc:"A warm cup of freshly brewed comfort.",tag:"BEST SELLER",image:"assets/chai.svg"},
 {id:3,name:"Maggi",category:"Quick Meals",price:35,desc:"Hot, tasty noodles for your quick break.",tag:"QUICK BITE",image:"assets/maggi.svg"},
 {id:4,name:"Cold Coffee",category:"Beverages",price:40,desc:"Chilled coffee, creamy and refreshing.",tag:"STUDENT FAVOURITE",image:"assets/coffee.svg"},
 {id:5,name:"Veg Sandwich",category:"Snacks",price:45,desc:"Crisp toast with fresh garden veggies.",tag:"FRESH PICK",image:"assets/sandwich.svg"},
 {id:6,name:"French Fries",category:"Snacks",price:40,desc:"Crispy, salted fries made to share.",tag:"CRUNCH TIME",image:"assets/fries.svg"},
 {id:7,name:"Lemon Soda",category:"Beverages",price:25,desc:"A fizzy citrus refresher for sunny days.",tag:"COOL DOWN",image:"assets/soda.svg"},
 {id:8,name:"Veg Puff",category:"Snacks",price:25,desc:"Flaky pastry with a savoury veggie filling.",tag:"BAKERY PICK",image:"assets/puff.svg"}
];
const read = (key, fallback) => {try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}};
let cart = read("bb_cart",[]);
let orders = read("bb_orders",[]);
let tokenCounter = Number(localStorage.getItem("bb_token") || 34);
let wallet = Number(localStorage.getItem("bb_wallet") || 250);
let activeCategory = "All", currentItem = null, currentQty = 1, selectedSlot = "12:30 PM";
const money = n => "₹"+Number(n).toFixed(0);
const save = () => {localStorage.setItem("bb_cart",JSON.stringify(cart));localStorage.setItem("bb_orders",JSON.stringify(orders));localStorage.setItem("bb_token",tokenCounter);localStorage.setItem("bb_wallet",wallet)};
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function openModal(html){$("#modalContent").innerHTML=html;$("#modalBackdrop").hidden=false}
function closeModal(){$("#modalBackdrop").hidden=true}
$("#modalClose").onclick=closeModal;$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
function renderMenu(){
 const term=$("#searchInput").value.toLowerCase();
 const list=menuItems.filter(x=>(activeCategory==="All"||x.category===activeCategory)&&(x.name.toLowerCase().includes(term)||x.desc.toLowerCase().includes(term)));
 $("#menuGrid").innerHTML=list.length?list.map(x=>`<article class="food-card"><div class="food-visual"><span class="food-tag">${x.tag}</span><img src="${x.image}" alt="${x.name}" loading="lazy"></div><div class="food-info"><h3>${x.name}</h3><p>${x.desc}</p><div class="food-bottom"><span class="food-price">${money(x.price)}</span><button class="add-btn" data-add="${x.id}" aria-label="Customize ${x.name}">+</button></div></div></article>`).join(""):`<div class="empty-state">No items found. Try another search.</div>`;
}
$("#categoryRow").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));renderMenu()});
$("#searchInput").addEventListener("input",renderMenu);
$("#menuGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)customize(Number(b.dataset.add))});
function customize(id){
 currentItem=menuItems.find(x=>x.id===id);currentQty=1;
 openModal(`<div class="eyebrow">MAKE IT YOURS</div><h2>${currentItem.name}</h2><p class="modal-sub">${currentItem.desc}</p>
 <div class="form-row"><span>Size</span><select id="itemSize"><option value="0">Regular</option><option value="15">Large (+₹15)</option></select></div>
 ${currentItem.category==="Beverages"?`<div class="form-row"><span>Milk preference</span><select id="milkPref"><option>Regular milk</option><option>Oat milk</option><option>No milk</option></select></div>`:""}
 ${currentItem.name==="Maggi"?`<label class="check-row"><input type="checkbox" id="extraCheese"> Extra cheese (+₹15)</label>`:""}
 ${currentItem.name==="Cold Coffee"?`<label class="check-row"><input type="checkbox" id="extraIce"> Extra ice cream (+₹15)</label><label class="check-row"><input type="checkbox" id="lessSugar"> Less sugar (no extra charge)</label>`:""}
 ${currentItem.name==="Samosa"?`<label class="check-row"><input type="checkbox" id="extraChutney"> Extra chutney (free)</label>`:""}
 <div class="form-row"><span>Quantity</span><div class="qty-control"><button id="qtyMinus">−</button><b id="qtyValue">1</b><button id="qtyPlus">+</button></div></div>
 <div class="modal-total"><span>Total</span><span id="customTotal">${money(currentItem.price)}</span></div><button class="primary-btn wide-btn" id="addToCart">Add to order ↗</button>`);
 const total=()=>{let n=currentItem.price+Number($("#itemSize").value||0);["extraCheese","extraIce"].forEach(id=>{if($("#"+id)?.checked)n+=15});$("#customTotal").textContent=money(n*currentQty)};
 $("#qtyMinus").onclick=()=>{currentQty=Math.max(1,currentQty-1);$("#qtyValue").textContent=currentQty;total()};
 $("#qtyPlus").onclick=()=>{currentQty=Math.min(20,currentQty+1);$("#qtyValue").textContent=currentQty;total()};
 $("#itemSize").onchange=total;["extraCheese","extraIce"].forEach(id=>{if($("#"+id))$("#"+id).onchange=total});
 $("#addToCart").onclick=()=>{const opts=[];if($("#itemSize").value==="15")opts.push("Large");if($("#milkPref"))opts.push($("#milkPref").value);if($("#extraCheese")?.checked)opts.push("Extra cheese");if($("#extraIce")?.checked)opts.push("Extra ice cream");if($("#lessSugar")?.checked)opts.push("Less sugar");if($("#extraChutney")?.checked)opts.push("Extra chutney");let unit=currentItem.price+Number($("#itemSize").value||0)+(($("#extraCheese")?.checked||$("#extraIce")?.checked)?15:0);cart.push({id:Date.now(),itemId:currentItem.id,name:currentItem.name,qty:currentQty,unit,opts});save();updateCart();closeModal();toast(currentItem.name+" added to your order")};
}
function cartTotal(){return cart.reduce((s,x)=>s+x.unit*x.qty,0)}
function updateCart(){$("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);$("#walletHeader").textContent=money(wallet);save()}
$("#cartOpen").onclick=showCart;
function showCart(){
 openModal(`<div class="eyebrow">YOUR BREAK, YOUR ORDER</div><h2>Your order</h2><p class="modal-sub">Review your items before checkout.</p>
 <div id="cartLines">${cart.length?cart.map(x=>`<div class="cart-line"><div><b>${x.qty} × ${x.name}</b><small>${x.opts.join(" · ")||"Regular"}</small></div><div><b>${money(x.unit*x.qty)}</b><br><button data-remove="${x.id}">Remove</button></div></div>`).join(""):`<div class="empty-state">Your cart is empty. Add something delicious!</div>`}</div>
 <div class="modal-total"><span>Order total</span><span>${money(cartTotal())}</span></div><button class="primary-btn wide-btn" id="checkoutBtn" ${cart.length?"":"disabled"}>Continue to checkout ↗</button>`);
 $("#cartLines").onclick=e=>{const b=e.target.closest("[data-remove]");if(!b)return;cart=cart.filter(x=>x.id!==Number(b.dataset.remove));save();updateCart();showCart()};
 $("#checkoutBtn").onclick=checkout;
}
function checkout(){
 if(!cart.length)return;
 const total=cartTotal();
 openModal(`<div class="eyebrow">QUICK DIGITAL CHECKOUT</div><h2>One tap away.</h2><p class="modal-sub">Scan this demo QR or use the simulated payment button below. No real money will be transferred.</p><div class="qr-area"><div id="qrcode"></div><b>${money(total)}</b><p>BREWBOARD DEMO · UPI PAYMENT</p></div><div class="form-row"><span>Payment method</span><b>UPI QR · Demo</b></div><button class="primary-btn wide-btn" id="payNow">Pay now · ${money(total)} ↗</button>`);
 const qrText=`upi://pay?pa=brewboard@demo&pn=BrewBoard&am=${total}&cu=INR`;
 if(window.QRCode)new QRCode($("#qrcode"),{text:qrText,width:145,height:145,colorDark:"#172e24",colorLight:"#ffffff"});
 else $("#qrcode").textContent="Demo QR";
 $("#payNow").onclick=()=>{if(total>wallet){toast("Insufficient demo wallet balance");return}wallet-=total;tokenCounter++;const order={token:tokenCounter,items:cart.map(x=>({...x})),total,status:"Preparing",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),slot:selectedSlot};orders.unshift(order);cart=[];save();updateCart();showReceipt(order)};
}
function showReceipt(o){openModal(`<div class="center"><div class="success-mark">✓</div><div class="eyebrow">PAYMENT SIMULATED SUCCESSFULLY</div><h2>You're all set!</h2><p class="modal-sub">Your order is confirmed. Keep this token handy.</p><div class="token-number">#${o.token}</div><b>${money(o.total)} · ${o.status}</b><p class="modal-sub">Pickup slot: ${o.slot}<br>Show your token at the counter when ready.</p><button class="primary-btn wide-btn" id="receiptDone">Done</button><button class="text-btn" id="receiptBoard" style="margin-top:14px;width:100%">View pickup board →</button></div>`);$("#receiptDone").onclick=closeModal;$("#receiptBoard").onclick=showBoard}
function showBoard(){const preparing=orders.filter(o=>o.status==="Preparing"),ready=orders.filter(o=>o.status==="Ready");openModal(`<div class="eyebrow"><span class="live-dot"></span> LIVE CANTEEN SCREEN</div><h2>Pickup board</h2><p class="modal-sub">Keep an eye on your token. The kitchen updates this board as orders are prepared.</p><div class="board-columns"><div class="board-col"><h3>◷ Now preparing</h3>${preparing.length?preparing.map(o=>`<div class="token-chip"><strong>#${o.token}</strong><span>${o.time}</span></div>`).join(""):`<p class="modal-sub">All caught up!</p>`}</div><div class="board-col"><h3>✓ Ready for pickup</h3>${ready.length?ready.map(o=>`<div class="token-chip"><strong>#${o.token}</strong><span>Collect now</span></div>`).join(""):`<p class="modal-sub">Nothing ready yet.</p>`}</div></div><p class="modal-sub" style="margin-top:18px">This demo board refreshes when orders are updated on this device.</p>`)}
function staffConsole(){openModal(`<div class="eyebrow">BREWBOARD · STAFF VIEW</div><h2>Kitchen console</h2><p class="modal-sub">Advance orders from Preparing to Ready with one tap.</p><div id="staffOrders">${orders.length?orders.map(o=>`<div class="staff-order"><strong>Token #${o.token}</strong> · ${money(o.total)}<p>${o.items.map(x=>`${x.qty} × ${x.name}`).join(", ")}</p><span>Status: <b>${o.status}</b></span>${o.status==="Preparing"?`<br><button data-ready="${o.token}">Mark ready ✓</button>`:""}</div>`).join(""):`<div class="empty-state">No orders yet. Place a student demo order first.</div>`}</div><button class="text-btn" id="staffBoard">Open pickup display →</button>`);$("#staffOrders").onclick=e=>{const b=e.target.closest("[data-ready]");if(!b)return;const o=orders.find(x=>x.token===Number(b.dataset.ready));if(o){o.status="Ready";save();staffConsole();toast("Token #"+o.token+" is ready");if("speechSynthesis"in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(`Token ${o.token} is ready at the counter`))}}};$("#staffBoard").onclick=showBoard}
function walletModal(){openModal(`<div class="eyebrow">STUDENT ID WALLET</div><h2>Your campus wallet</h2><p class="modal-sub">A simulated prepaid balance for quick demo checkout.</p><div class="wallet-balance"><span>AVAILABLE BALANCE</span><strong>${money(wallet)}</strong></div><div class="form-row"><span>Add demo credit</span><select id="walletAdd"><option value="100">₹100</option><option value="200">₹200</option><option value="500">₹500</option></select></div><button class="primary-btn wide-btn" id="addCredit" style="margin-top:18px">Add demo balance +</button><p class="modal-sub" style="margin-top:14px">This wallet is for demonstration only and has no banking connection.</p>`);$("#addCredit").onclick=()=>{wallet+=Number($("#walletAdd").value);save();updateCart();walletModal();toast("Demo credit added")}}
function rushBooking(){openModal(`<div class="eyebrow">LUNCH RUSH SLOT</div><h2>Pick your pickup time.</h2><p class="modal-sub">Choose a convenient slot for your next break. This demo reserves a slot locally; place your order separately.</p><div class="slot-grid">${["12:00 PM","12:15 PM","12:30 PM","12:45 PM","1:00 PM","1:15 PM"].map(s=>`<button class="slot-btn ${s===selectedSlot?"selected":""}" data-slot="${s}">${s}</button>`).join("")}</div><button class="primary-btn wide-btn" id="saveSlot" style="margin-top:20px">Confirm pickup slot ↗</button>`);document.querySelectorAll("[data-slot]").forEach(b=>b.onclick=()=>{selectedSlot=b.dataset.slot;document.querySelectorAll("[data-slot]").forEach(x=>x.classList.toggle("selected",x===b))});$("#saveSlot").onclick=()=>{closeModal();toast("Pickup slot saved: "+selectedSlot)}}
$("#wallNav").onclick=showBoard;$("#heroWall").onclick=showBoard;$("#staffFooter").onclick=staffConsole;$("#walletOpen").onclick=walletModal;$("#rushBooking").onclick=rushBooking;
$("#menuToggle").onclick=()=>$(".main-nav").classList.toggle("open");
document.querySelectorAll(".main-nav a").forEach(a=>a.onclick=()=>$(".main-nav").classList.remove("open"));
renderMenu();updateCart();
