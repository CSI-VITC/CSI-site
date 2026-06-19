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
const placeNow = (el: any, slot: any, skew: number) => {
  if (!el) return null;
  return gsap.set(el, {
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

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}: any) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const container = useRef<HTMLDivElement>(null);
  const swapRef = useRef<(() => void) | null>(null);

  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, currentX: 0, currentY: 0 });
  const wasDragged = useRef(false);
  const activeDragIndex = useRef<number | null>(null);

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>, index: number) => {
    if (e.button !== 0) return; // only left click / touch
    
    // Pause automatic swap
    clearInterval(intervalRef.current);
    
    if (tlRef.current && tlRef.current.isActive()) return;

    activeDragIndex.current = index;
    const el = refs[index]?.current;
    if (!el) return;
    
    el.setPointerCapture(e.pointerId);
    wasDragged.current = false;
    
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      currentX: 0,
      currentY: 0
    };
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging || activeDragIndex.current === null) return;
    
    const index = activeDragIndex.current;
    const el = refs[index]?.current;
    if (!el) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    dragRef.current.currentX = deltaX;
    dragRef.current.currentY = deltaY;

    const dragDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (dragDist > 6) {
      wasDragged.current = true;
    }

    if (wasDragged.current) {
      const rotate = deltaX * 0.04;
      const skew = skewAmount + deltaY * 0.015;
      
      const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
      gsap.set(el, {
        x: frontSlot.x + deltaX,
        y: frontSlot.y + deltaY,
        z: frontSlot.z + 40, // lift slightly
        rotation: rotate,
        skewY: skew,
        cursor: "grabbing"
      });
    }
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging || activeDragIndex.current === null) return;
    
    const index = activeDragIndex.current;
    const el = refs[index]?.current;
    if (el) {
      el.releasePointerCapture(e.pointerId);
      el.style.cursor = "";
    }

    const { currentX, currentY } = dragRef.current;
    dragRef.current.isDragging = false;
    activeDragIndex.current = null;

    const dragDistance = Math.sqrt(currentX * currentX + currentY * currentY);

    if (wasDragged.current && dragDistance > 85) {
      // Swipe/Flick detected!
      triggerDragSwap(index, currentX, currentY);
    } else {
      // Snaps back
      const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
      gsap.to(el, {
        x: frontSlot.x,
        y: frontSlot.y,
        z: frontSlot.z,
        rotation: 0,
        skewY: skewAmount,
        duration: 0.7,
        ease: "elastic.out(1.1, 0.65)",
        onComplete: () => {
          clearInterval(intervalRef.current);
          intervalRef.current = window.setInterval(swapRef.current || (() => {}), delay);
        }
      });
    }
  };

  const triggerDragSwap = (frontIndex: number, dragX: number, dragY: number) => {
    if (order.current.length < 2) return;

    const [front, ...rest] = order.current;
    const elFront = refs[front]?.current;
    if (!elFront || typeof elFront !== 'object' || !('nodeType' in elFront)) return;

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Throw out in drag direction
    const angle = Math.atan2(dragY, dragX);
    const throwDist = 450;
    const throwX = Math.cos(angle) * throwDist;
    const throwY = Math.sin(angle) * throwDist;

    tl.to(elFront, {
      x: `+=${throwX}`,
      y: `+=${throwY}`,
      rotation: dragX * 0.12,
      opacity: 0,
      duration: 0.45,
      ease: "power2.out"
    });

    tl.addLabel('promote', '-=0.35');
    rest.forEach((idx, i) => {
      const el = refs[idx]?.current;
      if (!el || typeof el !== 'object' || !('nodeType' in el)) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
      tl.set(el, { zIndex: slot.zIndex }, 'promote');
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.durMove * 0.5,
          ease: config.ease
        },
        `promote+=${i * 0.1}`
      );
    });

    const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
    tl.addLabel('return', 'promote+=0.15');
    tl.call(
      () => {
        if (elFront) {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        }
      },
      undefined,
      'return'
    );
    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        rotation: 0,
        skewY: skewAmount,
        opacity: 1,
        duration: config.durReturn * 0.5,
        ease: "power2.inOut"
      },
      'return'
    );

    tl.call(() => {
      order.current = [...rest, front];
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(swapRef.current || (() => {}), delay);
    });
  };

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
      }
    });

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront || typeof elFront !== 'object' || !('nodeType' in elFront)) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el || typeof el !== 'object' || !('nodeType' in el)) return;
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
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          if (elFront) {
            gsap.set(elFront, { zIndex: backSlot.zIndex });
          }
        },
        undefined,
        'return'
      );
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

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      if (node) {
        const pause = () => {
          tlRef.current?.pause();
          clearInterval(intervalRef.current);
        };
        const resume = () => {
          tlRef.current?.play();
          intervalRef.current = window.setInterval(swapRef.current || swap, delay);
        };
        node.addEventListener('mouseenter', pause);
        node.addEventListener('mouseleave', resume);
        return () => {
          node.removeEventListener('mouseenter', pause);
          node.removeEventListener('mouseleave', resume);
          clearInterval(intervalRef.current);
          tlRef.current?.kill();
        };
      }
    }
    return () => {
      clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) => {
    const isFront = order.current[0] === i;
    return isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, touchAction: "none", ...((child.props as any).style ?? {}) },
          onPointerDown: isFront ? (e: any) => handleDragStart(e, i) : undefined,
          onPointerMove: isFront ? (e: any) => handleDragMove(e) : undefined,
          onPointerUp: isFront ? (e: any) => handleDragEnd(e) : undefined,
          onClick: (e: any) => {
            if (wasDragged.current) {
              e.preventDefault();
              return;
            }
            (child.props as any).onClick?.(e);
            onCardClick?.(i);
            if (swapRef.current) {
              swapRef.current();
              clearInterval(intervalRef.current);
              intervalRef.current = window.setInterval(swapRef.current, delay);
            }
          }
        } as any)
      : child;
  });

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
