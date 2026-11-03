import { useEffect, useRef, useState } from 'react';
import './BounceCards.css';

const PATTERN = [1, 0.5, -0.3, -1, 0.2, 0.75, -0.6, 0.35, -0.85, 0.1];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const parseTransform = value => {
  if (typeof value !== 'string') return null;
  const rotate = value.match(/rotate\(\s*(-?[\d.]+)deg\s*\)/);
  const translate = value.match(/translate\(\s*(-?[\d.]+)px(?:\s*,\s*(-?[\d.]+)px)?\s*\)/);
  return {
    x: translate ? Number(translate[1]) : 0,
    y: translate && translate[2] ? Number(translate[2]) : 0,
    rotate: rotate ? Number(rotate[1]) : 0
  };
};

const toCard = item => {
  if (typeof item === 'string') {
    const isImg =
      item.startsWith('http') ||
      item.startsWith('data:') ||
      item.startsWith('/') ||
      /\.(png|jpe?g|svg|webp|gif)$/i.test(item);
    if (isImg) {
      return { src: item, alt: '' };
    }
    return { trait: item, alt: item };
  }
  return {
    src: item?.src,
    trait: item?.trait || item?.text || item?.title,
    alt: item?.alt ?? item?.trait ?? ''
  };
};

export default function BounceCards({
  images = [],
  traits = [],
  className = '',
  style,
  containerWidth = 500,
  containerHeight = 320,
  cardSize = 200,
  aspectRatio = '1.35 / 1',
  spread = 85,
  rotation = 10,
  arc = 0,
  animationDelay = 0.5,
  animationStagger = 0.06,
  bounciness = 0.6,
  enableHover = true,
  pushDistance = 160,
  hoverScale = 1.06,
  borderWidth = 1,
  borderColor,
  cardBg,
  radius = 22,
  shadow = true,
  transformStyles,
  onCardClick
}) {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const wakeRef = useRef(null);
  const [measuredWidth, setMeasuredWidth] = useState(() =>
    typeof window !== 'undefined'
      ? Math.min(
          typeof containerWidth === 'number' ? containerWidth : 380,
          Math.max(260, window.innerWidth - 32)
        )
      : typeof containerWidth === 'number'
        ? containerWidth
        : 380
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const updateSize = () => {
      const parentW = root.parentElement?.clientWidth || window.innerWidth - 32;
      const maxW = typeof containerWidth === 'number' ? containerWidth : parentW;
      const nextW = Math.max(250, Math.min(maxW, parentW, window.innerWidth - 28));
      setMeasuredWidth(prev => (Math.abs(prev - nextW) > 0.5 ? nextW : prev));
    };

    updateSize();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateSize) : null;
    if (ro) {
      ro.observe(root);
      if (root.parentElement) ro.observe(root.parentElement);
    }
    window.addEventListener('resize', updateSize);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [containerWidth]);

  const rawList = traits && traits.length > 0 ? traits : images;
  const cards = rawList.map(toCard);
  const count = cards.length;
  const middle = (count - 1) / 2;
  const reach = Math.max(1, middle);

  const baseWidth = typeof containerWidth === 'number' ? containerWidth : 380;
  const isCompact =
    typeof window !== 'undefined' ? window.innerWidth <= 768 || measuredWidth < baseWidth - 8 : false;
  const widthRatio = clamp(measuredWidth / baseWidth, 0.62, 1);

  const effectiveCardSize = isCompact
    ? Math.round(clamp(cardSize * widthRatio * 0.84, 108, cardSize))
    : Math.max(10, cardSize);
  const effectiveHoverScale = clamp(hoverScale, 0.5, 2);

  // Maximum safe horizontal center position so no card edge ever exceeds the screen/container
  const halfCardRendered = (effectiveCardSize * effectiveHoverScale) / 2 + 6;
  const maxSafeCenter = isCompact
    ? Math.max(36, measuredWidth / 2 - halfCardRendered)
    : Math.max(120, (typeof window !== 'undefined' ? window.innerWidth / 2 : 600) - halfCardRendered - 16);

  const effectiveSpread = isCompact
    ? Math.min(spread * widthRatio * 0.82, (maxSafeCenter * 0.76) / reach)
    : spread;

  const effectivePush = isCompact
    ? Math.min(pushDistance * widthRatio * 0.65, maxSafeCenter * 0.58)
    : pushDistance;

  const slots = cards.map((_, i) => {
    const custom = transformStyles ? parseTransform(transformStyles[i]) : null;
    if (custom) return custom;
    const offset = i - middle;
    return {
      x: offset * effectiveSpread,
      y: arc * (offset / reach) ** 2,
      rotate: rotation * PATTERN[i % PATTERN.length]
    };
  });

  const settings = {
    slots,
    cardSize: effectiveCardSize,
    maxSafeCenter,
    isCompact,
    delay: Math.max(0, animationDelay),
    stagger: Math.max(0, animationStagger),
    bounciness: clamp(bounciness, 0, 1),
    enableHover,
    pushDistance: effectivePush,
    hoverScale: effectiveHoverScale,
    clickable: typeof onCardClick === 'function'
  };

  const settingsRef = useRef(settings);
  const clickRef = useRef(onCardClick);

  useEffect(() => {
    settingsRef.current = settings;
    clickRef.current = onCardClick;
    wakeRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const bodies = [];
    const state = { hovered: -1, time: 0, layer: -1 };
    let raf = 0;
    let last = 0;
    let alive = true;

    const body = i => {
      if (!bodies[i]) {
        const slot = settingsRef.current.slots[i] ?? { x: 0, y: 0, rotate: 0 };
        bodies[i] = {
          x: slot.x,
          y: slot.y,
          rotate: slot.rotate,
          scale: reduce ? 1 : 0,
          vx: 0,
          vy: 0,
          vr: 0,
          vs: 0,
          born: state.time
        };
      }
      return bodies[i];
    };

    const step = (value, velocity, target, stiffness, damping, dt) => {
      const next = velocity + ((target - value) * stiffness - velocity * damping) * dt;
      return [value + next * dt, next];
    };

    const frame = now => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000));
      last = now;
      state.time += dt;

      const hovered = s.enableHover ? state.hovered : -1;
      const popStiffness = 170;
      const popDamping = 2 * (1 - 0.85 * s.bounciness) * Math.sqrt(popStiffness);
      const moveStiffness = 210;
      const moveDamping = 2 * (reduce ? 1 : 0.72) * Math.sqrt(moveStiffness);
      const substeps = Math.ceil(dt / (1 / 240));
      const h = dt / substeps;
      let moving = 0;

      // Precompute desired X targets and clamp/re-center within safe screen bounds
      const countSlots = s.slots.length;
      const targetXs = new Array(countSlots);
      for (let i = 0; i < countSlots; i++) {
        const slot = s.slots[i];
        const card = body(i);
        const appeared = reduce || state.time - card.born >= s.delay + i * s.stagger;
        if (hovered >= 0 && appeared && i !== hovered) {
          targetXs[i] = slot.x + Math.sign(i - hovered) * s.pushDistance;
        } else {
          targetXs[i] = slot.x;
        }
      }

      if (hovered >= 0 && countSlots > 1 && s.maxSafeCenter) {
        const limit = s.maxSafeCenter;
        let minX = targetXs[0];
        let maxX = targetXs[countSlots - 1];
        const span = maxX - minX;
        const maxSpan = limit * 2;

        if (span > maxSpan && span > 0) {
          const mid = (minX + maxX) / 2;
          const factor = maxSpan / span;
          for (let i = 0; i < countSlots; i++) {
            targetXs[i] = (targetXs[i] - mid) * factor;
          }
        } else {
          let shift = 0;
          if (maxX > limit) shift = limit - maxX;
          else if (minX < -limit) shift = -limit - minX;
          if (shift !== 0) {
            for (let i = 0; i < countSlots; i++) {
              targetXs[i] = clamp(targetXs[i] + shift, -limit, limit);
            }
          }
        }
      }

      for (let i = 0; i < countSlots; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const card = body(i);
        const slot = s.slots[i];
        const appeared = reduce || state.time - card.born >= s.delay + i * s.stagger;
        const targetX = targetXs[i];
        let targetY = slot.y;
        let targetRotate = slot.rotate;
        let targetScale = appeared ? 1 : 0;
        if (hovered >= 0 && appeared && i === hovered) {
          targetY = slot.y - s.cardSize * 0.04;
          targetRotate = 0;
          targetScale = s.hoverScale;
        }
        for (let k = 0; k < substeps; k++) {
          [card.x, card.vx] = step(card.x, card.vx, targetX, moveStiffness, moveDamping, h);
          [card.y, card.vy] = step(card.y, card.vy, targetY, moveStiffness, moveDamping, h);
          [card.rotate, card.vr] = step(card.rotate, card.vr, targetRotate, moveStiffness, moveDamping, h);
          if (reduce) {
            card.scale = targetScale;
            card.vs = 0;
          } else {
            [card.scale, card.vs] = step(card.scale, card.vs, targetScale, popStiffness, popDamping, h);
          }
        }
        moving +=
          Math.abs(card.vx) +
          Math.abs(card.vy) +
          Math.abs(card.vr) +
          Math.abs(card.vs) * 100 +
          Math.abs(targetX - card.x) +
          Math.abs(targetY - card.y) +
          Math.abs(targetRotate - card.rotate) +
          Math.abs(targetScale - card.scale) * 100 +
          (appeared ? 0 : 1);
        el.style.transform = `translate(-50%, -50%) translate3d(${card.x.toFixed(2)}px, ${card.y.toFixed(2)}px, 0) rotate(${card.rotate.toFixed(3)}deg) scale(${Math.max(0, card.scale).toFixed(4)})`;
      }

      if (state.layer !== hovered) {
        state.layer = hovered;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.zIndex = i === hovered ? String(s.slots.length + 1) : String(i + 1);
          el.toggleAttribute('data-active', i === hovered);
        });
      }

      if (moving > 0.02) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const pick = event => {
      const s = settingsRef.current;
      const rect = root.getBoundingClientRect();
      const px = event.clientX - rect.left - rect.width / 2;
      const py = event.clientY - rect.top - rect.height / 2;
      let best = -1;
      let distance = Infinity;
      s.slots.forEach((slot, i) => {
        const gap = Math.abs(px - slot.x);
        if (gap < distance) {
          distance = gap;
          best = i;
        }
      });
      if (best < 0) return -1;
      const slot = s.slots[best];
      const half = s.cardSize / 2;
      if (Math.abs(py - slot.y) > half + 12 || distance > half + 12) return -1;
      if (state.hovered >= 0 && state.hovered !== best) {
        const current = s.slots[state.hovered];
        if (current && Math.abs(px - current.x) - distance < 6) return state.hovered;
      }
      return best;
    };

    const onMove = event => {
      const next = pick(event);
      if (next !== state.hovered) {
        state.hovered = next;
        wake();
      }
    };
    const onLeave = () => {
      if (state.hovered !== -1) {
        state.hovered = -1;
        wake();
      }
    };
    const onClick = event => {
      const index = pick(event);
      if (index < 0) return;
      const card = bodies[index];
      if (card && !reduce) card.vs -= 2.2;
      wake();
      clickRef.current?.(index);
    };
    const onFocus = event => {
      const index = cardRefs.current.indexOf(event.target);
      if (index >= 0) {
        state.hovered = index;
        wake();
      }
    };
    const onKey = event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const index = cardRefs.current.indexOf(event.target);
      if (index < 0 || !settingsRef.current.clickable) return;
      event.preventDefault();
      if (bodies[index] && !reduce) bodies[index].vs -= 2.2;
      wake();
      clickRef.current?.(index);
    };

    const onOutsidePointerDown = event => {
      if (state.hovered !== -1 && !root.contains(event.target)) {
        state.hovered = -1;
        wake();
      }
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerdown', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('click', onClick);
    root.addEventListener('focusin', onFocus);
    root.addEventListener('focusout', onLeave);
    root.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutsidePointerDown);
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerdown', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('click', onClick);
      root.removeEventListener('focusin', onFocus);
      root.removeEventListener('focusout', onLeave);
      root.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutsidePointerDown);
    };
  }, []);

  const parsedAspect = typeof aspectRatio === 'number' ? `${aspectRatio} / 1` : aspectRatio;
  const effectiveHeight =
    typeof containerHeight === 'number' && isCompact
      ? Math.round(clamp(containerHeight * widthRatio * 0.85, 155, containerHeight))
      : containerHeight;

  return (
    <div
      ref={rootRef}
      className={`bounce-cards${className ? ` ${className}` : ''}`}
      style={{
        width: isCompact ? '100%' : typeof containerWidth === 'number' ? `${containerWidth}px` : containerWidth,
        maxWidth: typeof containerWidth === 'number' ? `${containerWidth}px` : containerWidth,
        height: typeof effectiveHeight === 'number' ? `${effectiveHeight}px` : effectiveHeight,
        '--bounce-cards-size': `${settings.cardSize}px`,
        '--bounce-cards-aspect': parsedAspect,
        '--bounce-cards-border': `${Math.max(0, borderWidth)}px`,
        ...(borderColor ? { '--bounce-cards-border-color': borderColor } : {}),
        ...(cardBg ? { '--bounce-cards-bg': cardBg } : {}),
        '--bounce-cards-radius': `${Math.max(0, isCompact ? Math.round(radius * 0.82) : radius)}px`,
        '--bounce-cards-shadow': shadow
          ? '0 1px 2px rgba(0, 0, 0, 0.12), 0 10px 28px -6px rgba(0, 0, 0, 0.32)'
          : 'none',
        '--bounce-cards-shadow-active': shadow
          ? '0 2px 4px rgba(0, 0, 0, 0.14), 0 22px 44px -10px rgba(0, 0, 0, 0.42)'
          : 'none',
        ...style
      }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          ref={el => {
            cardRefs.current[i] = el;
          }}
          className={`bounce-cards__card${settings.clickable ? ' bounce-cards__card--clickable' : ''}`}
          style={{ zIndex: i + 1 }}
          {...(settings.clickable
            ? { role: 'button', tabIndex: 0, 'aria-label': card.alt || card.trait || `Card ${i + 1}` }
            : null)}
        >
          {card.src ? (
            <img src={card.src} alt={card.alt} draggable={false} />
          ) : (
            <div className="bounce-cards__trait-card">
              <span className="bounce-cards__trait-label">TRAIT</span>
              <span className="bounce-cards__trait-title">{card.trait}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
