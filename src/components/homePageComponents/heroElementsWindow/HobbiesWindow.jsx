import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/draggable';
import Lenis from 'lenis';

gsap.registerPlugin(Draggable);

const HOBBIES = [
    { label: 'Coffee', tag: 'Daily Ritual', desc: 'Coffee is not just a drink. It is a ritual that sets the tone for the day. The smell, the warmth, and the stillness before everything begins make it feel grounding in a way very few things do.' },
    { label: 'Anime', tag: 'Storytelling', desc: 'Anime stands out because of how far it can go with emotion, atmosphere, and narrative depth. It can be intense, quiet, philosophical, or brutal, often in ways that live-action rarely achieves with the same consistency.' },
    { label: 'Fast Food', tag: 'Simple Comfort', desc: 'There is something direct and reliable about fast food. It does not pretend to be more than it is. Sometimes that simplicity is exactly what makes it satisfying.' },
    { label: 'Walking', tag: 'Clarity', desc: 'Walking helps clear mental noise. It is one of the easiest ways to think better, reset focus, and let ideas settle naturally without forcing them.' },
    { label: 'Coding', tag: 'Creating', desc: 'Coding feels like building something from nothing. It combines logic, experimentation, frustration, and satisfaction in a way that keeps it endlessly engaging.' },
];

