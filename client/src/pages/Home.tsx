import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

type Product = {
  id: number;
  name: string;
  category: string;
  fit: string;
  price: number;
  compareAt: number;
  rating: number;
  reviews: number;
  colors: { name: string; hex: string }[];
  image: string;
  hoverImage: string;
  tag?: string;
  description: string;
};

type CartLine = Product & { selectedColor: string; selectedSize: string; quantity: number };

const products: Product[] = [
  {
    id: 1,
    name: "Studio Logo Tee",
    category: "Minimal",
    fit: "Regular fit",
    price: 999,
    compareAt: 1499,
    rating: 4.9,
    reviews: 124,
    colors: [
      { name: "Carbon", hex: "#222523" },
      { name: "Bone", hex: "#e6dfd1" },
      { name: "Moss", hex: "#445442" },
    ],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=88",
    hoverImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=88",
    tag: "Bestseller",
    description: "A clean, everyday uniform cut from 240 GSM combed cotton with a quiet studio mark at the chest.",
  },
  {
    id: 2,
    name: "After Hours Graphic",
    category: "Graphic",
    fit: "Relaxed fit",
    price: 1199,
    compareAt: 1699,
    rating: 4.8,
    reviews: 98,
    colors: [
      { name: "Washed Bone", hex: "#d9d1c0" },
      { name: "Ink", hex: "#1c2020" },
    ],
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=88",
    hoverImage: "https://images.unsplash.com/photo-1618354691551-44de113f0164?auto=format&fit=crop&w=1000&q=88",
    tag: "New drop",
    description: "A considered back print inspired by late-night city light, finished with a soft garment wash.",
  },
  {
    id: 3,
    name: "Moss Heavyweight",
    category: "Oversized",
    fit: "Oversized fit",
    price: 1299,
    compareAt: 1799,
    rating: 4.9,
    reviews: 76,
    colors: [
      { name: "Moss", hex: "#475545" },
      { name: "Charcoal", hex: "#323735" },
      { name: "Bone", hex: "#ded8ca" },
    ],
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=88",
    hoverImage: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1000&q=88",
    tag: "240 GSM",
    description: "A relaxed, architectural silhouette with dropped shoulders and a dense ribbed collar that holds its shape.",
  },
  {
    id: 4,
    name: "Clay Panel Tee",
    category: "Minimal",
    fit: "Relaxed fit",
    price: 1099,
    compareAt: 1499,
    rating: 4.7,
    reviews: 112,
    colors: [
      { name: "Clay", hex: "#8d7560" },
      { name: "Ash", hex: "#8d8e86" },
      { name: "Ink", hex: "#242726" },
    ],
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=88",
    hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=88",
    tag: "Low stock",
    description: "A tonal panel detail gives this everyday tee a subtle point of difference without making it loud.",
  },
  {
    id: 5,
    name: "Linework Stripe",
    category: "Basic",
    fit: "Regular fit",
    price: 1099,
    compareAt: 1599,
    rating: 4.6,
    reviews: 61,
    colors: [
      { name: "Stone", hex: "#c0b8a7" },
      { name: "Forest", hex: "#35473c" },
    ],
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=88",
    hoverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=88",
    description: "Soft lines, measured contrast, and a breezy cotton blend for the days that start slow.",
  },
  {
    id: 6,
    name: "Harbour Polo",
    category: "Polo",
    fit: "Regular fit",
    price: 1399,
    compareAt: 1899,
    rating: 4.8,
    reviews: 47,
    colors: [
      { name: "Midnight", hex: "#233447" },
      { name: "Ecru", hex: "#d8cfbe" },
      { name: "Moss", hex: "#415043" },
    ],
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=88",
    hoverImage: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=88",
    tag: "Easy care",
    description: "A clean pique polo with a soft collar and tonal embroidery, ready for everything after work.",
  },
];

