import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {FcGoogle} from 'react-icons/fc';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const Oauth = () => {

  const navigate = useNavigate();

  const googleAuth =async (e) => {
    e.preventDefault();

    try {

      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // check for the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if(!docSnap.exists()){
        await setDoc(docRef, {
          name : user.displayName,
          email : user.email,
          timestamp : serverTimestamp()
        })
      }
      navigate('/');

    } catch (error) {
      toast.error("Could not authorize with google");
      //console.log(error);
    }
  }

  return (
    <button onClick={googleAuth} className='w-full flex items-center justify-center bg-red-700 text-white text-sm font-medium py-2 px-7 uppercase rounded-md hover:bg-red-800 transition-duration-150 ease-in-out shadow-md active:bg-red-900'> <FcGoogle className='text-2xl bg-white rounded-full mr-2'/> continue with Google</button>
  )
}

export default Oauth