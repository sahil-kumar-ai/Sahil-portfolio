import React from 'react'
import RealTime from './RealTime'
import TaskBar from '../taskBar/TaskBar'

const HeroSectionWallpaper = () => {
  return (
    <div className='flex relative h-screen w-screen overflow-hidden'>
      <img className='w-screen h-[107.6vh] -translate-y-14 absolute' src='../assets/hero/background.jpg' alt='Hero pic'/>
      <h1 className='absolute font-bold text-white mt-1.5 ml-3 font-SourceCodeProMedium text-sm'>Sahil</h1>
      <div className='absolute  mt-1.5 text-xs right-3 font-semibold'> 
        <RealTime />
      </div>
      
    </div>
  )
}

export default HeroSectionWallpaper