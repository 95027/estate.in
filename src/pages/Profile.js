import { useEffect, useState } from "react";
import {getAuth, updateProfile} from 'firebase/auth';
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";
import {FaHome} from 'react-icons/fa';
import ListingItem from "../components/ListingItem";

const Profile = () => {

  const auth = getAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(auth.currentUser.displayName);
  const [email, setEmail] = useState(auth.currentUser.email);

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true); 

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

  useEffect(()=>{
    async function fetchUserListings(){

      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      let Listings = [];
      querySnap.forEach((doc)=>{
        return Listings.push({
          id : doc.id,
          data : doc.data(),
        })
      });
      setListings(Listings);
      setLoading(false);
    }

    fetchUserListings();
  },[auth.currentUser.uid]);

  const onDelete = async (listingId) => {
    if(window.confirm("Are you sure to delete it ?")){
      await deleteDoc(doc(db, "listings", listingId ));
      const updatedListings = listings.filter((listing)=> listing.id !== listingId);
      setListings(updatedListings);
      toast.success("Listing deleted successfully...");
    }

  }
  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }

  return (
    <>
      <section className="max-w-6xl mx-auto p-1">
        <h1 className="text-2xl text-center text-blue-900 font-bold mt-6">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3 py-1 mx-auto">
          <form className="border-[1px] border-blue-900 rounded-md p-1">
            <div className="flex items-center ">
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
            <button type="submit" className="w-full bg-blue-600 mt-6 px-7 py-2 uppercase rounded-md text-white text-sm font-medium flex items-center justify-center shadow-md hover:bg-blue-700 transition duration-150 ease-in-out active:bg-blue-800">
              <NavLink to="/create-listing" className="flex items-center justify-center whitespace-nowrap">
                <FaHome className="md:mr-2 mr-1 text-black md:text-3xl text-2xl bg-red-200 rounded-full p-1 border-2"/><span className="text-xs md:text-base">Sell or rent your home</span>
              </NavLink>
            </button>
        </div>
      </section>
      <section className="max-w-6xl mx-auto p-1 mt-10">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-xl md:text-2xl text-center text-blue-900 font-semibold">My listings</h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {
                listings.map((listing)=>{
                return  <ListingItem
                 key={listing.id}
                 id={listing.id} 
                 listing={listing.data}
                 onDelete={()=>onDelete(listing.id)}
                 onEdit={()=>onEdit(listing.id)}
                 />
                })
              }
            </ul>
          </>
        ) }
      </section>
    </>
  )
}

export default Profile