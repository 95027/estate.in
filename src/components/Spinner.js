import spinner from '../assets/spinner.svg';

const Spinner = () => {
  return (
    <div className='bg-black bg-opacity-50 flex items-center justify-center fixed top-0 bottom-0 right-0 left-0 z-50'>
        <img src={spinner} alt="Loading..." />
    </div>
  ) 
}

export default Spinner