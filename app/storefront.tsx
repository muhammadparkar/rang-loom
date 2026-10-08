"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MagnifyingGlass,
  ShoppingBag,
  X,
  Plus,
  Minus,
  List,
  Heart,
  Leaf,
  HandHeart,
  Truck,
  InstagramLogo,
  Check,
} from "@phosphor-icons/react";
import { products, money, type Product } from "./catalog";
import RangLoomLogo from "./components/RangLoomLogo";

type BagItem = { slug: string; quantity: number };
const categories = ["All pieces", "Cushions", "Bedding", "Throws", "Curtains"];

export default function Storefront({ product }: { product?: Product }) {
  const [category, setCategory] = useState("All pieces");
  const [bag, setBag] = useState<BagItem[]>([]);
  const [panel, setPanel] = useState<
    "bag" | "search" | "menu" | "saved" | null
  >(null);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const count = bag.reduce((sum, item) => sum + item.quantity, 0);
  const total = bag.reduce(
    (sum, item) =>
      sum +
      (products.find((p) => p.slug === item.slug)?.price ?? 0) * item.quantity,
    0,
  );

  // Browser-only preferences are restored after static markup hydrates.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const initialCategory = new URLSearchParams(window.location.search).get(
      "category",
    );
    // URL filters are read after hydration because this storefront is statically rendered.
    if (initialCategory && categories.includes(initialCategory))
      setCategory(initialCategory);
    try {
      const stored = JSON.parse(localStorage.getItem("rang-loom-bag") ?? "[]");
      // Restore browser-only storage after hydration; server markup must start with an empty bag.
        if (Array.isArray(stored))
        setBag(
          stored.filter(
            (item) =>
              item &&
              products.some((p) => p.slug === item.slug) &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0 &&
              item.quantity <= 99,
          ),
        );
      const hearts = JSON.parse(
        localStorage.getItem("rang-loom-saved") ?? "[]",
      );
      if (Array.isArray(hearts))
        setSaved(
          hearts.filter((slug) => products.some((p) => p.slug === slug)),
        );
    } catch {
      /* A blocked or stale local store must not prevent browsing. */
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (panel) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  function updateBag(next: BagItem[]) {
    setBag(next);
    try {
      localStorage.setItem("rang-loom-bag", JSON.stringify(next));
    } catch {
      setNotice(
        "Your bag is available for this visit. Browser storage is disabled.",
      );
    }
  }
  function addToBag(item: Product, amount = 1) {
    const existing = bag.find((entry) => entry.slug === item.slug);
    updateBag(
      existing
        ? bag.map((entry) =>
            entry.slug === item.slug
              ? { ...entry, quantity: Math.min(99, entry.quantity + amount) }
              : entry,
          )
        : [...bag, { slug: item.slug, quantity: amount }],
    );
    setPanel("bag");
  }
  function toggleSaved(slug: string) {
    const next = saved.includes(slug)
      ? saved.filter((item) => item !== slug)
      : [...saved, slug];
    setSaved(next);
    try {
      localStorage.setItem("rang-loom-saved", JSON.stringify(next));
    } catch {
      /* Saved pieces remain available for this visit. */
    }
  }
  function browse(name: string) {
    setCategory(name);
    setPanel(null);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }
  function card(item: Product) {
    return (
      <article className="product-card" key={item.slug}>
        <div className="product-photo">
          <Link href={`/products/${item.slug}`}>
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 600px) 85vw, 25vw"
              style={{ objectPosition: item.position }}
            />
          </Link>
          <button
            className={`save-button ${saved.includes(item.slug) ? "is-saved" : ""}`}
            onClick={() => toggleSaved(item.slug)}
            aria-label={`${saved.includes(item.slug) ? "Unsave" : "Save"} ${item.name}`}
          >
            <Heart
              size={20}
              weight={saved.includes(item.slug) ? "fill" : "regular"}
            />
          </button>
          <button className="quick-add" onClick={() => addToBag(item)}>
            Add to bag <Plus size={17} />
          </button>
        </div>
        <div className="product-meta">
          <span>{item.material}</span>
          <span>{money(item.price)}</span>
        </div>
        <Link className="product-name" href={`/products/${item.slug}`}>
          {item.name}
        </Link>
        <div className="product-color">
          <i />
          {item.color}
        </div>
      </article>
    );
  }

  return (
    <>
      <div className="announcement">
        <span>
          THE BLOOM &amp; WEAVE — A MODERN EMBLEM OF COLOUR AND CRAFT
        </span>
        <span>
          Complimentary shipping on orders above ₹5,000 <ArrowRight size={13} />
        </span>
      </div>
      <div className="sticky-navigation">
        <header className="header">
          <div className="header-side">
            <span className="desktop-note">More than textiles — it&apos;s a feeling</span>
            <button
              className="mobile-menu icon-button"
              aria-label="Open menu"
              onClick={() => setPanel("menu")}
            >
              <List size={23} />
            </button>
          </div>
          <Link className="wordmark" href="/" aria-label="Rang & Loom Home">
            <RangLoomLogo variant="horizontal" size={48} />
          </Link>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search products"
              onClick={() => setPanel("search")}
            >
              <MagnifyingGlass size={22} />
            </button>
            <button
              className="icon-button wishlist"
              aria-label="Saved pieces"
              onClick={() => setPanel("saved")}
            >
              <Heart size={22} />
            </button>
            <button
              className="bag-button"
              aria-label={`Shopping bag, ${count} items`}
              onClick={() => setPanel("bag")}
            >
              <ShoppingBag size={22} />
              <span className="bag-label">Bag</span>
              <span className="bag-count">{count}</span>
            </button>
          </div>
        </header>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/#shop" onClick={() => setCategory("All pieces")}>
            Shop all
          </Link>
          {categories.slice(1).map((name) => (
            <Link
              key={name}
              href={
                product ? `/?category=${encodeURIComponent(name)}#shop` : "/#shop"
              }
              onClick={() => setCategory(name)}
            >
              {name}
            </Link>
          ))}
          <Link href="/#collections">Collections</Link>
          <Link href="/#story">Our story</Link>
          <Link href="/#journal">
            The Journal <ArrowUpRight size={12} />
          </Link>
        </nav>
      </div>
      <main>
        {product ? (
          <section className="detail-section">
            <div className="breadcrumb">
              <Link href="/">Home</Link> /{" "}
              <Link href="/#shop">{product.category}</Link> / {product.name}
            </div>
            <div className="detail-grid">
              <div className="detail-image">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 55vw"
                  style={{ objectPosition: product.position }}
                />
              </div>
              <div className="detail-copy">
                <span className="eyebrow">THE EVERYDAY, ELEVATED</span>
                <h1>{product.name}</h1>
                <p className="detail-price">
                  {money(product.price)} <small>Inclusive of all taxes</small>
                </p>
                <p>{product.description}</p>
                <div className="detail-choice">
                  <span>Colour — {product.color}</span>
                  <i />
                </div>
                <label className="size-label" htmlFor="size">
                  Size
                </label>
                <select id="size">
                  <option>{product.size}</option>
                </select>
                <div className="add-row">
                  <div className="quantity">
                    <button
                      aria-label="Decrease quantity"
                      disabled={quantity === 1}
                      onClick={() => setQuantity(quantity - 1)}
                    >
                      <Minus />
                    </button>
                    <span>{quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      disabled={quantity === 99}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus />
                    </button>
                  </div>
                  <button
                    className="primary"
                    onClick={() => addToBag(product, quantity)}
                  >
                    Add to bag <ShoppingBag size={18} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Save product"
                    onClick={() => toggleSaved(product.slug)}
                  >
                    <Heart
                      size={24}
                      weight={saved.includes(product.slug) ? "fill" : "regular"}
                    />
                  </button>
                </div>
                <p className="delivery-note">
                  <Truck size={18} /> Complimentary shipping above ₹5,000
                </p>
                <details open>
                  <summary>Materials & details</summary>
                  <p>
                    {product.material}. {product.size}. Designed to layer
                    beautifully with the pieces you already love.
                  </p>
                </details>
                <details>
                  <summary>Care guide</summary>
                  <p>{product.care}</p>
                </details>
                <details>
                  <summary>Delivery & returns</summary>
                  <p>
                    This is a preview collection. Ordering and delivery are not
                    yet available. Your bag is saved locally for your next
                    visit.
                  </p>
                </details>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span className="tiny-line" /> MORE THAN TEXTILES — IT&apos;S A FEELING
                </div>
                <h1>
                  The art of
                  <br />
                  living <em>softly.</em>
                </h1>
                <p>
                  Celebrating the vibrant beauty of colour and the timelessness of craft.
                  <br />
                  Inspired by traditional weaving heritage for contemporary living.
                </p>
                <button
                  className="primary"
                  onClick={() => browse("All pieces")}
                >
                  Explore the collection <ArrowRight size={19} />
                </button>
                <div className="hero-footnote">
                  THE BLOOM &amp; WEAVE · ROOTED IN CRAFT
                </div>
              </div>
              <div className="hero-image">
                <Image
                  src="/images/hero.jpg"
                  alt="Sunlit living room with natural linen cushions, a soft woven throw and cream curtains"
                  fill
                  priority
                  sizes="(max-width: 700px) 100vw, 65vw"
                />
                <div className="image-caption">
                  <div>
                    <span>THE NATURAL LIVING EDIT</span>
                    <p>A slower kind of Sunday.</p>
                  </div>
                  <a
                    href="#collections"
                    aria-label="Discover the Natural Living Edit"
                  >
                    <ArrowUpRight size={26} />
                  </a>
                </div>
              </div>
            </section>
            <div className="values-strip">
              <span>
                <HandHeart size={22} weight="light" /> Warmth &amp; Energy
              </span>
              <span>
                <Leaf size={22} weight="light" /> Nature &amp; Balance
              </span>
              <span>
                <span className="woven-mark">✳</span> Luxury &amp; Elegance
              </span>
              <span>
                <Truck size={23} weight="light" /> Trust &amp; Sophistication
              </span>
            </div>
            <section className="collections section" id="collections">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">LAYERS OF A BEAUTIFUL HOME</span>
                  <h2>Find your kind of comfort.</h2>
                </div>
                <a href="#shop" className="text-link">
                  Explore all collections <ArrowRight size={19} />
                </a>
              </div>
              <div className="collection-grid">
                {[
                  {
                    name: "Cushions",
                    sub: "Small touches. Beautiful difference.",
                    image: "/images/living.jpg",
                  },
                  {
                    name: "Bedding",
                    sub: "Your everyday escape.",
                    image: "/images/bedroom.jpg",
                  },
                  {
                    name: "Throws",
                    sub: "Warmth, woven into every moment.",
                    image: "/images/story.jpg",
                  },
                ].map((item, i) => (
                  <button
                    className={`collection-card collection-${i}`}
                    key={item.name}
                    onClick={() => browse(item.name)}
                  >
                    <div className="collection-image">
                      <Image
                        src={item.image}
                        alt={`${item.name} collection in a thoughtfully styled home`}
                        fill
                        sizes="(max-width: 700px) 90vw, 33vw"
                      />
                    </div>
                    <div className="collection-bottom">
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.sub}</p>
                      </div>
                      <ArrowUpRight size={24} weight="light" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="editorial-banner">
              <span className="eyebrow">MORE THAN TEXTILES — IT&apos;S A FEELING</span>
              <p>
                Not just how your home looks.
                <br />
                <em>How it makes you feel.</em>
              </p>
              <span>
                The Bloom &amp; Weave · A Modern Emblem of Colour and Craft
              </span>
            </section>
          </>
        )}
        <section className="section shop" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CONSIDERED DETAILS. EVERYDAY JOY.</span>
              <h2>
                {product ? "Better, together." : "Meet your new favourites."}
              </h2>
            </div>
            <span className="small-note">
              Made to become part of your everyday.
            </span>
          </div>
          <div className="shop-tabs" role="group" aria-label="Filter products">
            {categories.map((name) => (
              <button
                aria-pressed={category === name}
                className={category === name ? "active" : ""}
                key={name}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {products
              .filter(
                (p) => category === "All pieces" || p.category === category,
              )
              .map(card)}
          </div>
        </section>
        <section className="story" id="story">
          <div className="story-image">
            <Image
              src="/images/story.jpg"
              alt="Warm, layered interior with carefully chosen natural materials"
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />
          </div>
          <div className="story-copy">
            <span className="eyebrow">
              <span className="tiny-line" /> 01. BRAND OVERVIEW
            </span>
            <h2>
              The Bloom &amp; Weave.
              <br />
              <em>A modern emblem of colour and craft.</em>
            </h2>
            <p>
              Rang &amp; Loom is a home textiles and soft furnishings brand that
              celebrates the vibrant beauty of colour and the timelessness of craft.
              Inspired by traditional weaving heritage, our identity brings together
              modern aesthetics and a sense of warmth, comfort and character for
              contemporary living spaces.
            </p>
            <p>
              Rang means colour. Loom is where it all begins. Together, they
              tell our story — honest materials, thoughtful design, and the
              quiet beauty of a well-loved home.
            </p>
            <a className="text-link" href="#journal">
              Discover our world <ArrowRight size={19} />
            </a>
          </div>
        </section>
        <section className="section journal" id="journal">
          <div>
            <span className="eyebrow">NOTES FROM HOME</span>
            <h2>The slower living journal.</h2>
            <p>Simple ideas for a home that feels good.</p>
          </div>
          <details>
            <summary>
              The art of layering textures <Plus size={20} />
            </summary>
            <p>
              Start with a soft linen base. Add a tactile woven cushion, then
              drape a cotton throw loosely over the arm of your sofa. Keep your
              palette close and let the textures do the talking.
            </p>
          </details>
          <details>
            <summary>
              Make room for slow mornings <Plus size={20} />
            </summary>
            <p>
              Open the curtains. Let natural light settle on rumpled linen. A
              favourite cup, a good book, and bedding that breathes are all the
              invitation you need to stay a little longer.
            </p>
          </details>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <div>
            <Link className="wordmark" href="/" aria-label="Rang & Loom Home">
              <RangLoomLogo variant="reversed-horizontal" size={44} />
            </Link>
            <p>More than textiles — it&apos;s a feeling.</p>
          </div>
          <div className="newsletter">
            <h3>A little inspiration, delivered.</h3>
            <p>
              New collections, thoughtful stories, and notes from our world.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setJoined(true);
              }}
            >
              <label className="sr-only" htmlFor="email">
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setJoined(false);
                }}
                required
              />
              <button aria-label="Join newsletter" type="submit">
                <ArrowRight size={23} />
              </button>
            </form>
            {joined && (
              <p role="status">
                Thank you for your interest. Newsletter signup opens at launch.
              </p>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Rang & Loom. Thoughtfully crafted.</span>
          <div>
            <a href="#story">Our story</a>
            <a href="#collections">Collections</a>
            <button
              onClick={() =>
                setNotice(
                  "Our studio contact details will be available when the collection launches.",
                )
              }
            >
              Contact
            </button>
            <InstagramLogo size={18} aria-label="InstagramLogo" />
          </div>
          <span>INDIA · INR ₹</span>
        </div>
      </footer>
      <dialog
        ref={dialog}
        aria-labelledby="drawer-title"
        className={`drawer ${panel === "search" ? "search-drawer" : ""}`}
        onCancel={() => setPanel(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
        }}
      >
        <div className="drawer-inner">
          <div className="drawer-heading">
            <h2 id="drawer-title">
              {panel === "bag"
                ? `Your bag (${count})`
                : panel === "saved"
                  ? "Your saved pieces"
                  : panel === "menu"
                    ? "Explore Rang & Loom"
                    : "Find something lovely."}
            </h2>
            <button
              className="icon-button"
              aria-label="Close panel"
              onClick={() => setPanel(null)}
            >
              <X size={24} />
            </button>
          </div>
          {notice && (
            <p className="panel-notice" role="status">
              {notice}
            </p>
          )}
          {panel === "menu" && (
            <div className="mobile-links">
              {categories.map((name) => (
                <Link
                  onClick={() => {
                    setCategory(name);
                    setPanel(null);
                  }}
                  key={name}
                  href={
                    product
                      ? `/?category=${encodeURIComponent(name)}#shop`
                      : "/#shop"
                  }
                >
                  {name}
                  <ArrowUpRight size={20} />
                </Link>
              ))}
              <Link href="/#story" onClick={() => setPanel(null)}>
                Our story
              </Link>
            </div>
          )}
          {panel === "search" && (
            <>
              <div className="search-field">
                <MagnifyingGlass size={22} />
                <input
                  aria-label="Search catalogue"
                  placeholder="Try linen, cushions, or a little comfort…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                />
              </div>
              <p className="small-note">
                {query ? "YOUR SEARCH RESULTS" : "A FEW THINGS YOU MIGHT LOVE"}
              </p>
              <div className="search-results">
                {products
                  .filter((p) =>
                    `${p.name} ${p.category} ${p.material}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((item) => (
                    <Link
                      className="search-result"
                      key={item.slug}
                      href={`/products/${item.slug}`}
                      onClick={() => setPanel(null)}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={85}
                        height={100}
                      />
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.material}</p>
                        <span>{money(item.price)}</span>
                      </div>
                      <ArrowRight size={18} />
                    </Link>
                  ))}
                {!products.some((p) =>
                  `${p.name} ${p.category} ${p.material}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                ) && (
                  <p>No pieces found. Try “linen”, “throws” or “cushions”.</p>
                )}
              </div>
            </>
          )}
          {panel === "saved" && (
            <>
              {saved.length ? (
                products.filter((p) => saved.includes(p.slug)).map(card)
              ) : (
                <div className="empty-state">
                  <Heart size={42} weight="light" />
                  <h3>Keep your favourites close.</h3>
                  <p>Tap the heart on a piece you love to save it here.</p>
                  <button className="primary" onClick={() => setPanel(null)}>
                    Keep exploring <ArrowRight />
                  </button>
                </div>
              )}
            </>
          )}
          {panel === "bag" && (
            <>
              {bag.length ? (
                <>
                  <div className="bag-items">
                    {bag.map((item) => {
                      const p = products.find((p) => p.slug === item.slug)!;
                      return (
                        <div className="bag-item" key={item.slug}>
                          <Image
                            src={p.image}
                            alt={p.name}
                            width={105}
                            height={130}
                          />
                          <div>
                            <Link
                              href={`/products/${p.slug}`}
                              onClick={() => setPanel(null)}
                            >
                              {p.name}
                            </Link>
                            <p>{p.color}</p>
                            <span>{money(p.price)}</span>
                            <div className="bag-controls">
                              <div className="quantity">
                                <button
                                  aria-label={`Decrease ${p.name} quantity`}
                                  onClick={() =>
                                    updateBag(
                                      bag
                                        .map((entry) =>
                                          entry.slug === item.slug
                                            ? {
                                                ...entry,
                                                quantity: entry.quantity - 1,
                                              }
                                            : entry,
                                        )
                                        .filter((entry) => entry.quantity > 0),
                                    )
                                  }
                                >
                                  <Minus size={13} />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  aria-label={`Increase ${p.name} quantity`}
                                  disabled={item.quantity >= 99}
                                  onClick={() =>
                                    updateBag(
                                      bag.map((entry) =>
                                        entry.slug === item.slug
                                          ? {
                                              ...entry,
                                              quantity: entry.quantity + 1,
                                            }
                                          : entry,
                                      ),
                                    )
                                  }
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                              <button
                                className="remove"
                                onClick={() =>
                                  updateBag(
                                    bag.filter(
                                      (entry) => entry.slug !== item.slug,
                                    ),
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bag-summary">
                    <p>
                      {total >= 5000
                        ? "Your bag qualifies for complimentary shipping."
                        : `${money(5000 - total)} away from complimentary shipping.`}
                    </p>
                    <div>
                      <span>Subtotal</span>
                      <strong>{money(total)}</strong>
                    </div>
                    <span className="small-note">
                      Inclusive of taxes. Shipping calculated at checkout.
                    </span>
                    <button
                      className="primary"
                      onClick={() =>
                        setNotice(
                          "This is a preview store. Checkout is not yet available; your bag is saved.",
                        )
                      }
                    >
                      Continue to checkout <ArrowRight size={18} />
                    </button>
                    <p className="preview-note">
                      Preview collection · Purchases are not yet available.
                    </p>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <ShoppingBag size={45} weight="light" />
                  <h3>A little room for something lovely.</h3>
                  <p>Your bag is empty. Find a piece that feels like home.</p>
                  <button className="primary" onClick={() => setPanel(null)}>
                    Continue exploring <ArrowRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </dialog>
      {notice && !panel && (
        <div className="toast" role="status">
          <Check size={19} />
          <span>{notice}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </>
  );
}
