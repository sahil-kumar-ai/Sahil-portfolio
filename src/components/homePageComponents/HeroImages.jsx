import React, { useRef, useState, useCallback } from 'react';

import ReadMd from './heroElements/ReadMd';
import TechInfluencer from './heroElements/TechInfluencer';
import ContentCreator from './heroElements/ContentCreator';
import Hobbies from './heroElements/Hobbies';

import ReadMdWindow from './heroElementsWindow/ReadMdWindow';
import ContentCreatorWindow from './heroElementsWindow/ContentCreatorWindow';
import HobbiesWindow from './heroElementsWindow/HobbiesWindow';
import TechInfluencerWindow from './heroElementsWindow/TechInfluencerWindow';

const ITEMS = ['readMd', 'techInfluencer', 'hobbies', 'contentCreator'];

const INITIAL_WINDOW_STATE = Object.fromEntries(
  ITEMS.map((id) => [id, { isOpen: false, isMinimized: false, offset: 0 }])
);

const HeroImages = () => {
  const [windowStates, setWindowStates] = useState(INITIAL_WINDOW_STATE);
  const [stackOrder, setStackOrder] = useState([]);
  const [heroStackOrder, setHeroStackOrder] = useState([...ITEMS]);
  const stackOrderRef = useRef(0);

  const readMdIconRef = useRef(null);
  const techInfluencerIconRef = useRef(null);
  const hobbiesIconRef = useRef(null);
  const contentCreatorIconRef = useRef(null);

  const readMdActionRef = useRef({ minimize: null, restore: null });
  const contentCreatorActionRef = useRef({ minimize: null, restore: null });
  const hobbiesActionRef = useRef({ minimize: null, restore: null });
  const techInfluencerActionRef = useRef({ minimize: null, restore: null });

  const ACTION_REFS = {
    readMd: readMdActionRef,
    techInfluencer: techInfluencerActionRef,
    hobbies: hobbiesActionRef,
    contentCreator: contentCreatorActionRef,
  };

  const bringToFront = useCallback((id) => {
    setStackOrder((prev) => {
      if (!prev.includes(id)) return prev;
      if (prev[prev.length - 1] === id) return prev;
      return [...prev.filter((item) => item !== id), id];
    });
  }, []);

  const bringHeroToFront = useCallback((id) => {
    setHeroStackOrder((prev) => {
      if (prev[prev.length - 1] === id) return prev;
      return [...prev.filter((item) => item !== id), id];
    });
  }, []);

  const closeWindow = useCallback((id) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false, isMinimized: false },
    }));
    setStackOrder((prev) => prev.filter((item) => item !== id));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  }, []);

  const toggleWindow = (id) => {
    const state = windowStates[id];

    if (state.isOpen && !state.isMinimized) {
      // Window is visible → minimize it
      ACTION_REFS[id].current.minimize?.();
      return;
    }

    if (state.isOpen && state.isMinimized) {
      // Window is minimized → restore it
      ACTION_REFS[id].current.restore?.();
      setWindowStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isMinimized: false },
      }));
      bringToFront(id);
      return;
    }

    // Window is closed → open fresh
    stackOrderRef.current += 1;
    setWindowStates((prev) => ({
      ...prev,
      [id]: { isOpen: true, isMinimized: false, offset: stackOrderRef.current * 10 },
    }));
    setStackOrder((prev) => [...prev.filter((item) => item !== id), id]);
  };

  const getHeroZIndex = (id) => {
    const idx = heroStackOrder.indexOf(id);
    return 20 + (idx >= 0 ? idx : 0);
  };

  const getWindowZIndex = (id) => {
    const idx = stackOrder.indexOf(id);
    return 200 + (idx >= 0 ? idx : 0);
  };

  return (
    <div className="absolute inset-0">

      {/* Icon cards — sit BELOW popups always */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <ReadMd
  ref={readMdIconRef}
  onClick={() => {
    bringHeroToFront('readMd');
    toggleWindow('readMd');
  }}
  onBringToFront={() => bringHeroToFront('readMd')}
  heroZIndex={getHeroZIndex('readMd')}
/>

<TechInfluencer
  ref={techInfluencerIconRef}
  onClick={() => {
    bringHeroToFront('techInfluencer');
    toggleWindow('techInfluencer');
  }}
  onBringToFront={() => bringHeroToFront('techInfluencer')}
  heroZIndex={getHeroZIndex('techInfluencer')}
/>

<Hobbies
  ref={hobbiesIconRef}
  onClick={() => {
    bringHeroToFront('hobbies');
    toggleWindow('hobbies');
  }}
  onBringToFront={() => bringHeroToFront('hobbies')}
  heroZIndex={getHeroZIndex('hobbies')}
/>

<ContentCreator
  ref={contentCreatorIconRef}
  onClick={() => {
    bringHeroToFront('contentCreator');
    toggleWindow('contentCreator');
  }}
  onBringToFront={() => bringHeroToFront('contentCreator')}
  heroZIndex={getHeroZIndex('contentCreator')}
/>
        </div>
      </div>

      {/* Popups — always on top of icon cards */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none' }}>
        <ReadMdWindow
          isOpen={windowStates.readMd.isOpen}
          isMinimized={windowStates.readMd.isMinimized}
          offset={windowStates.readMd.offset}
          zIndex={getWindowZIndex('readMd')}
          onClose={() => closeWindow('readMd')}
          onMinimize={() => minimizeWindow('readMd')}
          onFocus={() => bringToFront('readMd')}
          iconRef={readMdIconRef}
          actionRef={readMdActionRef}
        />

        <ContentCreatorWindow
          isOpen={windowStates.contentCreator.isOpen}
          isMinimized={windowStates.contentCreator.isMinimized}
          offset={windowStates.contentCreator.offset}
          zIndex={getWindowZIndex('contentCreator')}
          onClose={() => closeWindow('contentCreator')}
          onMinimize={() => minimizeWindow('contentCreator')}
          onFocus={() => bringToFront('contentCreator')}
          iconRef={contentCreatorIconRef}
          actionRef={contentCreatorActionRef}
        />

        <HobbiesWindow
          isOpen={windowStates.hobbies.isOpen}
          isMinimized={windowStates.hobbies.isMinimized}
          offset={windowStates.hobbies.offset}
          zIndex={getWindowZIndex('hobbies')}
          onClose={() => closeWindow('hobbies')}
          onMinimize={() => minimizeWindow('hobbies')}
          onFocus={() => bringToFront('hobbies')}
          iconRef={hobbiesIconRef}
          actionRef={hobbiesActionRef}
        />

        <TechInfluencerWindow
          isOpen={windowStates.techInfluencer.isOpen}
          isMinimized={windowStates.techInfluencer.isMinimized}
          offset={windowStates.techInfluencer.offset}
          zIndex={getWindowZIndex('techInfluencer')}
          onClose={() => closeWindow('techInfluencer')}
          onMinimize={() => minimizeWindow('techInfluencer')}
          onFocus={() => bringToFront('techInfluencer')}
          iconRef={techInfluencerIconRef}
          actionRef={techInfluencerActionRef}
        />
      </div>

    </div>
  );
};

export default HeroImages;