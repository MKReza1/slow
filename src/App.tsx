import {type ReactNode, useEffect, useMemo, useState} from 'react';
import {Link, Route, Routes, useLocation} from 'react-router-dom';

declare global {
  interface Window {
    AOS?: {init: (config: Record<string, unknown>) => void};
    gsap?: {from: (target: string, config: Record<string, unknown>) => void};
  }
}

const nav = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/pricing', 'Pricing'],
  ['/portfolio', 'Portfolio'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/order', 'Order'],
] as const;

type Plan = {
  name: string;
  price: string;
  features: string[];
};

const layoutCards = {
  services: [
    ['fa-code', 'Website Development', 'Clean code, responsive performance and scalable architecture.'],
    ['fa-pen-ruler', 'Website Design (UI/UX)', 'Bold, minimal and conversion-centered interface systems.'],
    ['fa-window-maximize', 'Landing Page Creation', 'High-converting pages tailored for ad and organic traffic.'],
    ['fa-cart-shopping', 'E-commerce Website', 'Modern storefront experiences with smooth product flow.'],
    ['fa-laptop-code', 'Custom Web Apps', 'Advanced custom systems aligned with business operations.'],
  ],
  plans: [
    {name: 'Basic Plan', price: '$99', features: ['1 Page Website', 'Mobile Responsive', 'Delivery: 2 Days']},
    {name: 'Standard Plan', price: '$249', features: ['3–5 Pages Website', 'Basic SEO', 'Contact Form', 'Delivery: 4–5 Days']},
    {name: 'Premium Plan', price: '$499', features: ['5–10 Pages Website', 'Advanced UI/UX', 'SEO Optimization', 'Admin Panel', 'Delivery: 7 Days']},
    {name: 'Ultimate Plan', price: 'Custom', features: ['Full Custom Website/Web App', 'API Integration', 'Advanced Animations', 'Priority Support']},
  ] as Plan[],
};

function App() {
  const location = useLocation();
  const [dark, setDark] = useState(localStorage.getItem('rezaworld-theme') === 'dark');
  const [slide, setSlide] = useState(0);
  const [filter, setFilter] = useState<'all' | 'business' | 'ecommerce' | 'personal'>('all');

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('rezaworld-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    window.AOS?.init({duration: 800, once: true, offset: 90});
    window.gsap?.from('.hero h1, .hero p, .hero .btn', {y: 28, opacity: 0, stagger: 0.12, duration: 0.8});
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % 3), 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const particles = Array.from({length: 34}, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
    }));
    let raf = 0;
    const resize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(125, 146, 255, 0.28)';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas id="particle-canvas" />
      <header className="navbar">
        <div className="nav-inner">
          <Link to="/" className="brand">REZA<span>WORLD</span></Link>
          <nav className="nav-links">
            {nav.map(([path, label]) => (
              <Link key={path} to={path} className={location.pathname === path ? 'active' : ''}>{label}</Link>
            ))}
          </nav>
          <button className="mode-toggle" onClick={() => setDark((d) => !d)} aria-label="Toggle theme"><i className="fa-solid fa-moon" /></button>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home slide={slide} />} />
          <Route path="/services" element={<PageShell title="Services" subtitle="High-impact services tailored to business growth."><Services /></PageShell>} />
          <Route path="/pricing" element={<PageShell title="Pricing / Plans" subtitle="Simple, transparent plans for every stage."><Pricing /></PageShell>} />
          <Route path="/portfolio" element={<PageShell title="Portfolio" subtitle="Selected website projects and creative builds."><Portfolio filter={filter} setFilter={setFilter} /></PageShell>} />
          <Route path="/about" element={<PageShell title="About REZAWORLD" subtitle="Our story, mission, and why clients choose us."><About /></PageShell>} />
          <Route path="/contact" element={<PageShell title="Contact" subtitle="Tell us your goals and we’ll plan your website roadmap."><Contact /></PageShell>} />
          <Route path="/order" element={<PageShell title="Order / Get Started" subtitle="Choose your plan and proceed to project onboarding."><Order /></PageShell>} />
        </Routes>
      </main>

      <footer>
        <div>© REZAWORLD | Designed by <a href="https://t.me/nebxmkr1" target="_blank" rel="noreferrer">NEB X MKR™</a></div>
        <div className="socials"><a href="#"><i className="fa-brands fa-instagram" /></a><a href="https://t.me/nebxmkr1"><i className="fa-brands fa-telegram" /></a><a href="#"><i className="fa-brands fa-youtube" /></a></div>
      </footer>
      <div className="watermark">@nebxmkr1</div>
    </>
  );
}

