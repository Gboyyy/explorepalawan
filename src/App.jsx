import { useEffect, useRef, useState } from "react";
import { Icon, Logo, WaveDivider, WikiPhoto } from "./Media.jsx";
import "./App.css";
import useWiki, { useWikiPhotos } from "./useWiki.js";

/* ---------- DATA (edit to customize) ---------- */
const BUSINESS = {
  name: "Palawan Paradise Tours",
  tagline: "Your Gateway to Paradise",
  phone: "0912-345-6789",
  whatsapp: "639123456789",
  email: "info@palawanparadisetours.com",
  address: "Puerto Princesa City, Palawan, Philippines",
  hours: "Monday–Saturday, 8:00 AM – 6:00 PM",
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
};

const NAV = [["home", "Home"], ["about", "About"], ["services", "Services"], ["packages", "Packages"], ["gallery", "Gallery"], ["destination", "Destinations"], ["guide", "Travel Guide"], ["contact", "Contact"]];

const STATS = [["calendar", "Since 2018", "Local experts"], ["shield", "DOT", "Accredited agency"], ["tag", "No hidden fees", "All-inclusive pricing"]];

const SERVICES = [
  { icon: "boat", name: "Island Hopping Tours", desc: "Hidden lagoons, untouched beaches and vibrant marine life across Palawan's top spots.", price: "From ₱2,500 / person" },
  { icon: "bed", name: "Accommodation Assistance", desc: "Beach resorts, boutique hotels and eco-lodges — search live rates on Booking.com.", price: "Custom quote" },
  { icon: "van", name: "Airport & Land Transfer", desc: "Clean, comfortable private or shared vans to and from Puerto Princesa Airport.", price: "From ₱500 / way" },
  { icon: "food", name: "Food & Cultural Experiences", desc: "Authentic Palawan cuisine, seafood feasts and community cultural immersion.", price: "From ₱800 / person" },
];

// `wiki` = Wikipedia article title used to fetch a licensed photo online.
const PACKAGES = [
  { id: "Underground River", wiki: "Puerto_Princesa_Underground_River", hue: 160, badge: "UNESCO Site", name: "Puerto Princesa Underground River", price: 2500, duration: "8–10 hours", target: "Families & first-timers", includes: ["Round-trip hotel transfer", "All entrance fees & permits", "Boat ride & licensed guide", "Buffet lunch & bottled water"], excludes: "Personal expenses & optional side trips", itinerary: ["7:00 AM pickup", "Sabang Wharf", "Underground River", "Lunch", "Return to city"] },
  { id: "El Nido Tour A", wiki: "El_Nido,_Palawan", hue: 195, badge: "Best Seller", name: "El Nido Lagoons & Islands", price: 3200, duration: "Full day", target: "Couples & adventurers", includes: ["Big & Small Lagoon", "Secret Lagoon & Shimizu Island", "Boat, guide & life vests", "Seafood lunch & snacks"], excludes: "Accommodation & El Nido environmental fee", itinerary: ["9:00 AM departure", "4 island stops", "Seafood lunch", "5:00 PM return"] },
  { id: "City & Firefly", wiki: "Puerto_Princesa", hue: 30, badge: "Budget Friendly", name: "City Tour & Firefly Watching", price: 1500, duration: "4–6 hours", target: "Groups & budget travelers", includes: ["Iwahig firefly watching", "Baker's Hill & Mitra's Ranch", "Cathedral & Plaza Cuartel", "Van transfer & guide"], excludes: "Food, drinks & personal purchases", itinerary: ["Afternoon city tour", "Sunset", "Firefly boat tour", "Return"] },
  { id: "Honda Bay", wiki: "Honda_Bay", hue: 175, badge: "Island Escape", name: "Honda Bay Island Hopping", price: 2200, duration: "Full day", target: "Families & beach lovers", includes: ["Round-trip hotel transfer", "Island-hopping boat & guide", "Life vests & entrance fees", "Picnic lunch & bottled water"], excludes: "Snorkeling gear rental & personal expenses", itinerary: ["8:00 AM hotel pickup", "Honda Bay wharf", "Island stops & snorkeling", "Picnic lunch", "4:00 PM return"] },
];

