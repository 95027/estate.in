import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/apple-touch-icon.png';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Header = () => {

    const [pageState, setPageState] = useState("Sign In");
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setPageState("Profile");
            }
            else{
                setPageState("Sign In");
            }
        })
    },[auth])

    const pathMatchRoute = (route) => {
        if(location.pathname === route){
            return true;
        }
    }

  return (
    <div className='w-full bg-white border-b shadow-md sticky top-0 z-40'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div className='flex items-center cursor-pointer sm:hover:scale-[1.05]' onClick={()=>navigate('/')}>
                <img src={logo} alt="logo" className='h-5 cursor-pointer sm:h-10 ' />
                <span className='px-2 text-sm text-blue-900 sm:text-xl'>estate.in</span>
            </div>
            <div>
                <ul className='flex space-x-5 sm:space-x-10'>
                    <li className={`py-3 font-semibold text-gray-400 text-sm border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute('/') && "border-bottom"} sm:text-lg`}  onClick={()=>navigate('/')}>Home</li>
                    <li className={`py-3 font-semibold text-gray-400 text-sm border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute('/offers') && "border-bottom"} sm:text-lg`}  onClick={()=>navigate('/offers')}>Offers</li>
                    <li className={`py-3 font-semibold text-gray-400 text-sm border-b-[3px] border-b-transparent cursor-pointer ${(pathMatchRoute('/sign-in') && "border-bottom") ||(pathMatchRoute('/profile') && "border-bottom")} sm:text-lg`}  onClick={()=>navigate('/profile')}>{pageState}</li>
                </ul>
            </div>
        </header>
    </div>
  )
}

export default Header