function PageShell({title, subtitle, children}: {title: string; subtitle: string; children: ReactNode}) {
  return (
    <section>
      <div className="section-head page-head" data-aos="fade-up">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function Home({slide}: {slide: number}) {
  const testimonials = useMemo(
    () => [
      ['“Our conversions doubled in 45 days.”', 'Aurora Dental Clinic'],
      ['“Their UI transformed our brand credibility instantly.”', 'Nova Apparel'],
      ['“Fast delivery, stunning visuals, and top support.”', 'BrightPath Consulting'],
    ],
    [],
  );

  return (
    <>
      <section className="hero">
        <div data-aos="fade-right">
          <h1>We Build Stunning Websites That Convert 🚀</h1>
          <p>REZAWORLD blends futuristic visuals, conversion strategy and flawless engineering to turn visitors into customers.</p>
          <div className="btns"><Link to="/order" className="btn btn-primary">Get Started</Link><Link to="/pricing" className="btn btn-secondary">View Plans</Link></div>
        </div>
        <div className="hero-card glass" data-aos="zoom-in"><div className="orb" /></div>
      </section>

      <section><div className="section-head"><h2>Why brands choose us</h2></div><div className="grid grid-3">
        {['Fast Performance ⚡', 'Modern Design 🎨', 'SEO Optimized 📈'].map((title, i) => <article className="card glass" data-aos="fade-up" data-aos-delay={i * 100} key={title}><div className="icon"><i className={`fa-solid ${['fa-bolt', 'fa-palette', 'fa-chart-line'][i]}`} /></div><h3>{title}</h3><p>Premium execution with measurable outcomes.</p></article>)}
      </div></section>

      <section><div className="section-head"><h2>Client Testimonials</h2></div><div className="testimonial glass card"><h3>{testimonials[slide][0]}</h3><p>— {testimonials[slide][1]}</p></div></section>
      <section><div className="section-head"><h2>Trusted by growing teams</h2></div><div className="logos">{['ALPHASTACK', 'SYNOVA', 'SKYBLOOM', 'PIXELHUB', 'NEXA MART'].map((l) => <span className="logo-pill" key={l}>{l}</span>)}</div></section>
    </>
  );
}

const Services = () => <section className="grid grid-3">{layoutCards.services.map(([icon, title, text], i) => <article className="card glass" key={title} data-aos="fade-up" data-aos-delay={i * 50}><div className="icon"><i className={`fa-solid ${icon}`} /></div><h3>{title}</h3><p>{text}</p></article>)}</section>;

function Pricing() {
  return <section className="grid grid-4">{layoutCards.plans.map((plan, i) => <article className={`card glass price-card ${i === 1 ? 'popular' : ''}`} key={plan.name} data-aos="fade-up" data-aos-delay={i * 80}>{i === 1 && <span className="badge">Most Popular</span>}<h3>{plan.name}</h3><div className="price">{plan.price}</div><ul className="features">{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><Link to="/order" className={`btn ${i === 1 ? 'btn-primary' : 'btn-secondary'}`}>Choose Plan</Link></article>)}</section>;
}

function Portfolio({filter, setFilter}: {filter: 'all' | 'business' | 'ecommerce' | 'personal'; setFilter: (v: 'all' | 'business' | 'ecommerce' | 'personal') => void}) {
  const items: [string, string, string][] = [
    ['Finvia Corporate', 'Business conversion website with lead generation flow.', 'business'],
    ['Nexa Store', 'Online shop built for speed and mobile-first shopping.', 'ecommerce'],
    ['Creator Portfolio', 'Visual personal brand site with custom interactions.', 'personal'],
    ['LegalPro Firm', 'Professional service website with appointment funnels.', 'business'],
  ];
  return <><div className="filter-row">{(['all', 'business', 'ecommerce', 'personal'] as const).map((f) => <button className={`filter-btn ${filter === f ? 'active' : ''}`} key={f} onClick={() => setFilter(f)}>{f}</button>)}</div><section className="grid grid-3">{items.filter((x) => filter === 'all' || x[2] === filter).map(([title, text]) => <article className="card glass" key={title}><h3>{title}</h3><p>{text}</p></article>)}</section></>;
}

const About = () => <section className="grid grid-3"><article className="card glass"><h3>Brand Story</h3><p>REZAWORLD merges visual innovation with strategic conversion logic.</p></article><article className="card glass"><h3>Mission & Vision</h3><p>Build websites that look premium and perform exceptionally.</p></article><article className="card glass"><h3>Why Choose Us</h3><p>Fast execution, modern UX and transparent communication.</p></article></section>;
const Contact = () => <section className="grid" style={{gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))'}}><article className="glass card"><form><input placeholder="Name" required /><input type="email" placeholder="Email" required /><textarea rows={6} placeholder="Message" required /><button className="btn btn-primary" type="submit">Send Message</button></form></article><article className="glass card"><h3>Direct Contact</h3><p>Reach our team instantly on your preferred channel.</p><div className="btns"><a className="btn btn-secondary" href="https://wa.me/0000000000">WhatsApp</a><a className="btn btn-secondary" href="https://t.me/nebxmkr1">Telegram</a></div><div className="map-placeholder">Map placeholder</div></article></section>;
const Order = () => <section className="glass card" style={{maxWidth: 720}}><form><select required><option value="">Select Plan</option><option>Basic Plan</option><option>Standard Plan</option><option>Premium Plan</option><option>Ultimate Plan</option></select><input placeholder="Full Name" required /><input type="email" placeholder="Email" required /><textarea rows={6} placeholder="Project details" /><button className="btn btn-primary" type="submit">Proceed to Payment</button></form><p className="payment-note">Payment integration placeholder: UPI / Cashfree.</p></section>;

export default App;
