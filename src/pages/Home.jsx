import HeroSection from '../components/homePageComponents/heroSection'
import TaskBar from '../components/taskBar/TaskBar'

const Home = () => {
  return (
    <div className='relative h-screen w-screen'>

      <div className='absolute inset-0' style={{ zIndex: 0 }}>
        <HeroSection />
      </div>

      <div className='absolute' style={{ zIndex: 9999, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <TaskBar />
        </div>
      </div>

    </div>
  )
}

export default Home