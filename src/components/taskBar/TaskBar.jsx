import TaskBarBG from './TaskBarBG'

const TaskBar = () => {
  return (
    <div className='z-[9999]' style={{ position: 'relative' }}>
      <TaskBarBG />
    </div>
  )
}

export default TaskBar