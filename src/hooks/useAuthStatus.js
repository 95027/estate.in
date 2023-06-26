import  { useEffect, useState } from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

export const useAuthStatus = () => {
    
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkStatus, setCheckStatus] = useState(true);

    useEffect(()=>{
        const auth = getAuth();
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setLoggedIn(true);
            }
            setCheckStatus(false);
        })
    })


  return {loggedIn, checkStatus}
}


