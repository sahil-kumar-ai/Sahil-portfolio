import React from 'react';
import HeroSectionWallpaper from './HeroSectionWallpaper';
import HeroImages from './HeroImages';

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <HeroSectionWallpaper />
      <HeroImages />
    </div>
  );
};

export default HeroSection;