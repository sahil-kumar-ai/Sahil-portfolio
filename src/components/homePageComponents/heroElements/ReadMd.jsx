import React, { useRef, useEffect, forwardRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/draggable';

gsap.registerPlugin(Draggable);

const ReadMd = forwardRef(
  ({ onClick, onBringToFront, heroZIndex }, ref) => {
    const internalRef = useRef(null);
    const cardRef = ref || internalRef;
    const textRef = useRef(null);

    const dragInstanceRef = useRef(null);
    const startPosRef = useRef({ x: 0, y: 0 });
    const didDragRef = useRef(false);
    const isInitializedRef = useRef(false);

    const onClickRef = useRef(onClick);
    const onBringToFrontRef = useRef(onBringToFront);

    useEffect(() => {
      onClickRef.current = onClick;
    }, [onClick]);

    useEffect(() => {
      onBringToFrontRef.current = onBringToFront;
    }, [onBringToFront]);

    useEffect(() => {
      const el = cardRef.current;
      if (!el) return;

      const getBounds = () => {
        const rect = el.getBoundingClientRect();

        return {
          minX: 20,
          minY: 30,
          maxX: window.innerWidth - rect.width - 20,
          maxY: window.innerHeight - rect.height - 30,
        };
      };

      const clampToBounds = () => {
        const bounds = getBounds();

        const currentX = Number(gsap.getProperty(el, 'x')) || 0;
        const currentY = Number(gsap.getProperty(el, 'y')) || 0;

        gsap.set(el, {
          x: Math.min(Math.max(currentX, bounds.minX), bounds.maxX),
          y: Math.min(Math.max(currentY, bounds.minY), bounds.maxY),
        });
      };

      if (!isInitializedRef.current) {
        const bounds = getBounds();

        gsap.set(el, {
          x: Math.random() * (bounds.maxX - bounds.minX) + bounds.minX,
          y: Math.random() * (bounds.maxY - bounds.minY) + bounds.minY,
        });

        isInitializedRef.current = true;
      } else {
        clampToBounds();
      }

      dragInstanceRef.current?.kill();

      dragInstanceRef.current = Draggable.create(el, {
        type: 'x,y',
        edgeResistance: 0.9,
        inertia: false,
        zIndexBoost: false,
        bounds: getBounds(),
        dragClickables: true,
        allowContextMenu: true,

        onPress() {
          didDragRef.current = false;
          startPosRef.current = {
            x: this.x,
            y: this.y,
          };

          onBringToFrontRef.current?.();
        },

        onDrag() {
          const movedX = Math.abs(this.x - startPosRef.current.x);
          const movedY = Math.abs(this.y - startPosRef.current.y);

          if (movedX > 4 || movedY > 4) {
            didDragRef.current = true;
          }
        },

        onRelease() {
          if (!didDragRef.current) {
            onClickRef.current?.();
          }
        },
      })[0];

      const handleResize = () => {
        const bounds = getBounds();
        dragInstanceRef.current?.applyBounds(bounds);
        clampToBounds();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        dragInstanceRef.current?.kill();
        dragInstanceRef.current = null;
      };
    }, []);

    const handleEnter = () => {
      gsap.to(cardRef.current, {
        backgroundColor: '#ffffff42',
        duration: 0.2,
        ease: 'power2.out',
      });

      gsap.to(textRef.current, {
        backgroundColor: '#579AFF',
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(cardRef.current, {
        backgroundColor: 'rgba(255,255,255,0)',
        duration: 0.2,
        ease: 'power2.out',
      });

      gsap.to(textRef.current, {
        color: '#ffffff',
        backgroundColor: 'rgba(59,130,246,0)',
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    return (
      <div
        ref={cardRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ zIndex: heroZIndex || 0, touchAction: 'none' }}
        className="absolute top-0 left-0 w-43 h-48 rounded-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none"
      >
        <div className="w-full flex justify-center -translate-y-1.25">
          <video
            className="w-39 rounded-2xl mt-2 shadow-[0_2px_7px_rgba(0,0,0,0.25)] pointer-events-none"
            src="../assets/heroSectionPics/duck_feet.webm"
            muted
            autoPlay
            loop
            playsInline
          />
        </div>

        <div className="pt-1 pointer-events-none">
          <h1
            ref={textRef}
            className="text-center py-1 flex flex-col items-center justify-center text-xs h-5 w-15 -translate-y-1 rounded-md text-white font-medium [text-shadow:0_0_4px_rgba(0,0,0,0.8)]"
          >
            Read.MD
          </h1>
        </div>
      </div>
    );
  }
);

export default ReadMd;