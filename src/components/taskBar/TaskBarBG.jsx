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

  const dockItems = [
    { name: "Finder", src: "../assets/taskBarImages/Finder.png", alt: "Finder-Image", className: "w-12 h-10 -mt-2" },
    { name: "Mail", src: "../assets/taskBarImages/Mail.webp", alt: "Mail-Image", className: "w-10.5 h-10 -mt-0.5" },
    { name: "Notes", src: "../assets/taskBarImages/Notes.webp", alt: "Notes-Image", className: "w-10.25 h-10 -mt-0.5" },
    { name: "Gallery", src: "../assets/taskBarImages/Gallery.webp", alt: "Gallery-Image", className: "w-10.25 h-10 -mt-px" },
    { name: "Music", src: "../assets/taskBarImages/Music.jpg", alt: "Music-Image", className: "w-9 h-10 mt-0.75", imgClass: "rounded-md" },
    { name: "Terminal", src: "../assets/taskBarImages/Terminal.png", alt: "Terminal-Image", className: "w-9.25 h-10 mt-1" },
  ];

  return (
    <div className='h-16 w-125 rounded-[18px] bg-[#bababa3a] mb-4.5 backdrop-blur-md shadow-sm fixed bottom-0 right-128'>
      <div className='flex flex-row justify-between items-center p-1'>

        {dockItems.map((item) => (
          <div
            key={item.name}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className={`relative group cursor-pointer ${item.className}`}
          >
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 -translate-y-0.5 whitespace-nowrap rounded-md bg-[#27272771] px-2 py-px text-[11px] h-5 text-white opacity-0 group-hover:opacity-100">
              {item.name}
            </div>

            <img className={item.imgClass || ""} src={item.src} alt={item.alt} />
          </div>
        ))}

        <div className='h-10 w-0.5 translate-y-2 rounded-[18px] bg-[rgba(255,255,255,0.37)] mb-4.5 backdrop-blur-md'></div>

        <div
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onClick={() => window.open("https://github.com/sahil-kumar-ai", "_blank")}
          className='relative group mt-0.5 h-10 w-9.5 cursor-pointer'
        >
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 -translate-y-0.5 whitespace-nowrap rounded-md bg-[#27272771] px-2 py-px text-[11px] h-5 text-white opacity-0 group-hover:opacity-100">
            GitHub
          </div>

          <img src="../assets/taskBarImages/GitHubNew.webp" alt="GitHub-Image" />
        </div>

        <div className='h-10 w-0.5 translate-y-2 rounded-[18px] bg-[rgba(255,255,255,0.37)] mb-4.5 backdrop-blur-md'></div>

        <div
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className='relative group w-11.25 h-12 mt-1.25 cursor-pointer'
        >
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 -translate-y-0.5 whitespace-nowrap rounded-md bg-[#27272771] px-2 py-px text-[11px] h-5 text-white opacity-0 group-hover:opacity-100">
            Apps
          </div>

          <img src="../assets/taskBarImages/app.webp" alt="App-Image" />
        </div>

        <div
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className='relative group w-10.75 h-10 mt-0.5 cursor-pointer'
        >
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 -translate-y-0.5 whitespace-nowrap rounded-md bg-[#27272771] px-2 py-px text-[11px] h-5 text-white opacity-0 group-hover:opacity-100">
            Trash
          </div>

          <img src="../assets/taskBarImages/Trash.webp" alt="Trash-Image" />
        </div>

      </div>
    </div>
  )
}

export default TaskBarBG