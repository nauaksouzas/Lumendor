import { ArrowDownRight, ArrowUpRight, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '17742707460';
const DISPLAY_PHONE = '+1 (774) 270-7460';

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const products = [
  {
    id: 'le-cavalier',
    edition: 'Edition I',
    name: 'Le Cavalier',
    initials: 'LC',
    tone: 'dark',
    description:
      'A composed signature for the moments that call for presence without excess.',
    whatsappMessage:
      "Hello! I came from the Lumen D'Or website and I'd like to order Le Cavalier (50 ml). Can you help me?",
  },
  {
    id: 'la-signature',
    edition: 'Edition II',
    name: 'La Signature',
    initials: 'LS',
    tone: 'light',
    description:
      'An elegant signature designed to feel personal, memorable and unmistakably yours.',
    whatsappMessage:
      "Hello! I came from the Lumen D'Or website and I'd like to order La Signature (50 ml). Can you help me?",
  },
] as const;

const WhatsAppButton = ({
  label,
  message,
  className = '',
}: {
  label: string;
  message: string;
  className?: string;
}) => (
  <a
    className={`button button-whatsapp ${className}`.trim()}
    href={whatsappLink(message)}
    target="_blank"
    rel="noreferrer"
    aria-label={`${label} on WhatsApp`}
  >
    <MessageCircle aria-hidden="true" size={18} strokeWidth={1.5} />
    <span>{label}</span>
    <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
  </a>
);

const Header = () => (
  <header className="site-header">
    <a className="brand-lockup" href="#top" aria-label="Lumen d'Or home">
      <img src="/mark.png" alt="" className="brand-mark" />
      <span>Lumen d'Or</span>
    </a>

    <nav className="desktop-nav" aria-label="Primary navigation">
      <a href="#editions">Editions</a>
      <a href="#house">The House</a>
      <a href="#concierge">Concierge</a>
    </nav>

    <a
      className="header-order-link"
      href={whatsappLink("Hello! I came from the Lumen D'Or website and I'd like help choosing a fragrance.")}
      target="_blank"
      rel="noreferrer"
    >
      Order
      <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
    </a>
  </header>
);

const Hero = () => (
  <section className="hero" id="top">
    <div className="hero-copy reveal reveal-1">
      <p className="eyebrow">Private fragrance house · 2026</p>
      <h1>
        Leave a trace.
        <span>Not an explanation.</span>
      </h1>
      <p className="hero-lede">
        Lumen d'Or introduces two signatures created around presence, memory and the ritual of being remembered.
      </p>

      <div className="hero-actions">
        <a className="button button-primary" href="#editions">
          Discover the editions
          <ArrowDownRight aria-hidden="true" size={17} strokeWidth={1.5} />
        </a>
        <WhatsAppButton
          label="Order on WhatsApp"
          message="Hello! I came from the Lumen D'Or website and I'd like help placing an order."
        />
      </div>
    </div>

    <div className="hero-art reveal reveal-2" aria-hidden="true">
      <div className="hero-art-frame">
        <div className="hero-art-topline">
          <span>Maison privée</span>
          <span>50 ml</span>
        </div>
        <div className="hero-monogram-wrap">
          <img src="/mark.png" alt="" className="hero-monogram" />
        </div>
        <div className="hero-art-wordmark">
          <span>Lumen</span>
          <span>d'Or</span>
        </div>
        <div className="hero-art-footer">Le Cavalier · La Signature</div>
      </div>
    </div>

    <a className="hero-scroll" href="#editions" aria-label="Scroll to the Lumen d'Or editions">
      Scroll to discover
      <ArrowDownRight aria-hidden="true" size={15} strokeWidth={1.5} />
    </a>
  </section>
);

const Editions = () => (
  <section className="section editions-section" id="editions">
    <div className="section-heading">
      <div>
        <p className="eyebrow">The first chapter</p>
        <h2>Two signatures. One house.</h2>
      </div>
      <p>
        Choose the edition that feels most like you. Every purchase inquiry is handled directly through our WhatsApp concierge.
      </p>
    </div>

    <div className="edition-grid">
      {products.map((product, index) => (
        <article className="edition-card" data-tone={product.tone} id={product.id} key={product.id}>
          <div className="edition-visual" aria-hidden="true">
            <div className="edition-visual-meta">
              <span>{product.edition}</span>
              <span>50 ml</span>
            </div>
            <div className="edition-initials">{product.initials}</div>
            <img src="/mark.png" alt="" className="edition-mark" />
            <span className="edition-index">0{index + 1}</span>
          </div>

          <div className="edition-content">
            <p className="edition-label">{product.edition}</p>
            <h3>{product.name}</h3>
            <p className="edition-description">{product.description}</p>

            <dl className="edition-details">
              <div>
                <dt>Format</dt>
                <dd>50 ml</dd>
              </div>
              <div>
                <dt>Ordering</dt>
                <dd>Direct concierge</dd>
              </div>
              <div>
                <dt>Channel</dt>
                <dd>WhatsApp</dd>
              </div>
            </dl>

            <WhatsAppButton label={`Buy ${product.name}`} message={product.whatsappMessage} />
          </div>
        </article>
      ))}
    </div>
  </section>
);

const House = () => (
  <section className="section house-section" id="house">
    <div className="house-rule" aria-hidden="true" />
    <div className="house-copy">
      <p className="eyebrow">The house</p>
      <h2>Fragrance is the part of the entrance that stays.</h2>
      <p>
        Lumen d'Or is built around a simple idea: luxury should feel intimate before it feels loud. The house pairs restrained presentation with direct, human service from first question to order.
      </p>
    </div>

    <div className="house-manifesto" aria-label="Lumen d'Or principles">
      <div>
        <span>01</span>
        <strong>Presence</strong>
        <p>Designed around the impression that remains after the moment passes.</p>
      </div>
      <div>
        <span>02</span>
        <strong>Restraint</strong>
        <p>No clutter, no false urgency, no unnecessary noise between you and the fragrance.</p>
      </div>
      <div>
        <span>03</span>
        <strong>Service</strong>
        <p>Questions and purchases are handled directly by the Lumen d'Or concierge.</p>
      </div>
    </div>
  </section>
);

const Concierge = () => (
  <section className="section concierge-section" id="concierge">
    <div className="concierge-inner">
      <p className="eyebrow">Private concierge</p>
      <h2>Ready when you are.</h2>
      <p>
        Ask about an edition, confirm availability, or start an order directly with Lumen d'Or on WhatsApp.
      </p>
      <a
        className="concierge-number"
        href={whatsappLink("Hello! I came from the Lumen D'Or website and I'd like to speak with the concierge.")}
        target="_blank"
        rel="noreferrer"
      >
        {DISPLAY_PHONE}
        <ArrowUpRight aria-hidden="true" size={23} strokeWidth={1.25} />
      </a>
      <WhatsAppButton
        label="Start a WhatsApp conversation"
        message="Hello! I came from the Lumen D'Or website and I'd like to speak with the concierge."
      />
    </div>
  </section>
);

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-brand">
      <img src="/mark.png" alt="" />
      <span>Lumen d'Or</span>
    </div>
    <p>Le Cavalier · La Signature</p>
    <p>© 2026 Lumen d'Or. All rights reserved.</p>
  </footer>
);

export default function App() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <Editions />
        <House />
        <Concierge />
      </main>
      <Footer />
      <a
        className="mobile-whatsapp-bar"
        href={whatsappLink("Hello! I came from the Lumen D'Or website and I'd like to place an order.")}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle aria-hidden="true" size={18} strokeWidth={1.5} />
        Order on WhatsApp
        <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.5} />
      </a>
    </div>
  );
}
