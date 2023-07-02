import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

const ContactLandlord = ({userRef, listing}) => {

    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(()=>{

        async function getLandlord(){
            const userDoc = doc(db, "users", userRef);
            const docSnap = await getDoc(userDoc);

            if(docSnap.exists()){
                setLandlord(docSnap.data());
            }
            else {
                toast.error("Unable to find landlord data");
            }
        }
        getLandlord();
        
    },[userRef])


  return (
    <>{landlord !== null && (
        <div className="w-full mt-5">
            <p>Contact {landlord.name} for the {listing.name.toLowerCase()}</p>
            <div className="mt-3">
                <textarea className="w-full rounded-md focus:ring-0" placeholder="Message" name="message" required value={message} onChange={(e)=>setMessage(e.target.value)}></textarea>
            </div>
            <button type="button" className="w-full bg-blue-600 text-white text-sm text-center uppercase font-medium px-7 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out mt-2 mb-2">
                <a href={`mailto:${landlord.email}?subject=${listing.name}&body=${message}`}>Send Message</a>
            </button>
        </div>
    )}</>
  )
}

export default ContactLandlord