const styleCards = [
  { name: "Solid", note: "Timeless & versatile", image: products[0].image },
  { name: "Graphic", note: "Make a statement", image: products[1].image },
  { name: "Oversized", note: "Relaxed & bold", image: products[2].image },
  { name: "Minimal", note: "Less is more", image: products[3].image },
  { name: "Polo", note: "Smart casual", image: products[5].image },
  { name: "Basic", note: "Everyday essential", image: products[4].image },
];

const reviews = [
  { name: "Aarav S.", initials: "AS", copy: "The quality is insane. Soft, breathable and fits perfectly. Will definitely shop again.", rating: 5 },
  { name: "Rohan M.", initials: "RM", copy: "Simple designs but so stylish. Finally found a brand that gets my vibe.", rating: 5 },
  { name: "Siddharth K.", initials: "SK", copy: "Fast delivery and amazing quality. The fabric feels premium. Highly recommended.", rating: 5 },
];

const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const filteredProducts = useMemo(() => {
    let output = products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const haystack = `${product.name} ${product.category} ${product.fit}`.toLowerCase();
      return matchesCategory && haystack.includes(search.toLowerCase());
    });
    if (sort === "price-low") output = [...output].sort((a, b) => a.price - b.price);
    if (sort === "price-high") output = [...output].sort((a, b) => b.price - a.price);
    if (sort === "rating") output = [...output].sort((a, b) => b.rating - a.rating);
    return output;
  }, [activeCategory, search, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = cartOpen || accountOpen || selectedProduct !== null || mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, accountOpen, selectedProduct, mobileNavOpen]);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0].name);
    setSelectedSize("M");
    setQuantity(1);
  };

  const addToCart = (product: Product, color = product.colors[0].name, size = "M", qty = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id && item.selectedColor === color && item.selectedSize === size);
      if (existing) return current.map((item) => item === existing ? { ...item, quantity: item.quantity + qty } : item);
      return [...current, { ...product, selectedColor: color, selectedSize: size, quantity: qty }];
    });
    toast.success(`${product.name} added to your bag`, { description: `${color} / Size ${size}` });
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id]);
    toast(wishlist.includes(product.id) ? "Removed from wishlist" : "Saved to wishlist", { icon: wishlist.includes(product.id) ? <X size={14} /> : <Heart size={14} /> });
  };

  const scrollTo = (id: string) => {
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="veltra-app">
      <div className="announcement"><span>Complimentary shipping on orders over ₹1,999</span><span className="announcement-dot" /><span>Easy 7-day returns</span></div>
      <header className="site-header">
        <button className="mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
        <button className="wordmark" onClick={() => scrollTo("top")} aria-label="Veltra Studio home">VELTRA<span>STUDIO</span></button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button className="nav-active" onClick={() => scrollTo("top")}>Home</button>
          <button onClick={() => scrollTo("shop")}>Shop</button>
          <button onClick={() => scrollTo("styles")}>Collections</button>
          <button onClick={() => scrollTo("story")}>Our story</button>
        </nav>
        <div className="header-actions">
          <button onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={19} strokeWidth={1.7} /></button>
          <button onClick={() => setAccountOpen(true)} aria-label="Account"><CircleUserRound size={19} strokeWidth={1.7} /></button>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label="Shopping bag"><ShoppingBag size={19} strokeWidth={1.7} />{cartCount > 0 && <span>{cartCount}</span>}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" />The everyday edit · 02/26</div>
            <h1>Quiet pieces.<br /><em>Clear point of view.</em></h1>
            <p>Premium essentials with room to breathe. Cut from better cotton, designed for the rhythm of real life.</p>
            <div className="hero-actions"><button className="copper-button" onClick={() => scrollTo("shop")}>Shop new arrivals <ArrowDownRight size={17} /></button><button className="text-button" onClick={() => scrollTo("story")}>Discover our fabric <ArrowRight size={16} /></button></div>
            <div className="hero-benefits"><span><Check size={14} /> 240 GSM cotton</span><span><Check size={14} /> Thoughtful fits</span><span><Check size={14} /> Built to last</span></div>
          </div>
          <div className="hero-image-wrap">
            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=90" alt="Model wearing a premium neutral T-shirt" />
            <div className="hero-image-overlay" />
            <div className="hero-note hero-note-top">For slower<br /><span>mornings.</span></div>
            <div className="hero-product-note"><span>01 / 03</span><strong>Oversized essential</strong><small>From ₹999</small></div>
          </div>
        </section>

        <section className="marquee"><div>Made for everyday rituals <span>✦</span> Better fabric, better days <span>✦</span> Made for everyday rituals <span>✦</span> Better fabric, better days <span>✦</span></div></section>

        <section className="section bone-section" id="styles">
          <div className="section-heading"><div><span className="eyebrow dark">Shop by style</span><h2>Find your <em>vibe.</em></h2></div><button className="inline-link dark-link" onClick={() => scrollTo("shop")}>View all styles <ArrowRight size={16} /></button></div>
          <div className="style-grid">{styleCards.map((style) => <button className="style-card" key={style.name} onClick={() => { setActiveCategory(style.name === "Solid" ? "All" : style.name); scrollTo("shop"); }}><div className="style-image"><img src={style.image} alt={style.name} /><span><ArrowUpRightIcon /></span></div><div className="style-meta"><strong>{style.name}</strong><small>{style.note}</small></div></button>)}</div>
        </section>

        <section className="section shop-section" id="shop">
          <div className="section-heading shop-heading"><div><span className="eyebrow">Curated for the season</span><h2>New <em>favourites.</em></h2></div><div className="shop-tools"><button className="filter-trigger" onClick={() => setSearchOpen(true)}><Search size={15} /> Search pieces</button><label className="sort-select">Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="rating">Top rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><ChevronDown size={14} /></label></div></div>
          <div className="category-tabs" role="tablist">{["All", "Minimal", "Graphic", "Oversized", "Polo", "Basic"].map((category) => <button key={category} className={activeCategory === category ? "selected" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
          <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} isWishlisted={wishlist.includes(product.id)} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} onWishlist={() => toggleWishlist(product)} />)}</div>
          {filteredProducts.length === 0 && <div className="empty-products"><Sparkles size={20} /><p>No pieces match that edit yet.</p><button onClick={() => { setActiveCategory("All"); setSearch(""); }}>Reset filters</button></div>}
        </section>

        <section className="campaign-section" id="story"><div className="campaign-image"><img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1600&q=88" alt="Close up of heavyweight cotton texture" /></div><div className="campaign-copy"><span className="eyebrow">The fabric study · 01</span><h2>Weight you<br /><em>can feel.</em></h2><p>We start with 240 GSM combed cotton — dense enough to hold its shape, soft enough to disappear into your day. No shortcuts. No noisy logos. Just better basics, made slowly.</p><button className="outline-button" onClick={() => toast("Fabric guide coming soon", { description: "We're preparing a closer look at every Veltra material." })}>Read the fabric guide <ArrowRight size={16} /></button><div className="fabric-specs"><div><strong>240</strong><span>GSM cotton</span></div><div><strong>03</strong><span>core fits</span></div><div><strong>07</strong><span>day returns</span></div></div></div></section>

        <section className="section reviews-section"><div className="section-heading"><div><span className="eyebrow">What our customers say</span><h2>Real people.<br /><em>Real style.</em></h2></div><button className="inline-link" onClick={() => toast("You're all caught up", { description: "More community stories are landing soon." })}>Read all stories <ArrowRight size={16} /></button></div><div className="reviews-grid">{reviews.map((review) => <article className="review-card" key={review.name}><div className="review-top"><span className="review-avatar">{review.initials}</span><div><strong>{review.name}</strong><span className="stars">{"★★★★★"}</span></div><span className="quote-mark">“</span></div><p>{review.copy}</p><small>Verified buyer · 2 weeks ago</small></article>)}</div></section>

        <section className="newsletter-section"><div><span className="eyebrow">Join the quiet club</span><h2>Good things,<br /><em>in your inbox.</em></h2></div><form onSubmit={(e) => { e.preventDefault(); toast.success("Welcome to the quiet club", { description: "Your first note is on its way." }); }}><p>New drops, studio notes and a first look at limited edits. No noise, promise.</p><div className="email-form"><input type="email" required placeholder="Your email address" /><button type="submit" aria-label="Join newsletter"><ArrowRight size={18} /></button></div><small>By subscribing, you agree to receive Veltra updates.</small></form></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><button className="wordmark footer-wordmark" onClick={() => scrollTo("top")}>VELTRA<span>STUDIO</span></button><p>Wear your story.<br />Keep it considered.</p></div><div className="footer-links"><div><strong>Explore</strong><button onClick={() => scrollTo("shop")}>Shop all</button><button onClick={() => scrollTo("styles")}>Collections</button><button onClick={() => toast("Lookbook coming soon")}>Lookbook</button></div><div><strong>Care</strong><button onClick={() => toast("Shipping is free over ₹1,999")}>Shipping & returns</button><button onClick={() => toast("Size guide coming soon")}>Size guide</button><button onClick={() => toast("Contact concierge at hello@veltra.studio")}>Contact</button></div></div><div className="footer-bottom"><span>© 2026 Veltra Studio</span><span>Made for the ones who move differently.</span><span>Instagram · Pinterest · X</span></div></footer>

      {mobileNavOpen && <div className="overlay mobile-overlay" onClick={() => setMobileNavOpen(false)}><aside className="mobile-panel" onClick={(e) => e.stopPropagation()}><button className="panel-close" onClick={() => setMobileNavOpen(false)}><X size={20} /></button><span className="eyebrow">Menu</span><h2>Move with<br /><em>intention.</em></h2><nav><button onClick={() => scrollTo("top")}>Home <ArrowRight size={16} /></button><button onClick={() => scrollTo("shop")}>Shop all <ArrowRight size={16} /></button><button onClick={() => scrollTo("styles")}>Collections <ArrowRight size={16} /></button><button onClick={() => scrollTo("story")}>Our story <ArrowRight size={16} /></button></nav><div className="mobile-panel-note">Complimentary shipping<br />on orders over ₹1,999</div></aside></div>}
      {searchOpen && <div className="overlay search-overlay" onClick={() => setSearchOpen(false)}><div className="search-modal" onClick={(e) => e.stopPropagation()}><div className="search-input-wrap"><Search size={20} /><input autoFocus placeholder="Search T-shirts, fits, colours..." value={search} onChange={(e) => setSearch(e.target.value)} /><button onClick={() => setSearchOpen(false)}><X size={19} /></button></div><div className="search-suggestions"><span>Popular searches</span><button onClick={() => { setSearch("Oversized"); setSearchOpen(false); scrollTo("shop"); }}>Oversized essentials</button><button onClick={() => { setSearch("Minimal"); setSearchOpen(false); scrollTo("shop"); }}>Minimal tees</button><button onClick={() => { setSearch("Polo"); setSearchOpen(false); scrollTo("shop"); }}>Easy-care polos</button></div></div></div>}
      {selectedProduct && <ProductModal product={selectedProduct} selectedColor={selectedColor} setSelectedColor={setSelectedColor} selectedSize={selectedSize} setSelectedSize={setSelectedSize} quantity={quantity} setQuantity={setQuantity} onClose={() => setSelectedProduct(null)} onAdd={() => { addToCart(selectedProduct, selectedColor, selectedSize, quantity); setSelectedProduct(null); setCartOpen(true); }} />}
      {cartOpen && <CartDrawer cart={cart} total={cartTotal} onClose={() => setCartOpen(false)} onUpdate={(id, delta) => setCart((current) => current.map((line) => line.id === id ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line))} onRemove={(id) => setCart((current) => current.filter((line) => line.id !== id))} onCheckout={() => toast.success("Your bag is ready", { description: "Checkout will be available when payments are connected." })} />}
      {accountOpen && <AccountPanel user={user} isAuthenticated={isAuthenticated} authMode={authMode} setAuthMode={setAuthMode} onClose={() => setAccountOpen(false)} onLogin={() => { setAccountOpen(false); startLogin(); }} onLogout={() => { logout(); setAccountOpen(false); }} />}
    </div>
  );
}

