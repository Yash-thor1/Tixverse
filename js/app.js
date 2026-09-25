const events = [
  {id:1,title:"Neon Nights Festival",category:"Concerts",city:"Chennai",date:"Oct 18, 2026",time:"7:00 PM",venue:"ECR Arena",price:799,icon:"🎵",tag:"TRENDING"},
  {id:2,title:"Midnight Cinema",category:"Movies",city:"Bengaluru",date:"Oct 10, 2026",time:"9:30 PM",venue:"Skyline PVR",price:349,icon:"🎬",tag:"NEW"},
  {id:3,title:"Champions League Night",category:"Sports",city:"Chennai",date:"Oct 24, 2026",time:"6:30 PM",venue:"Marina Stadium",price:599,icon:"🏏",tag:"HOT"},
  {id:4,title:"Laugh Out Loud Live",category:"Shows",city:"Hyderabad",date:"Nov 02, 2026",time:"8:00 PM",venue:"Grand Convention Hall",price:449,icon:"🎭",tag:"POPULAR"},
  {id:5,title:"Indie Waves",category:"Concerts",city:"Mumbai",date:"Nov 08, 2026",time:"7:30 PM",venue:"Harbour Grounds",price:999,icon:"🎸",tag:"LIMITED"},
  {id:6,title:"The Final Chase",category:"Movies",city:"Chennai",date:"Oct 29, 2026",time:"6:45 PM",venue:"Cinepolis Express",price:299,icon:"🍿",tag:"JUST IN"},
  {id:7,title:"City Marathon 2026",category:"Sports",city:"Bengaluru",date:"Nov 15, 2026",time:"5:30 AM",venue:"Cubbon Park",price:499,icon:"🏃",tag:"ACTIVE"},
  {id:8,title:"Broadway Dreams",category:"Shows",city:"Mumbai",date:"Dec 05, 2026",time:"7:00 PM",venue:"Royal Theatre",price:1299,icon:"🎟️",tag:"FEATURED"},
  {id:9,title:"Electronic Horizon",category:"Concerts",city:"Hyderabad",date:"Nov 22, 2026",time:"8:30 PM",venue:"Pulse Grounds",price:899,icon:"🎧",tag:"TRENDING"}
];

let filteredEvents=[...events], selectedEvent=null, selectedSeats=[], favorites=JSON.parse(localStorage.getItem("tixverseFavorites")||"[]"), bookings=JSON.parse(localStorage.getItem("tixverseBookings")||"[]");

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function money(n){return "₹"+n.toLocaleString("en-IN")}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function openModal(id){$("#"+id).classList.add("show");document.body.style.overflow="hidden"}
function closeModal(id){$("#"+id).classList.remove("show");document.body.style.overflow=""}

function renderEvents(){
  const grid=$("#eventGrid");
  grid.innerHTML=filteredEvents.map(e=>`
    <article class="event-card">
      <div class="event-art ${e.category.toLowerCase().slice(0,-1)}">
        <span class="event-badge">${e.tag}</span>
        <button class="heart ${favorites.includes(e.id)?"active":""}" onclick="toggleFavorite(${e.id},event)">♥</button>
        <span class="event-icon">${e.icon}</span>
      </div>
      <div class="event-body">
        <h3>${e.title}</h3>
        <p>📍 ${e.city} · ${e.venue}</p>
        <p>📅 ${e.date} · ${e.time}</p>
        <div class="event-bottom">
          <div class="price"><small>Tickets from</small><strong>${money(e.price)}</strong></div>
          <button class="book-btn" onclick="openEvent(${e.id})">View event</button>
        </div>
      </div>
    </article>`).join("");
}

