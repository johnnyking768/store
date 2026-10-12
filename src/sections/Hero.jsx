import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { copy } from "../data/content";
import { Button, Badge } from "../components/ui";
import { products } from "../data/products";
import OrderButton from "../components/OrderButton";
import { formatNaira } from "../lib/format";
import { icons } from "../components/Layout";
export default function Hero() {
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const slides = [
    { title: ["Upgrade", "Your World"], description: copy.hero.description, to: "/shop", action: "Shop now", eyebrow: copy.hero.eyebrow },
    { title: ["Find Your", "Everyday Extras"], description: "Earbuds, watches and the little essentials that complete your setup.", to: "/accessories", action: "Explore accessories", eyebrow: "Made for your everyday" },
    { title: ["Meet Your", "Next Favourite"], description: "Explore our featured sample collection and save the products you love.", to: "/deals", action: "Explore offers", eyebrow: "A fresh selection" },
  ];
  const active = slides[slide];
  const product = products.filter(p=>p.featured)[slide] || products[0];
  const [paused, setPaused] = useState(Boolean(reduced));
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(()=>{const change=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change);},[]);
  useEffect(()=>{if(paused || hovered || hidden)return;const timer=setInterval(()=>setSlide(s=>(s+1)%3),6000);return()=>clearInterval(timer);},[paused,hovered,hidden]);
  return (
    <section onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={event=>{if(!event.target.closest('.carousel-pause'))setPaused(true);}} className="hero" aria-label="Featured collections" aria-roledescription="carousel">
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial={reduced ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow">{active.eyebrow}</p>
          <h1 aria-live={paused ? "polite" : "off"}>
            {active.title[0]}
            <br />
            {active.title[1]}<span>.</span>
          </h1>
          <p className="hero-description">{active.description}</p>
          <div className="hero-buttons">
            <Button to={active.to}>{active.action}</Button>
            <Button to="/deals" variant="outline">
              {copy.hero.secondary}
            </Button>
          </div>
          <div className="hero-controls" aria-label="Choose featured collection"><button aria-label="Previous slide" onClick={() => setSlide((slide + 2) % 3)}>←</button>{slides.map((item, index) => <button key={item.to} aria-label={`Show slide ${index + 1}`} aria-pressed={slide === index} onClick={() => setSlide(index)}>{index + 1}</button>)}<button aria-label="Next slide" onClick={() => setSlide((slide + 1) % 3)}>→</button></div>
          <button className="carousel-pause" onClick={()=>setPaused(p=>!p)}>{paused ? "Play slideshow" : "Pause slideshow"}</button><div className="hero-benefits">
            {copy.benefits.map((item) => {
              const Icon = icons[item.icon];
              return (
                <div key={item.title}>
                  <Icon size={23} />
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        <div className="hero-art">
          <div className="halo" />
          <div
            className="phone-scene"
            role="img"
            aria-label="Illustration of a purple smartphone on a display pedestal"
          >
            <div className="phone-pair">
              <div className="phone-back">
                <div className="camera-cluster">
                  <i />
                  <i />
                  <i />
                  <b />
                </div>
                <div className="phone-emblem">m</div>
              </div>
              <div className="phone-front">
                <div className="phone-wallpaper" />
                <div className="phone-island" />
              </div>
            </div>
            <div className="pedestal" />
          </div>
          <div className="hero-float">
            <Badge>{copy.hero.badge}</Badge>
            <h2>{product.name}</h2>
            <p>{product.variants[0].storage} · {product.isSample ? "Sample price" : "From"}</p><strong className="hero-price">{formatNaira(product.price)}</strong>
            <OrderButton product={product} className="black-link" />
          </div>
          <div className="art-caption">
            <span /> {copy.hero.note}
          </div>
        </div>
      </div>
    </section>
  );
}