function ProductCard({ product, isWishlisted, onOpen, onAdd, onWishlist }: { product: Product; isWishlisted: boolean; onOpen: () => void; onAdd: () => void; onWishlist: () => void }) {
  return <article className="product-card"><div className="product-image-wrap" onClick={onOpen}><img className="product-image primary" src={product.image} alt={product.name} /><img className="product-image secondary" src={product.hoverImage} alt="" /><div className="product-image-shade" />{product.tag && <span className="product-tag">{product.tag}</span>}<button className={`heart-button ${isWishlisted ? "is-wishlisted" : ""}`} onClick={(e) => { e.stopPropagation(); onWishlist(); }} aria-label={`Save ${product.name}`}><Heart size={17} fill={isWishlisted ? "currentColor" : "none"} /></button><button className="quick-add" onClick={(e) => { e.stopPropagation(); onAdd(); }}>Quick add <Plus size={14} /></button></div><div className="product-info"><div className="product-title-row"><div><h3>{product.name}</h3><span>{product.fit}</span></div><strong>{formatPrice(product.price)}</strong></div><div className="product-bottom-row"><span className="product-rating"><Star size={12} fill="currentColor" /> {product.rating} <i>({product.reviews})</i></span><span className="swatches">{product.colors.map((color) => <i key={color.name} style={{ backgroundColor: color.hex }} title={color.name} />)}</span></div><div className="price-row"><span>{formatPrice(product.compareAt)}</span><b>{Math.round((1 - product.price / product.compareAt) * 100)}% off</b></div></div></article>;
}