const DESTINATIONS = [
  { wiki: "Puerto_Princesa_Underground_River", hue: 160, name: "Underground River", tag: "Nature", time: "1.5 hrs from the city", map: "Puerto Princesa Underground River, Palawan", blurb: "A river that flows through a cave straight into the sea." },
  { wiki: "El_Nido,_Palawan", hue: 195, name: "El Nido", tag: "Islands", time: "5 hrs by van • 1 hr by air", map: "El Nido, Palawan", blurb: "Limestone cliffs, hidden lagoons and white-sand beaches." },
  { wiki: "Coron,_Palawan", hue: 210, name: "Coron", tag: "Diving", time: "Fast ferry or flight", map: "Coron, Palawan", blurb: "Crystal lakes and world-famous WWII shipwreck dives." },
  { wiki: "Honda_Bay", hue: 175, name: "Honda Bay", tag: "Island hopping", time: "30 mins from the city", map: "Honda Bay, Puerto Princesa", blurb: "Sandbars, snorkeling spots and easy day-trip islands." },
];

const GALLERY = [
  ["Palawan", "Palawan Island"], ["Tubbataha_Reefs_Natural_Park", "Tubbataha Reefs"], ["Calauit_Safari_Park", "Calauit Safari Park"], ["Port_Barton", "Port Barton"],
  ["San_Vicente,_Palawan", "San Vicente"], ["Busuanga,_Palawan", "Busuanga Island"], ["Honda_Bay", "Honda Bay"], ["Puerto_Princesa", "Puerto Princesa City"],
];

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const nextDay = (value) => {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const stayUrl = ({ place, checkin, checkout, adults }) => {
  const params = new URLSearchParams({ ss: place.trim(), checkin, checkout, group_adults: String(adults), group_children: "0", no_rooms: "1" });
  return `https://www.booking.com/searchresults.html?${params}`;
};
const GUIDE = [
  ["sun", "Best Time to Visit", ["Dry season (Nov–May): sunny, calm seas — ideal for island hopping.", "Wet season (Jun–Oct): fewer crowds, greener scenery, occasional rain."]],
  ["bag", "What to Bring", ["Reef-safe sunscreen & hat", "Reusable water bottle", "Quick-dry clothes", "Waterproof bag"]],
  ["shirt", "Dress & Etiquette", ["Dress modestly in churches and rural areas.", "Ask before photographing locals.", "Bargain at markets only."]],
  ["shield", "Safety Reminders", ["Wear life vests on boats", "Follow your guide", "Stay hydrated", "Keep valuables secure"]],
  ["wallet", "Estimated Budget", ["Budget: ₱1,500–2,500/day", "Mid-range: ₱3,500–6,000/day", "Luxury: ₱8,000+/day"]],
  ["leaf", "Environmental Rules", ["Do not take corals, shells or sand.", "Do not feed marine life.", "Take only photos, leave only footprints."]],
  ["access", "Accessibility", ["Some areas have limited access due to terrain. Contact us in advance so we can assist."]],
  ["sos", "Emergency Info", ["Emergency hotline: 911", "Tourism Office: (048) 433-2963", "Coast Guard: (048) 433-4853"]],
];

const REVIEWS = [
  { name: "Maria S.", from: "Manila", text: "The Underground River tour was smooth from pickup to drop-off. Our guide was funny and very knowledgeable!", stars: 5 },
  { name: "James T.", from: "Cebu", text: "El Nido Tour A was worth every peso. The lagoons are unreal and lunch was delicious.", stars: 5 },
  { name: "Aiko & Ren", from: "Quezon City", text: "The firefly tour was magical. Booking was easy and the team replied within the hour.", stars: 4 },
];

const FAQS = [
  ["How do I book a tour?", "Use the booking form to search accommodation on Booking.com. For tour reservations, message us on WhatsApp."],
  ["Is lunch included?", "Check each featured package's inclusions for meal details."],
  ["What if the weather is bad?", "Tours may be rescheduled for safety when the Coast Guard or operators advise it. We will help you pick a new date."],
  ["Do you help with hotels?", "Yes. Use the Booking.com search on this site, or ask us for a curated recommendation."],
];

const peso = (n) => "₱" + n.toLocaleString("en-PH");

/* ---------- SMALL COMPONENTS ---------- */
function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div className="section-title">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function GalleryTile({ wiki, cap, onOpen }) {
  const data = useWiki(wiki, 3);
  return (
    <figure className="tile" tabIndex={0} onClick={() => onOpen([wiki, cap])} onKeyDown={(e) => e.key === "Enter" && onOpen([wiki, cap])}>
      <WikiPhoto title={wiki} photoIndex={3} alt={cap} width={500} />
      <figcaption>
        <strong>{cap}</strong>
        {data?.page && <a href={data.page} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{data.credit || "Photo: Wikipedia"}</a>}
      </figcaption>
    </figure>
  );
}

function DetailsDialog({ item, onClose, onBook }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; dialog.close(); };
  }, []);
  const photos = useWikiPhotos(item.wiki);
  return <dialog ref={ref} className="details-dialog" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="details-title">
    <div className="details-content">
      <button className="btn small outline close-details" onClick={onClose} autoFocus aria-label="Close details">Close ?</button>
      <h2 id="details-title">{item.name}</h2>
      <div className="detail-photos">
        {photos === null ? <p aria-live="polite">Loading destination photos?</p> : photos.length ? photos.map((photo, i) => <figure key={photo.src}><img src={photo.src} alt={`${item.name} ? ${photo.caption || `view ${i + 1}`}`} loading="lazy" /><figcaption>{photo.caption || item.name} ? <a href={photo.page} target="_blank" rel="noreferrer">Photo source & license</a></figcaption></figure>) : <p>Photos are unavailable right now. <a href={`https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=${encodeURIComponent(item.name + " Palawan")}`} target="_blank" rel="noreferrer">Browse destination photos on Wikimedia Commons</a>.</p>}
      </div>
      {item.includes ? <>
        <p className="price">{peso(item.price)} per person</p><p>{item.duration} ? {item.target}</p>
        <h3>Inclusions</h3><ul>{item.includes.map((text) => <li key={text}>{text}</li>)}</ul>
        <p><strong>Exclusions:</strong> {item.excludes}</p>
        <h3>Full itinerary</h3><ol>{item.itinerary.map((text) => <li key={text}>{text}</li>)}</ol>
        <p className="muted">Sample tour pricing. Booking.com searches accommodation in this destination; contact us to reserve the tour.</p>
      </> : <><p>{item.blurb}</p><p><strong>Travel:</strong> {item.time}</p><p><strong>Experience:</strong> {item.tag}</p></>}
      <button className="btn" onClick={() => onBook(item)}>Find a stay in this destination</button>
    </div>
  </dialog>;
}

