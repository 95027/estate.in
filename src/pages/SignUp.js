import { useState } from 'react';
import loginImg from '../assets/loginImg.webp';
import { NavLink, useNavigate } from 'react-router-dom';
import Oauth from '../components/Oauth';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { db } from '../firebase/config';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const SignUp = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const submitHandler =async (e) => {
    e.preventDefault();

    try {

      if(name && email && password){
        if(password.length<6){
          toast.error("password should contain atleast 6 characters !");
        }
        else{
          const auth = getAuth();
          const userCredential =await createUserWithEmailAndPassword(auth, email, password);
          updateProfile(auth.currentUser, {
            displayName: name
          })
          const user = userCredential.user;
          //console.log(user);
          const formDataCopy = {email,name};
          formDataCopy.timestamp = serverTimestamp();
    
          await setDoc(doc(db, "users", user.uid), formDataCopy);
    
          toast.success("registration was successful");
    
          navigate('/');
        }
      }
      else{
        toast.error("need to fill all the fields !");
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-5 font-bold">Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='w-[70%] md:w-[50%] mb-12 md:mb-6'> 
          <img src={loginImg} alt="signIn" className='w-full rounded-2xl'/>
        </div>
        <div className='w-[70%] md:w-[40%] md:ml-10'>
          <form onSubmit={submitHandler}>
            <div className='mb-6'>
              <input className='w-full px-4 py-2 text-gray-700 text-sm border-gray-300 rounded-md sm:text-[18px] placeholder:opacity-50 placeholder:text-[16px]' type="text" placeholder='Full Name' value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div className='mb-6'>
              <input className='w-full px-4 py-2 text-gray-700 text-sm border-gray-300 rounded-md sm:text-[18px] placeholder:opacity-50 placeholder:text-[16px]' type="email" placeholder='Email Address' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className='mb-6'>
              <input className='w-full px-4 py-2 text-gray-700 text-sm border-gray-300 rounded-md sm:text-[18px] placeholder:opacity-50 placeholder:text-[16px]' type="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <div className='flex justify-between text-xs sm:text-sm md:text-base mb-6'>
              <p>have a account ? <NavLink to="/sign-in" className="text-red-600 hover:opacity-[.8]">Sign-In</NavLink></p>
              <p><NavLink to="/forgot" className="text-blue-600 hover:opacity-[.8]">Forgot Password?</NavLink></p> 
            </div>
            <button className='mb-6 w-full bg-blue-600 text-white px-7 py-2 rounded-md uppercase hover:bg-blue-700 transition-duration-150 ease-in-out text-sm font-medium md:text-md active:bg-blue-800 shadow-md'>sign up</button>
            <div className='mb-6 flex items-center before:border-t-2 before:flex-1 before:border-gray-300 after:border-t-2 after:flex-1 after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
          </form>
          <Oauth/>
        </div>
      </div>
    </section>
  )
}

export default SignUp