function ProductModal({ product, selectedColor, setSelectedColor, selectedSize, setSelectedSize, quantity, setQuantity, onClose, onAdd }: { product: Product; selectedColor: string; setSelectedColor: (value: string) => void; selectedSize: string; setSelectedSize: (value: string) => void; quantity: number; setQuantity: (value: number) => void; onClose: () => void; onAdd: () => void }) {
  return <div className="overlay product-overlay" onClick={onClose}><div className="product-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={20} /></button><div className="modal-gallery"><img src={product.image} alt={product.name} /><button className="zoom-hint"><ZoomIn size={14} /> Hover to zoom</button></div><div className="modal-details"><span className="eyebrow">{product.category} · {product.tag || "The everyday edit"}</span><h2>{product.name}</h2><div className="modal-rating"><span className="stars">★★★★★</span> {product.rating} <u>{product.reviews} reviews</u></div><div className="modal-price"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.compareAt)}</del><span>{Math.round((1 - product.price / product.compareAt) * 100)}% off</span></div><p className="modal-description">{product.description}</p><div className="selection-group"><div className="selection-label"><span>Colour — <b>{selectedColor}</b></span><span>3 colours</span></div><div className="modal-swatches">{product.colors.map((color) => <button key={color.name} className={selectedColor === color.name ? "active" : ""} onClick={() => setSelectedColor(color.name)}><i style={{ backgroundColor: color.hex }} />{color.name}</button>)}</div></div><div className="selection-group"><div className="selection-label"><span>Size</span><button onClick={() => toast("Size guide", { description: "Our model is 5'11 and wears size M. Choose your usual size for a relaxed fit." })}>Size guide <ArrowRight size={13} /></button></div><div className="size-grid">{["XS", "S", "M", "L", "XL"].map((size) => <button key={size} className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></div><div className="modal-stock"><span><span className="stock-dot" /> In stock · ships tomorrow</span><span><Truck size={14} /> Free delivery over ₹1,999</span></div><div className="modal-actions"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button></div><button className="copper-button add-modal-button" onClick={onAdd}>Add to bag <ShoppingBag size={16} /></button></div><button className="buy-now" onClick={() => { onAdd(); toast.success("Ready for checkout", { description: "Your selected piece is in the bag." }); }}>Buy now <ArrowRight size={15} /></button></div></div></div>;
}

