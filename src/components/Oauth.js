import {FcGoogle} from 'react-icons/fc';

const Oauth = () => {
  return (
    <button className='w-full flex items-center justify-center bg-red-700 text-white text-sm font-medium py-2 px-7 uppercase rounded-md hover:bg-red-800 transition-duration-150 ease-in-out shadow-md active:bg-red-900'> <FcGoogle className='text-2xl bg-white rounded-full mr-2'/> continue with Google</button>
  )
}

export default Oauth