/* ---------- APP ---------- */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [spot, setSpot] = useState("Puerto Princesa City, Palawan");
  const [openFaq, setOpenFaq] = useState(0);
  const [details, setDetails] = useState(null);
  const [stay, setStay] = useState({ place: "El Nido, Palawan, Philippines", checkin: "", checkout: "", adults: 2 });
  const changeStay = (key) => (e) => setStay((current) => {
    const value = e.target.value;
    return { ...current, [key]: value, ...(key === "checkin" && current.checkout <= value ? { checkout: "" } : {}) };
  });
  const submitBooking = (e) => {
    e.preventDefault();
    window.location.assign(stayUrl(stay));
  };
  const selectDestination = (item) => {
    const place = item.wiki === "El_Nido,_Palawan" ? "El Nido" : item.wiki === "Coron,_Palawan" ? "Coron" : "Puerto Princesa";
    setStay((current) => ({ ...current, place: `${place}, Palawan, Philippines` }));
    setDetails(null);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };
  const bookingFields = <>
    <label>Destination *<input required value={stay.place} onChange={changeStay("place")} placeholder="Enter a destination or hotel" maxLength={200} pattern={".*\\S.*"} /></label>
    <label>Check-in *<input required type="date" min={today()} value={stay.checkin} onChange={changeStay("checkin")} /></label>
    <label>Check-out *<input required type="date" min={stay.checkin ? nextDay(stay.checkin) : nextDay(today())} value={stay.checkout} onChange={changeStay("checkout")} /></label>
    <label>Adults *<input required type="number" min="1" max="30" value={stay.adults} onChange={changeStay("adults")} /></label>
  </>;

  const showOnMap = (q) => { setSpot(q); document.getElementById("map")?.scrollIntoView({ behavior: "smooth", block: "center" }); };

  return (
    <>
      {/* NAV */}
      <header className="nav">
        <a href="#home" className="brand"><Logo /> <span>{BUSINESS.name}</span></a>
        <button className="burger" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"><path d={menuOpen ? "M5 5l14 14M19 5L5 19" : "M4 7h16M4 12h16M4 17h16"} /></svg>
        </button>
        <nav className={menuOpen ? "open" : ""}>
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a href="#booking" className="nav-cta" onClick={() => setMenuOpen(false)}>Book Now</a>
        </nav>
      </header>

      {/* HOME */}
      <section id="home" className="hero">
        <div className="hero-bg"><WikiPhoto title="El_Nido,_Palawan" alt="El Nido, Palawan" width={1280} hue={195} /></div>
        <div className="hero-overlay" />
        <div className="hero-inner">
          <p className="eyebrow"><Icon name="pin" size={16} /> Puerto Princesa • El Nido • Coron</p>
          <h1>Discover the True Beauty of Palawan</h1>
          <p className="lead">World-famous lagoons, pristine white beaches and crystal-clear waters — your dream island adventure starts here.</p>
          <div className="cta-row">
            <a className="btn" href="#packages"><Icon name="compass" size={18} /> Plan Your Trip</a>
            <a className="btn ghost" href="#about">Learn More</a>
            <a className="btn ghost" href="#contact">Contact Us</a>
          </div>
          <div className="stats">
            {STATS.map(([ic, big, small]) => (
              <div className="stat" key={big}><Icon name={ic} size={22} /><div><strong>{big}</strong><span>{small}</span></div></div>
            ))}
          </div>
        </div>
        <WaveDivider />
      </section>

      <div className="promo"><Icon name="gift" size={20} /> Early-bird promo: <strong>10% off</strong> any package booked 30 days ahead — use code <strong>PALAWAN10</strong></div>

      <main>
        {/* ABOUT */}
        <section id="about" className="section">
          <SectionTitle eyebrow="About Us" title="Who We Are" sub="A local Puerto Princesa team sharing the Last Frontier with genuine Filipino hospitality." />
          <div className="grid three">
            <article className="card info"><span className="icon-badge"><Icon name="palm" /></span><h3>Our Story</h3><p>Palawan Paradise Tours is a local travel agency based in Puerto Princesa City. Since 2018, we have showcased our islands with passion, care and genuine hospitality.</p></article>
            <article className="card info"><span className="icon-badge"><Icon name="compass" /></span><h3>Mission & Vision</h3><p><strong>Mission:</strong> safe, memorable and affordable travel — every guest treated like family.</p><p><strong>Vision:</strong> the most trusted tour service in Palawan, known for integrity and responsible tourism.</p></article>
            <article className="card info"><span className="icon-badge"><Icon name="shield" /></span><h3>Why Choose Us</h3><p>DOT-accredited, transparent pricing with no hidden fees, trained local guides and personalized service that puts your safety first.</p></article>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="section alt">
          <SectionTitle eyebrow="What We Offer" title="Our Tourism Services" />
          <div className="grid four">
            {SERVICES.map((s) => (
              <article className="card service" key={s.name}>
                <span className="icon-badge lg"><Icon name={s.icon} size={30} /></span>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <div className="card-foot"><span className="price">{s.price}</span><a className="btn small" href="#booking">Inquire</a></div>
              </article>
            ))}
          </div>
        </section>

        {/* PACKAGES */}
        <section id="packages" className="section">
          <SectionTitle eyebrow="Tour Packages" title="Featured Tour Packages" sub="Prices are per person. Book 30 days ahead for the early-bird discount." />
          <div className="grid four">
            {PACKAGES.map((p) => (
              <article className="card package clickable-card" key={p.id} onClick={() => setDetails(p)}>
                <div className="media">
                  <WikiPhoto photoIndex={1} title={p.wiki} alt={p.name} hue={p.hue} />
                  <span className="ribbon">{p.badge}</span>
                  <span className="price-pill">{peso(p.price)}<small>/pax</small></span>
                </div>
                <div className="body">
                  <h3>{p.name}</h3>
                  <div className="meta">
                    <span><Icon name="clock" size={16} /> {p.duration}</span>
                    <span><Icon name="users" size={16} /> {p.target}</span>
                  </div>
                  <h4>Inclusions</h4>
                  <ul className="checks">{p.includes.map((i) => <li key={i}><Icon name="check" size={16} />{i}</li>)}</ul>
                  <p className="muted"><strong>Excludes:</strong> {p.excludes}</p>
                  <h4>Itinerary</h4>
                  <ol className="steps">{p.itinerary.map((s) => <li key={s}>{s}</li>)}</ol>
                  <button className="btn block" onClick={(e) => { e.stopPropagation(); setDetails(p); }}>View Full Details</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="section alt">
          <SectionTitle eyebrow="Gallery" title="Palawan Gallery" sub="Tap a photo to enlarge. Photos are loaded online from Wikipedia / Wikimedia Commons." />
          <div className="gallery">
            {GALLERY.map(([wiki, cap]) => <GalleryTile key={wiki} wiki={wiki} cap={cap} onOpen={setLightbox} />)}
          </div>
          <p className="muted center">Each photo links to its Wikimedia source, where the author and license are listed.</p>
        </section>
        {lightbox && (
          <div className="lightbox" onClick={() => setLightbox(null)} role="dialog" aria-label="Enlarged photo">
            <figure><WikiPhoto photoIndex={3} title={lightbox[0]} alt={lightbox[1]} width={960} /><figcaption>{lightbox[1]} — tap anywhere to close</figcaption></figure>
          </div>
        )}

        {/* DESTINATIONS */}
        <section id="destination" className="section">
          <SectionTitle eyebrow="Destination Guide" title="Explore Palawan" sub="Click a destination to explore photos and details, or see it on the map." />
          <div className="grid four">
            {DESTINATIONS.map((d) => (
              <article className="card dest clickable-card" key={d.name} onClick={() => setDetails(d)}>
                <div className="media short"><WikiPhoto photoIndex={2} title={d.wiki} alt={d.name} hue={d.hue} /><span className="ribbon">{d.tag}</span></div>
                <div className="body">
                  <h3>{d.name}</h3>
                  <p>{d.blurb}</p>
                  <p className="meta"><span><Icon name="plane" size={16} /> {d.time}</span></p>
                  <button className="btn small" onClick={(e) => { e.stopPropagation(); setDetails(d); }}>Photos & Details</button>
                  <button className="btn small outline" onClick={(e) => { e.stopPropagation(); showOnMap(d.map); }}><Icon name="pin" size={16} /> Show on map</button>
                </div>
              </article>
            ))}
          </div>

          <div className="two-col" id="map">
            <div className="card map-card">
              <iframe className="map" title={`Google Map: ${spot}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(spot)}&output=embed`} />
              <a className="btn small" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(spot)}`}><Icon name="map" size={16} /> Get Directions</a>
            </div>
            <div className="card getting">
              <h3><Icon name="plane" /> How to Get There</h3>
              <ul className="checks">
                <li><Icon name="check" size={16} /><span><strong>By air:</strong> Puerto Princesa Airport (PPS) from Manila (~1.5 hrs), Cebu, Clark or Iloilo.</span></li>
                <li><Icon name="check" size={16} /><span><strong>By sea:</strong> Ferries from Manila or Coron — longer but scenic.</span></li>
                <li><Icon name="check" size={16} /><span><strong>From the airport:</strong> 20–30 mins by van or tricycle to the city center.</span></li>
              </ul>
              <h3><Icon name="bed" /> Stay & Dine</h3>
              <p>Budget ₱500–1,000 • Mid-range ₱2,000–5,000 • Luxury ₱8,000+ per night. Try Kinabucho's, Ka Lui's and Badjao Seafront for fresh seafood.</p>
            </div>
          </div>

          {/* BOOKING.COM */}
          <div className="card stay">
            <div className="stay-head"><span className="icon-badge light"><Icon name="bed" /></span><div><h3>Find Your Stay on Booking.com</h3><p>Enter your destination and dates to continue to Booking.com.</p></div></div>
            <form className="stay-form" onSubmit={submitBooking}>
              {bookingFields}
              <button className="btn" type="submit"><Icon name="search" size={18} /> Search Booking.com</button>
            </form>
          </div>
        </section>

        {/* TRAVEL GUIDE */}
        <section id="guide" className="section alt">
          <SectionTitle eyebrow="Travel Information" title="Traveler's Guide" />
          <div className="grid four">
            {GUIDE.map(([icon, title, items]) => (
              <article className="card guide" key={title}>
                <span className="icon-badge"><Icon name={icon} /></span>
                <h3>{title}</h3>
                <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section className="section">
          <SectionTitle eyebrow="Testimonials" title="What Travelers Say" sub="Sample reviews for academic demonstration." />
          <div className="grid three">
            {REVIEWS.map((r) => (
              <blockquote className="card review" key={r.name}>
                <Icon name="quote" size={28} className="quote" />
                <p>{r.text}</p>
                <div className="stars" aria-label={`${r.stars} out of 5 stars`}>{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={18} fill={i < r.stars ? "currentColor" : "none"} />)}</div>
                <footer><span className="avatar">{r.name[0]}</span>{r.name} • {r.from}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section alt">
          <SectionTitle eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="faq">
            {FAQS.map(([q, a], i) => (
              <div key={q} className={"faq-item" + (openFaq === i ? " open" : "")}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>{q}<Icon name={openFaq === i ? "minus" : "plus"} size={20} /></button>
                {openFaq === i && <p>{a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* BOOKING FORM */}
        <section id="booking" className="section">
          <SectionTitle eyebrow="Book Now" title="Find Your Stay" sub="Your destination, dates and travelers are carried over to Booking.com. Complete your accommodation reservation there." />
          <form className="card form" onSubmit={submitBooking}>
            {bookingFields}
            <p className="muted full">This searches accommodation. For featured tour reservations and special requests, <a href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer">contact our team</a>.</p>
            <button className="btn full" type="submit"><Icon name="search" size={18} /> Continue to Booking.com</button>
          </form>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section alt">
          <SectionTitle eyebrow="Contact Us" title="Let's Plan Your Adventure" />
          <div className="grid three">
            <article className="card info"><span className="icon-badge"><Icon name="pin" /></span><h3>Visit Our Office</h3><p>{BUSINESS.address}</p><p className="meta"><span><Icon name="clock" size={16} /> {BUSINESS.hours}</span></p></article>
            <article className="card info"><span className="icon-badge"><Icon name="phone" /></span><h3>Call or Email</h3><p>{BUSINESS.phone}</p><p><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></p></article>
            <article className="card info"><span className="icon-badge"><Icon name="chat" /></span><h3>Message Us</h3>
              <p><a className="btn small" target="_blank" rel="noreferrer" href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent("Hi! I'd like to ask about a Palawan tour.")}`}>Chat on WhatsApp</a></p>
              <div className="socials">
                <a href={BUSINESS.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Icon name="facebook" /></a>
                <a href={BUSINESS.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Icon name="instagram" /></a>
                <a href={BUSINESS.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><Icon name="tiktok" /></a>
              </div>
            </article>
          </div>
          <p className="muted center">Contact details are fictional and for academic purposes.</p>
        </section>
      </main>

      {details && <DetailsDialog item={details} onClose={() => setDetails(null)} onBook={selectDestination} />}

      {/* FOOTER */}
      <footer className="footer">
        <p className="brand"><Logo size={30} /> {BUSINESS.name} — {BUSINESS.tagline}</p>
        <p className="links">{["home", "about", "packages", "gallery", "destination", "contact"].map((id) => <a key={id} href={`#${id}`}>{NAV.find(([n]) => n === id)[1]}</a>)}</p>
        <p>{BUSINESS.phone} • {BUSINESS.email}</p>
        <p className="muted">© 2026 {BUSINESS.name}. All rights reserved. This website is an academic project; businesses, prices and reviews are for demonstration only. Photos via Wikipedia / Wikimedia Commons, maps by Google Maps, hotel search by Booking.com.</p>
      </footer>

      <a className="fab" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" href={`https://wa.me/${BUSINESS.whatsapp}`}><Icon name="chat" size={26} /></a>
    </>
  );
}
