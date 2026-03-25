import React from 'react'
import HeroSection from '../components/homePageComponents/HeroSectionWallpaper'
import TaskBar from '../components/taskBar/TaskBar'

const Home = () => {
  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      
      <div className='absolute'>
        <HeroSection />
      </div>
      
      <div className='absolute flex flex-col justify-end items-center h-screen w-screen '>
        <TaskBar />
      </div>
    </div>
  )
}

export default Home