function openEvent(id){
  selectedEvent=events.find(e=>e.id===id);
  const e=selectedEvent;
  $("#eventDetails").innerHTML=`
    <div class="detail-hero ${e.category.toLowerCase().slice(0,-1)}"><span class="big-icon">${e.icon}</span></div>
    <div class="detail-info">
      <span class="section-kicker">${e.category.toUpperCase()}</span>
      <h2>${e.title}</h2>
      <p>Experience ${e.title} live in ${e.city}. Choose your seats and secure your place at TixVerse.</p>
      <div class="detail-grid">
        <div class="info-box"><small>DATE</small><strong>${e.date}</strong></div>
        <div class="info-box"><small>TIME</small><strong>${e.time}</strong></div>
        <div class="info-box"><small>VENUE</small><strong>${e.venue}</strong></div>
        <div class="info-box"><small>STARTING FROM</small><strong>${money(e.price)}</strong></div>
      </div>
      <button class="primary-btn modal-cta" onclick="startBooking()">Choose seats →</button>
    </div>`;
  openModal("eventModal");
}

function startBooking(){
  closeModal("eventModal"); selectedSeats=[]; renderBooking(); openModal("bookingModal");
}
function renderBooking(){
  const e=selectedEvent;
  const occupied=[3,8,14,21,29,35,43,52];
  let seats="";
  for(let i=1;i<=56;i++){
    if([7,15,23,31,39,47].includes(i)) seats+=`<span class="seat-gap"></span>`;
    const cls=occupied.includes(i)?"occupied":selectedSeats.includes(i)?"selected":"available";
    seats+=`<button class="seat ${cls}" ${cls==="occupied"?"disabled":`onclick="selectSeat(${i})"`}>${i}</button>`;
  }
  const total=e.price*selectedSeats.length;
  $("#bookingContent").innerHTML=`
    <div class="booking-layout">
      <div>
        <span class="section-kicker">SELECT YOUR SEATS</span>
        <h2 class="booking-title">${e.title}</h2><span class="muted">${e.date} · ${e.time}</span>
        <div class="screen"></div><div class="seat-grid">${seats}</div>
        <div class="seat-legend"><span><i></i>Available</span><span><i class="sel"></i>Selected</span><span><i class="occ"></i>Occupied</span></div>
      </div>
      <aside class="summary">
        <h3>Booking summary</h3>
        <p class="muted">${e.venue}, ${e.city}</p>
        <div class="summary-row"><span>Selected seats</span><strong>${selectedSeats.length?selectedSeats.join(", "):"None"}</strong></div>
        <div class="summary-row"><span>Ticket price</span><strong>${money(e.price)} × ${selectedSeats.length}</strong></div>
        <div class="summary-row"><span>Convenience fee</span><strong>${selectedSeats.length?money(Math.round(total*.05)):"₹0"}</strong></div>
        <div class="summary-total"><span>Total</span><span>${money(total+Math.round(total*.05))}</span></div>
        <button class="primary-btn full" onclick="confirmBooking()" ${selectedSeats.length?"":"disabled"}>Confirm booking</button>
      </aside>
    </div>`;
}
function selectSeat(n){
  selectedSeats=selectedSeats.includes(n)?selectedSeats.filter(x=>x!==n):[...selectedSeats,n];
  selectedSeats.sort((a,b)=>a-b);renderBooking();
}
function confirmBooking(){
  if(!selectedSeats.length)return;
  const e=selectedEvent,total=e.price*selectedSeats.length,fee=Math.round(total*.05);
  const booking={id:"TXV"+Math.floor(10000+Math.random()*90000),eventId:e.id,seats:[...selectedSeats],total:total+fee,date:e.date};
  bookings.unshift(booking);localStorage.setItem("tixverseBookings",JSON.stringify(bookings));
  closeModal("bookingModal");showToast("Booking confirmed! Your ticket is ready.");showTicket(booking);
}
function showTicket(b){
  const e=events.find(x=>x.id===b.eventId);
  $("#ticketsContent").innerHTML=`
    <span class="section-kicker">DIGITAL TICKET</span>
    <div class="ticket" style="margin-top:12px">
      <div class="ticket-top"><span class="muted">TIXVERSE · CONFIRMED</span><h2>${e.title}</h2><span>${e.city} · ${e.venue}</span></div>
      <div class="ticket-body">
        <div class="ticket-grid">
          <div><small>DATE</small><strong>${e.date}</strong></div><div><small>TIME</small><strong>${e.time}</strong></div>
          <div><small>SEATS</small><strong>${b.seats.join(", ")}</strong></div><div><small>TOTAL PAID</small><strong>${money(b.total)}</strong></div>
        </div>
        <div class="ticket-code">▦ ${b.id} ▦</div>
        <p class="muted">Show this booking ID at the venue entrance. This is a demo ticket; no real payment was processed.</p>
      </div>
    </div>`;
  openModal("ticketsModal");
}
function showTickets(){
  if(!bookings.length){
    $("#ticketsContent").innerHTML=`<div class="empty"><div style="font-size:48px">🎟️</div><h2>No tickets yet</h2><p>Book an event and your digital ticket will appear here.</p><button class="primary-btn" onclick="closeModal('ticketsModal');document.querySelector('#events').scrollIntoView()">Explore events</button></div>`;
  }else{
    $("#ticketsContent").innerHTML=`<span class="section-kicker">YOUR TICKETS</span><h2 style="font-family:'Space Grotesk';font-size:34px;margin:8px 0 20px">Booking history</h2>`+
    bookings.map(b=>{const e=events.find(x=>x.id===b.eventId);return `<div class="info-box" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:15px"><div><strong>${e.title}</strong><small>${e.date} · Seats ${b.seats.join(", ")} · ${b.id}</small></div><button class="book-btn" onclick='showTicket(${JSON.stringify(b)})'>View</button></div>`}).join("");
  }
  openModal("ticketsModal");
}
function toggleFavorite(id,ev){
  ev.stopPropagation();favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];localStorage.setItem("tixverseFavorites",JSON.stringify(favorites));renderEvents();showToast(favorites.includes(id)?"Added to favourites":"Removed from favourites");
}
function applyFilters(){
  const city=$("#cityFilter").value,sort=$("#sortFilter").value;
  filteredEvents=events.filter(e=>city==="All"||e.city===city);
  if(sort==="priceLow")filteredEvents.sort((a,b)=>a.price-b.price);
  if(sort==="priceHigh")filteredEvents.sort((a,b)=>b.price-a.price);
  renderEvents();
}
function search(q){
  q=q.trim().toLowerCase();
  filteredEvents=events.filter(e=>!q||`${e.title} ${e.category} ${e.city} ${e.venue}`.toLowerCase().includes(q));
  renderEvents();document.querySelector("#events").scrollIntoView({behavior:"smooth"});
}

