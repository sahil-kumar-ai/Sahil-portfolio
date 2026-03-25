import React from 'react'
import { gsap } from "gsap";

const TaskBarBG = () => {

  const handleEnter = (e) => {
  gsap.to(e.currentTarget, {
    scale: 1.15,
    duration: 0.2,
    ease: "power2.out",
  });
};

const handleLeave = (e) => {
  gsap.to(e.currentTarget, {
    scale: 1,
    duration: 0.2,
    ease: "power2.out",
  });
};


  return (
    <div  className='h-16 w-125 rounded-[18px] bg-[#d6d6d646] mb-4.5 backdrop-blur-md shadow-sm'>

      <div className='flex flex-row justify-between items-center p-1'>

        <div onMouseEnter={handleEnter}
  onMouseLeave={handleLeave} className='w-12 h-10 -mt-2'>
        <img src="../assets/taskBarImages/Finder.png" alt="Finder-Image" />
      </div>

      <div
      onMouseEnter={handleEnter}
  onMouseLeave={handleLeave} className='w-10.5  h-10 -mt-0.5'>
        <img src="../assets/taskBarImages/Mail.webp" alt="Finder-Image" />
      </div>

      <div
      onMouseEnter={handleEnter}
  onMouseLeave={handleLeave} className='w-10.25 h-10 -mt-0.5'>
        <img src="../assets/taskBarImages/Notes.webp" alt="Finder-Image" />
      </div>

      <div
      onMouseEnter={handleEnter}
  onMouseLeave={handleLeave} className='w-10.25 h-10 -mt-px'>
        <img src="../assets/taskBarImages/Gallery.webp" alt="Finder-Image" />
      </div>

      <div
      onMouseEnter={handleEnter}
  onMouseLeave={handleLeave} className='w-9 h-10 mt-0.75'>
        <img className='rounded-md ' src="../assets/taskBarImages/Music.jpg" alt="Finder-Image" />
      </div>

      <div
      onMouseEnter={handleEnter}
  onMouseLeave={handleLeave} className='w-9.25 h-10 mt-1'>
        <img src="../assets/taskBarImages/Terminal.png" alt="Finder-Image" />
      </div>

      <div className='h-10 w-0.5 translate-y-2 rounded-[18px] bg-[rgba(255,255,255,0.37)] mb-4.5 backdrop-blur-md '>

      </div>

      <div onMouseEnter={handleEnter}
  onMouseLeave={handleLeave} className='mt-0.5 h-10 w-9.5'>
        <img className='' src="../assets/taskBarImages/GitHubNew.webp" alt="Finder-Image" />
      </div>

      <div className='h-10 w-0.5 translate-y-2 rounded-[18px] bg-[rgba(255,255,255,0.37)] mb-4.5 backdrop-blur-md '>

      </div>

      <div onMouseEnter={handleEnter}
  onMouseLeave={handleLeave} className='w-11.25 h-12 mt-1.25'>
        <img src="../assets/taskBarImages/app.webp" alt="Finder-Image" />
      </div>

      <div onMouseEnter={handleEnter}
  onMouseLeave={handleLeave} className='w-10.75 h-10 mt-0.5'>
        <img src="../assets/taskBarImages/Trash.webp" alt="Finder-Image" />
      </div>
      

      </div>

    </div>
  )
}

export default TaskBarBG
