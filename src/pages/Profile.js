import { useState } from "react";
import {getAuth, updateProfile} from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const Profile = () => {

  const auth = getAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(auth.currentUser.displayName);
  const [email, setEmail] = useState(auth.currentUser.email);

  const [edit, setEdit] = useState(false);

  const signOut = () => {
    auth.signOut();
    navigate("/");
  }

  // for updating the profile
  const editHandler =async () => {
    try {

      if(auth.currentUser.displayName !== name){
        // updating displayname in firebase auth
        await updateProfile(auth.currentUser, {
          displayName : name
        })

        // update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        })

        toast.success("Profile updated successfully");
      }
      
    } catch (error) {
      toast.error("Unable to update the profile");
    }
  }


  return (
    <>
      <section className="max-w-6xl mx-auto p-1">
        <h1 className="text-2xl text-center text-blue-900 font-bold mt-6">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3 py-1 mx-auto rounded-md border-[1px] border-blue-900">
          <form>
            <div className="flex items-center">
              <label className="mb-5 mr-1 whitespace-nowrap font-semibold text-xs sm:text-sm md:text-base">User Name: </label>
              <input type="text" value={name} onChange={(e)=>setName(e.target.value)} disabled={!edit}  className="w-full px-4 py-2 text-xs sm:text-sm  md:text-lg  text-gray-700 border-none focus:ring-0 rounded-md mb-6 disabled:bg-transparent disabled:text-blue-900 disabled:font-bold"/>
            </div>
            <div className="flex items-center">
              <label className="mb-5 mr-1 whitespace-nowrap font-semibold text-xs sm:text-sm md:text-base">Email ID: </label>
              <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} disabled className="w-full px-4 py-2 text-xs sm:text-sm md:text-lg text-gray-700 border-none focus:ring-0 rounded-md mb-6 disabled:bg-transparent disabled:text-blue-900 disabled:font-bold"/>
            </div>
            <div className="flex justify-between text-xs sm:text-sm md:text-base mb-6">
              <p>Do you want to change your name ? <span onClick={()=> {edit && editHandler(); setEdit(!edit)}} className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer">{edit ? "Apply changes" : "Edit"}</span></p>
              <p onClick={signOut} className="text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer">Sign Out</p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default Profile