function CartDrawer({ cart, total, onClose, onUpdate, onRemove, onCheckout }: { cart: CartLine[]; total: number; onClose: () => void; onUpdate: (id: number, delta: number) => void; onRemove: (id: number) => void; onCheckout: () => void }) {
  return <div className="overlay cart-overlay" onClick={onClose}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-heading"><div><span className="eyebrow">Your edit</span><h2>Your bag <small>{cart.reduce((s, i) => s + i.quantity, 0).toString().padStart(2, "0")}</small></h2></div><button className="panel-close" onClick={onClose}><X size={20} /></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={28} /><h3>Your bag is quiet.</h3><p>Add something considered to get started.</p><button className="outline-button" onClick={onClose}>Continue shopping <ArrowRight size={15} /></button></div> : <><div className="cart-lines">{cart.map((line) => <div className="cart-line" key={`${line.id}-${line.selectedColor}-${line.selectedSize}`}><img src={line.image} alt={line.name} /><div className="cart-line-info"><div><strong>{line.name}</strong><button onClick={() => onRemove(line.id)}><X size={13} /></button></div><span>{line.selectedColor} · {line.selectedSize}</span><div className="cart-line-bottom"><div className="quantity small"><button onClick={() => onUpdate(line.id, -1)}><Minus size={12} /></button><span>{line.quantity}</span><button onClick={() => onUpdate(line.id, 1)}><Plus size={12} /></button></div><b>{formatPrice(line.price * line.quantity)}</b></div></div></div>)}</div><div className="drawer-summary"><div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div><p><Truck size={14} /> Shipping calculated at checkout</p><button className="copper-button checkout-button" onClick={onCheckout}>Continue to checkout <ArrowRight size={16} /></button><small>Secure checkout · Easy 7-day returns</small></div></>}</aside></div>;
}