const HobbiesWindow = ({ isOpen, isMinimized, offset, zIndex, onClose, onMinimize, onFocus, iconRef, actionRef }) => {
  const popupRef = useRef(null);
  const popupBodyRef = useRef(null);
  const popupDraggableRef = useRef(null);
  const titleBarRef = useRef(null);
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  const scrollTrackRef = useRef(null);
  const scrollThumbRef = useRef(null);
  const isDraggingThumb = useRef(false);
  const thumbDragStartY = useRef(0);
  const thumbDragStartTop = useRef(0);

  const [windowMode, setWindowMode] = useState('default');
  const preMaximizeState = useRef(null);
  const preMinimizeState = useRef({ x: 0, y: 0 });

  const setupDraggable = useCallback(() => {
    popupDraggableRef.current?.kill();
    const popup = popupRef.current;
    if (!popup || !popupRef.current) return;
    const popupW = popup.offsetWidth; const popupH = popup.offsetHeight;
    const getBounds = () => ({
      minX: -(window.innerWidth / 2) + popupW / 2 + 20, minY: -(window.innerHeight / 2) + popupH / 2 + 20,
      maxX: (window.innerWidth / 2) - popupW / 2 - 20, maxY: (window.innerHeight / 2) - popupH / 2 - 20,
    });
    popupDraggableRef.current = Draggable.create(popup, { type: 'x,y', trigger: popupRef.current, edgeResistance: 0.85, zIndexBoost: 0, bounds: getBounds() })[0];
    const resizeHandler = () => popupDraggableRef.current?.applyBounds(getBounds());
    window.addEventListener('resize', resizeHandler);
    popup._resizeHandler = resizeHandler;
  }, []);

  useEffect(() => {
    if (!isOpen || !popupBodyRef.current) return;
    const wrapper = popupBodyRef.current;
    const lenis = new Lenis({ wrapper, content: wrapper.firstElementChild, duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2, infinite: false });
    lenisRef.current = lenis;
    lenis.on('scroll', ({ scroll, limit }) => { const thumb = scrollThumbRef.current; const track = scrollTrackRef.current; if (!thumb || !track) return; const scrollable = track.clientHeight - thumb.clientHeight; gsap.set(thumb, { y: (limit === 0 ? 0 : scroll / limit) * scrollable }); });
    function raf(time) { lenis.raf(time); rafRef.current = requestAnimationFrame(raf); }
    rafRef.current = requestAnimationFrame(raf);
    const setThumbSize = () => { const thumb = scrollThumbRef.current; const track = scrollTrackRef.current; if (!thumb || !track) return; gsap.set(thumb, { height: Math.max(40, track.clientHeight * (wrapper.clientHeight / (wrapper.firstElementChild?.scrollHeight || 1))) }); };
    const t = setTimeout(setThumbSize, 50);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); lenis.destroy(); lenisRef.current = null; };
  }, [isOpen]);

  useEffect(() => {
    const thumb = scrollThumbRef.current; const track = scrollTrackRef.current; if (!thumb || !track) return;
    const onMouseDown = (e) => { e.preventDefault(); isDraggingThumb.current = true; thumbDragStartY.current = e.clientY; thumbDragStartTop.current = Number(gsap.getProperty(thumb, 'y')) || 0; document.body.style.userSelect = 'none'; };
    const onMouseMove = (e) => { if (!isDraggingThumb.current || !lenisRef.current) return; const delta = e.clientY - thumbDragStartY.current; const scrollable = track.clientHeight - thumb.clientHeight; const newTop = Math.min(Math.max(0, thumbDragStartTop.current + delta), scrollable); gsap.set(thumb, { y: newTop }); lenisRef.current.scrollTo((scrollable === 0 ? 0 : newTop / scrollable) * lenisRef.current.limit, { immediate: true }); };
    const onMouseUp = () => { isDraggingThumb.current = false; document.body.style.userSelect = ''; };
    thumb.addEventListener('mousedown', onMouseDown); window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp);
    return () => { thumb.removeEventListener('mousedown', onMouseDown); window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !popupRef.current) return;
    const popup = popupRef.current;
    gsap.set(popup, { xPercent: -50, yPercent: -50, x: offset, y: offset, opacity: 0, scale: 0.96, visibility: 'visible', pointerEvents: 'auto', width: '50vw', height: '50vh', borderRadius: '24px' });
    gsap.to(popup, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' });
    setWindowMode('default'); preMaximizeState.current = null;
    const frame = requestAnimationFrame(() => { setupDraggable(); });
    return () => { cancelAnimationFrame(frame); if (popup._resizeHandler) window.removeEventListener('resize', popup._resizeHandler); popupDraggableRef.current?.kill(); popupDraggableRef.current = null; };
  }, [isOpen, offset, setupDraggable]);

  const closePopup = useCallback(() => {
    if (!popupRef.current) { onClose(); return; }
    gsap.to(popupRef.current, { opacity: 0, scale: 0.96, duration: 0.18, ease: 'power2.inOut', onComplete: () => { onClose(); setWindowMode('default'); preMaximizeState.current = null; } });
  }, [onClose]);

  const handleMinimize = useCallback(() => {
    const popup = popupRef.current; const card = iconRef?.current;
    if (!popup || !card) { closePopup(); return; }
    preMinimizeState.current = { x: Number(gsap.getProperty(popup, 'x')), y: Number(gsap.getProperty(popup, 'y')) };
    const cardRect = card.getBoundingClientRect(); const popupRect = popup.getBoundingClientRect();
    const curX = preMinimizeState.current.x; const curY = preMinimizeState.current.y;
    popupDraggableRef.current?.kill();
    gsap.to(popup, {
      x: curX + (cardRect.left + cardRect.width / 2 - (popupRect.left + popupRect.width / 2)),
      y: curY + (cardRect.top + cardRect.height / 2 - (popupRect.top + popupRect.height / 2)),
      scale: 0.05, opacity: 0, duration: 0.4, ease: 'power3.inOut',
      onComplete: () => { gsap.set(popup, { visibility: 'hidden', pointerEvents: 'none' }); onMinimize(); },
    });
  }, [iconRef, onMinimize, closePopup]);

  const handleRestore = useCallback(() => {
    const popup = popupRef.current; if (!popup) return;
    gsap.set(popup, { visibility: 'visible', pointerEvents: 'auto' });
    gsap.to(popup, { x: preMinimizeState.current.x, y: preMinimizeState.current.y, scale: 1, opacity: 1, duration: 0.4, ease: 'power3.inOut', onComplete: () => { if (windowMode !== 'maximized') setupDraggable(); } });
  }, [windowMode, setupDraggable]);

  const toggleMaximize = useCallback(() => {
    const popup = popupRef.current;
    if (!popup) return;
  
    if (windowMode === 'maximized') {
      const saved = preMaximizeState.current;
      if (!saved) return;
  
      popupDraggableRef.current?.kill();
  
      gsap.to(popup, {
        width: saved.width,
        height: saved.height,
        x: saved.x,
        y: saved.y,
        scale: 1,
        borderRadius: saved.borderRadius || '24px',
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          setWindowMode('default');
          setupDraggable();
        },
      });
    } else {
      const rect = popup.getBoundingClientRect();
  
      preMaximizeState.current = {
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        x: Number(gsap.getProperty(popup, 'x')),
        y: Number(gsap.getProperty(popup, 'y')),
        borderRadius: gsap.getProperty(popup, 'borderRadius') || '24px',
      };
  
      popupDraggableRef.current?.kill();
  
      gsap.to(popup, {
        width: '90vw',
        height: '85vh',
        scale: 1,
        borderRadius: '12px',
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          setWindowMode('maximized');
          setupDraggable();
        },
      });
    }
  }, [windowMode, setupDraggable]);

  useEffect(() => { if (actionRef?.current) { actionRef.current.minimize = handleMinimize; actionRef.current.restore = handleRestore; } }, [handleMinimize, handleRestore, actionRef]);

  if (!isOpen) return null;

  return (
    <div ref={popupRef} className="fixed bg-[#f3f3f3] rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.22)] border border-[#d8d8d8] overflow-hidden"
      style={{ width: '50vw', height: '50vh', maxWidth: '1600px', zIndex, top: '50%', left: '50%', pointerEvents: 'auto' }} onMouseDown={onFocus}>

      <div ref={titleBarRef} className="h-11 bg-[#f3f3f3] border-b border-[#e1e1e1] flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none">
        <div className="absolute left-5 flex items-center gap-2.5">
          <button onClick={closePopup} className="w-4 h-4 rounded-full bg-[#ff5f57] cursor-pointer" aria-label="Close" />
          <button onClick={handleMinimize} className="w-4 h-4 rounded-full bg-[#febc2e] cursor-pointer" aria-label="Minimize" />
          <button onClick={toggleMaximize} className="w-4 h-4 rounded-full bg-[#28c840] cursor-pointer" aria-label="Maximize" />
        </div>
        <h1 className="text-[18px] font-semibold text-[#3f4b5d]">Hobbies</h1>
      </div>

      <div className="relative flex" style={{ height: 'calc(100% - 44px)' }}>
        <div ref={popupBodyRef} className="flex-1 overflow-hidden" style={{ height: '100%' }}>
          <div className="font-mono text-[#303846]">
            <div className="px-8 pt-7 pb-5">
              <h1 className="text-[22px] font-semibold tracking-tight text-[#1a1a2e] mb-2">Things I genuinely enjoy</h1>
              <p className="text-[12px] text-[#7f8792] leading-[1.9] max-w-180">Not selected to impress anyone. Just the few things that actually stay part of daily life.</p>
            </div>
            <hr className="border-[#dddddd]" />
            <div className="px-8 py-3">
              {HOBBIES.map((item, index) => (
                <div key={item.label}>
                  <div className="py-5">
                    <div className="flex items-start justify-between gap-6 mb-2.5">
                      <div>
                        <h2 className="text-[16px] font-semibold text-[#1f2937] tracking-tight">{item.label}</h2>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-[#8c96a3] mt-1">{item.tag}</p>
                      </div>
                    </div>
                    <p className="text-[13.5px] leading-loose text-[#4b5563] max-w-205">{item.desc}</p>
                  </div>
                  {index !== HOBBIES.length - 1 && <hr className="border-0 h-px bg-[#e7e7e7]" />}
                </div>
              ))}
              <div className="pt-6 pb-2"><p className="text-[11px] uppercase tracking-[0.22em] text-[#9ca3af]">Personal Notes</p></div>
              <p className="pb-8 text-[13px] leading-loose text-[#6b7280] max-w-215">
                Most interests come and go. The ones listed here have stayed consistent because they do something useful:
                they help with focus, reset energy, or make the day better in a simple way.
              </p>
            </div>
          </div>
        </div>

        <div ref={scrollTrackRef} className="absolute right-0 top-0 bottom-0 flex items-start justify-center" style={{ width: '14px', padding: '8px 0', background: 'transparent' }}>
          <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 rounded-full" style={{ width: '2px', background: 'rgba(0,0,0,0.06)' }} />
          <div ref={scrollThumbRef} className="absolute left-1/2 -translate-x-1/2 rounded-full cursor-pointer"
            style={{ width: '4px', height: '60px', top: '8px', background: 'rgba(0,0,0,0.18)', transition: 'width 0.2s ease, background 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.width = '6px'; e.currentTarget.style.background = 'rgba(0,0,0,0.38)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.width = '4px'; e.currentTarget.style.background = 'rgba(0,0,0,0.18)'; }} />
        </div>
      </div>
    </div>
  );
};

export default HobbiesWindow;