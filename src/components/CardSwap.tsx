import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }: any, ref: any) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: ReturnType<typeof makeSlot>, skew: number) => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });
};

interface CardSwapProps {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  paused?: boolean;
  swapOnClick?: boolean;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  easing?: 'elastic' | 'smooth';
  children?: React.ReactNode;
}

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  paused = false,
  swapOnClick = true,
  onCardClick,
  skewAmount = 4,
  easing = 'smooth',
  children
}: CardSwapProps) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.55, 0.85)',
          durDrop: 1.4,
          durMove: 1.4,
          durReturn: 1.4,
          promoteOverlap: 0.85,
          returnDelay: 0.04
        }
      : {
          ease: 'power3.inOut',
          durDrop: 1.05,
          durMove: 1.05,
          durReturn: 1.05,
          promoteOverlap: 0.72,
          returnDelay: 0.08
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const swapRef = useRef<(() => void) | null>(null);
  const pausedRef = useRef(paused);

  pausedRef.current = paused;

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
      }
    });

    const swap = () => {
      if (pausedRef.current || order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=420',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.1}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => {
        gsap.set(elFront, { zIndex: backSlot.zIndex });
      }, undefined, 'return');
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swapRef.current = swap;

    const startInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!pausedRef.current) {
        intervalRef.current = window.setInterval(swap, delay);
      }
    };

    if (!pausedRef.current) {
      swap();
      startInterval();
    }

    if (pauseOnHover && !pausedRef.current) {
      const node = container.current;
      if (node) {
        const pauseAnim = () => {
          tlRef.current?.pause();
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
        const resumeAnim = () => {
          if (pausedRef.current) return;
          tlRef.current?.play();
          startInterval();
        };
        node.addEventListener('mouseenter', pauseAnim);
        node.addEventListener('mouseleave', resumeAnim);
        return () => {
          node.removeEventListener('mouseenter', pauseAnim);
          node.removeEventListener('mouseleave', resumeAnim);
          if (intervalRef.current) clearInterval(intervalRef.current);
          tlRef.current?.kill();
        };
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, childArr.length]);

  useEffect(() => {
    if (paused) {
      tlRef.current?.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (swapRef.current) {
      intervalRef.current = window.setInterval(swapRef.current, delay);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, delay]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...((child.props as Record<string, unknown>).style ?? {}) },
          onClick: (e: React.MouseEvent) => {
            (child.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
            onCardClick?.(i);
            if (swapOnClick && !pausedRef.current && swapRef.current) {
              swapRef.current();
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = window.setInterval(swapRef.current, delay);
            }
          }
        } as Record<string, unknown>)
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
