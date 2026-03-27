import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/draggable';
import Lenis from 'lenis';

gsap.registerPlugin(Draggable);

const ContentCreatorWindow = ({ isOpen, isMinimized, offset, zIndex, onClose, onMinimize, onFocus, iconRef, actionRef }) => {
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

    const popupW = popup.offsetWidth;
    const popupH = popup.offsetHeight;

    const getBounds = () => ({
      minX: -(window.innerWidth / 2) + popupW / 2 + 20,
      minY: -(window.innerHeight / 2) + popupH / 2 + 20,
      maxX: (window.innerWidth / 2) - popupW / 2 - 20,
      maxY: (window.innerHeight / 2) - popupH / 2 - 20,
    });

    popupDraggableRef.current = Draggable.create(popup, {
      type: 'x,y',
      trigger: popupRef.current,
      edgeResistance: 0.85,
      zIndexBoost: 0,
      bounds: getBounds(),
    })[0];

    const resizeHandler = () => popupDraggableRef.current?.applyBounds(getBounds());
    window.addEventListener('resize', resizeHandler);
    popup._resizeHandler = resizeHandler;
  }, []);

  useEffect(() => {
    if (!isOpen || !popupBodyRef.current) return;
    const wrapper = popupBodyRef.current;
    const lenis = new Lenis({
      wrapper, content: wrapper.firstElementChild,
      duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2, infinite: false,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ({ scroll, limit }) => {
      const thumb = scrollThumbRef.current; const track = scrollTrackRef.current;
      if (!thumb || !track) return;
      const trackH = track.clientHeight; const thumbH = thumb.clientHeight;
      const scrollable = trackH - thumbH;
      gsap.set(thumb, { y: (limit === 0 ? 0 : scroll / limit) * scrollable });
    });
    function raf(time) { lenis.raf(time); rafRef.current = requestAnimationFrame(raf); }
    rafRef.current = requestAnimationFrame(raf);
    const setThumbSize = () => {
      const thumb = scrollThumbRef.current; const track = scrollTrackRef.current;
      if (!thumb || !track) return;
      const ratio = wrapper.clientHeight / (wrapper.firstElementChild?.scrollHeight || 1);
      gsap.set(thumb, { height: Math.max(40, track.clientHeight * ratio) });
    };
    const t = setTimeout(setThumbSize, 50);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); lenis.destroy(); lenisRef.current = null; };
  }, [isOpen]);

  useEffect(() => {
    const thumb = scrollThumbRef.current; const track = scrollTrackRef.current;
    if (!thumb || !track) return;
    const onMouseDown = (e) => { e.preventDefault(); isDraggingThumb.current = true; thumbDragStartY.current = e.clientY; thumbDragStartTop.current = Number(gsap.getProperty(thumb, 'y')) || 0; document.body.style.userSelect = 'none'; };
    const onMouseMove = (e) => {
      if (!isDraggingThumb.current || !lenisRef.current) return;
      const delta = e.clientY - thumbDragStartY.current;
      const scrollable = track.clientHeight - thumb.clientHeight;
      const newTop = Math.min(Math.max(0, thumbDragStartTop.current + delta), scrollable);
      gsap.set(thumb, { y: newTop });
      lenisRef.current.scrollTo((scrollable === 0 ? 0 : newTop / scrollable) * lenisRef.current.limit, { immediate: true });
    };
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
        <h1 className="text-[18px] font-semibold text-[#3f4b5d]">Content Creator</h1>
      </div>

      <div className="relative flex" style={{ height: 'calc(100% - 44px)' }}>
        <div ref={popupBodyRef} className="flex-1 overflow-hidden" style={{ height: '100%' }}>
          <div className="font-mono text-[#303846]">

            <div className="w-full bg-[#F3F3F3] flex items-center justify-center overflow-hidden">
              <img src="../assets/heroSectionPics/Youtube.png" alt="JoyfulOasis YouTube Channel" className="w-full h-auto object-contain block" style={{ maxHeight: '260px', maxWidth: '200' }} />
            </div>

            <hr className='border-[#c7c7c77c] w-189.5' />

            <div className="px-8 pt-2 pb-2">
              <div className="flex items-center gap-4">
                <a href="https://www.youtube.com/@JoyfulOasis" target="_blank" rel="noopener noreferrer"
                  className="w-13 h-13 rounded-full overflow-hidden shrink-0 block border border-[#d9d9d9] shadow-sm hover:scale-[1.03] transition-transform duration-200"
                  style={{ textDecoration: "none" }}>
                  <img src="../assets/heroSectionPics/Logo.jpg" alt="JoyfulOasis Logo" className="w-full h-full object-cover block" />
                </a>
                <div>
                  <h2 className="text-[17px] font-semibold text-[#1a1a2e] tracking-tight">JoyfulOasis</h2>
                  <p className="text-[12px] text-[#888] mt-0.5">@JoyfulOasis · YouTube Channel</p>
                </div>
              </div>
            </div>

            <hr className='border-[#c7c7c77c] w-189.5' />

            <div className="px-8 py-6 text-[13.5px] leading-[2.1] tracking-tight">
              <h1 className="text-[15px] font-semibold mb-3 text-[#1a1a2e]"># About Me</h1>
              <p className="mb-6 text-[#444]">
                I'm a content creator with an audience of over 23K subscribers, focused on making
                engaging and visually impactful content for anime fans. My work is built around
                creativity, consistency, and understanding what keeps viewers hooked. From editing
                style to content selection, I aim to create videos that feel sharp, entertaining,
                and worth watching again.
              </p>
              <hr className="mb-6 border-0 h-px bg-[#e3e3e3]" />
              <h1 className="text-[15px] font-semibold mb-3 text-[#1a1a2e]"># About JoyfulOasis</h1>
              <p className="mb-6 text-[#444]">
                JoyfulOasis is a channel dedicated to anime edits, AMVs, and short-form anime content.
                The channel focuses on creating high-energy edits, smooth transitions, emotional scenes,
                powerful moments, and clips that connect with anime lovers. Every upload is made to
                bring strong visuals, clean editing, and content that feels exciting from start to finish.
              </p>
              <hr className="mb-6 border-0 h-px bg-[#e3e3e3]" />
              <h1 className="text-[15px] font-semibold mb-3 text-[#1a1a2e]">## What You'll Find Here</h1>
              <p className="mb-2 text-[#444]">JoyfulOasis is built for viewers who enjoy anime content with strong editing and hype moments:</p>
              <p className="mb-6 text-[#444] whitespace-pre-line">
                {"  "}→ Anime edits with clean transitions and strong visual style{"\n"}
                {"  "}→ AMVs based on emotional and intense anime moments{"\n"}
                {"  "}→ Shorts focused on popular characters and trending scenes{"\n"}
                {"  "}→ Fight edits, comparison videos, and engaging anime clips{"\n"}
                {"  "}→ Content made to entertain anime fans with cinematic energy
              </p>
              <hr className="mb-6 border-0 h-px bg-[#e3e3e3]" />
              <h1 className="text-[15px] font-semibold mb-3 text-[#1a1a2e]">## The Goal</h1>
              <p className="mb-6 text-[#444]">
                The goal of JoyfulOasis is not just to post random clips, but to turn anime moments
                into polished, memorable, and high-impact content. The focus is on quality, vibe,
                edit precision, and creating videos that stand out.
              </p>
              <hr className="mb-6 border-0 h-px bg-[#e3e3e3]" />
              <h1 className="text-[15px] font-semibold mb-3 text-[#1a1a2e]">## Why JoyfulOasis</h1>
              <p className="mb-8 text-[#444]">
                If you enjoy anime edits, AMVs, iconic scenes, and content that feels clean, intense,
                and visually strong, JoyfulOasis is for you. This channel is all about bringing anime
                content to life through editing, creativity, and audience-focused storytelling.
              </p>
              <div className="flex justify-center pb-10">
                <a href="https://www.youtube.com/@JoyfulOasis" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-white text-[13px] font-semibold tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)', boxShadow: '0 4px 20px rgba(255,0,0,0.25)', textDecoration: 'none' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Visit JoyfulOasis on YouTube
                </a>
              </div>
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

export default ContentCreatorWindow;