function AccountPanel({ user, isAuthenticated, authMode, setAuthMode, onClose, onLogin, onLogout }: { user: any; isAuthenticated: boolean; authMode: "login" | "signup"; setAuthMode: (mode: "login" | "signup") => void; onClose: () => void; onLogin: () => void; onLogout: () => void }) {
  return <div className="overlay account-overlay" onClick={onClose}><div className="account-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={20} /></button><div className="account-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-center">V</div><span>YOUR<br /><em>everyday</em><br />edit.</span></div><div className="account-content">{isAuthenticated ? <><span className="eyebrow">Welcome back</span><h2>{user?.name || "Your account"}</h2><p>Keep track of orders, save your favourite fits and make the next edit easier.</p><div className="account-cards"><button onClick={() => toast("Orders are ready", { description: "Your order history will appear here." })}><span>01</span>Orders <ArrowRight size={15} /></button><button onClick={() => toast("Wishlist", { description: "Saved pieces will appear here." })}><span>02</span>Wishlist <ArrowRight size={15} /></button><button onClick={() => toast("Profile settings", { description: "Profile editing is coming next." })}><span>03</span>Profile <ArrowRight size={15} /></button></div><button className="outline-button full-button" onClick={onLogout}>Sign out <ArrowRight size={15} /></button></> : <><div className="auth-tabs"><button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>Sign in</button><button className={authMode === "signup" ? "active" : ""} onClick={() => setAuthMode("signup")}>Create account</button></div><span className="eyebrow">{authMode === "login" ? "Welcome back" : "Join the studio"}</span><h2>{authMode === "login" ? "Good to see you." : "Make it yours."}</h2><p>{authMode === "login" ? "Sign in to keep your saved edits and orders together." : "Save your favourite fits and get first access to new drops."}</p><button className="copper-button auth-button" onClick={onLogin}>{authMode === "login" ? "Continue with Veltra" : "Create with Veltra"} <ArrowRight size={16} /></button><div className="auth-divider"><span>or</span></div><button className="social-button" onClick={onLogin}>Continue with Google</button><small className="auth-terms">By continuing, you agree to our terms and privacy policy.</small></>}</div></div></div>;
}

function ArrowUpRightIcon() { return <ArrowUpRight size={15} />; }

function ArrowUpRight({ size }: { size: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>; }