$("#cityFilter").addEventListener("change",applyFilters);$("#sortFilter").addEventListener("change",applyFilters);
$("#heroSearchBtn").onclick=()=>search($("#heroSearch").value);
$("#heroSearch").addEventListener("keydown",e=>{if(e.key==="Enter")search(e.target.value)});
$$(".category-card").forEach(b=>b.onclick=()=>{filteredEvents=events.filter(e=>e.category===b.dataset.category);renderEvents();document.querySelector("#events").scrollIntoView({behavior:"smooth"})});
$("#exploreBtn").onclick=()=>document.querySelector("#events").scrollIntoView({behavior:"smooth"});
$("#myTicketsBtn").onclick=showTickets;$("#loginBtn").onclick=()=>openModal("authModal");
$("#authForm").onsubmit=e=>{e.preventDefault();closeModal("authModal");showToast("Signed in successfully (demo mode).")};
$("#themeToggle").onclick=()=>{document.body.classList.toggle("light");$("#themeToggle").textContent=document.body.classList.contains("light")?"☀":"☾"};
$("#menuBtn").onclick=()=>{const n=$("#mainNav");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="78px";n.style.left="0";n.style.right="0";n.style.padding="20px";n.style.background="var(--surface)";n.style.borderBottom="1px solid var(--line)";n.style.justifyContent="center"};
$$(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m.id)}));
renderEvents();
