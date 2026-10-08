import { useEffect, useRef, useState, type MouseEvent as RMouseEvent } from 'react';
import { gsap } from 'gsap';
import { img } from '../lib/img';
import { prefersReducedMotion } from '../lib/smooth';
import './FlowingMenu.css';

export interface FlowingMenuItem {
  href: string;
  text: string;
  meta?: string;
  image: string; // unsplash id
}

/**
 * Adapted from the Luxura "Discover by lifestyle" menu: rows that flood with a
 * moving strip of photographs when hovered, entering from the edge the cursor crossed.
 */
export default function FlowingMenu({ items }: { items: FlowingMenuItem[] }) {
  return (
    <nav className="fm" aria-label="Browse by body style">
      {items.map((item) => (
        <MenuItem key={item.text} {...item} />
      ))}
    </nav>
  );
}

function MenuItem({ href, text, meta, image }: FlowingMenuItem) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [reps, setReps] = useState(4);
  const ease = { duration: 0.7, ease: 'expo.out' };

  const edge = (x: number, y: number, w: number, h: number) => {
    const top = (x - w / 2) ** 2 + y ** 2;
    const bottom = (x - w / 2) ** 2 + (y - h) ** 2;
    return top < bottom ? 'top' : 'bottom';
  };

  useEffect(() => {
    const measure = () => {
      const part = innerRef.current?.querySelector<HTMLElement>('.fm__part');
      if (!part) return;
      setReps(Math.max(4, Math.ceil(window.innerWidth / (part.offsetWidth || 1)) + 2));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = window.setTimeout(() => {
      const part = innerRef.current?.querySelector<HTMLElement>('.fm__part');
      if (!part || !innerRef.current) return;
      tween.current?.kill();
      tween.current = gsap.to(innerRef.current, { x: -part.offsetWidth, duration: 16, ease: 'none', repeat: -1 });
      tween.current.pause();
    }, 60);
    return () => {
      window.clearTimeout(t);
      tween.current?.kill();
    };
  }, [reps]);

  const enter = (e: RMouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !innerRef.current) return;
    const r = itemRef.current.getBoundingClientRect();
    const from = edge(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
    tween.current?.play();
    gsap
      .timeline({ defaults: ease })
      .set(marqueeRef.current, { y: from === 'top' ? '-101%' : '101%' }, 0)
      .set(innerRef.current, { y: from === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, innerRef.current], { y: '0%' }, 0);
  };

  const leave = (e: RMouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !innerRef.current) return;
    const r = itemRef.current.getBoundingClientRect();
    const to = edge(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
    gsap
      .timeline({ defaults: ease, onComplete: () => tween.current?.pause() })
      .to(marqueeRef.current, { y: to === 'top' ? '-101%' : '101%' }, 0)
      .to(innerRef.current, { y: to === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div className="fm__item" ref={itemRef}>
      <a className="fm__link wrap" href={href} onMouseEnter={enter} onMouseLeave={leave}>
        <span>{text}</span>
        {meta && <span className="fm__meta t-num">{meta}</span>}
      </a>
      <div className="fm__marquee" ref={marqueeRef} aria-hidden>
        <div className="fm__inner" ref={innerRef}>
          {Array.from({ length: reps }).map((_, i) => (
            <div className="fm__part" key={i}>
              <span>{text}</span>
              <div className="fm__img" style={{ backgroundImage: `url(${img(image, 640, 70)})` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
