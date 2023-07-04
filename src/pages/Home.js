import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { NavLink } from "react-router-dom";
import ListingItem from "../components/ListingItem";


const Home = () => {

  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);

  // for offers
  useEffect(()=>{
    async function offersListings(){
      try {

        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(4));
        const querySnap = await getDocs(q);
        const listings = [];

        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setOfferListings(listings);

      } catch (error) {
        console.log(error);
      }
    }
    offersListings();
  },[]);

    // for rented lists
    useEffect(()=>{
      async function rentedListings(){
        try {
  
          const listingsRef = collection(db, "listings");
          const q = query(listingsRef, where("type", "==", "rent"), orderBy("timestamp", "desc"), limit(4));
          const querySnap = await getDocs(q);
          const listings = [];
  
          querySnap.forEach((doc)=>{
            return listings.push({
              id: doc.id,
              data: doc.data(),
            })
          })
          setRentListings(listings);
  
        } catch (error) {
          console.log(error);
        }
      }
      rentedListings();
    },[]);

      // for sale listings
  useEffect(()=>{
    async function saleListings(){
      try {

        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("type", "==", "sale"), orderBy("timestamp", "desc"), limit(4));
        const querySnap = await getDocs(q);
        const listings = [];

        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setSaleListings(listings);

      } catch (error) {
        console.log(error);
      }
    }
    saleListings();
  },[]);

  return (
    <>
      <Slider/>
      <div className="max-w-6xl mx-auto space-y-6 px-3 py-1"> 

        {/* ===== for offers ==========*/}
        {offerListings && offerListings.length > 0 && (
          <div className="mt-6 mb-6">
            <h2 className="text-2xl font-semibold">Recent offers</h2>
            <NavLink to="/offers">
              <p className="text-sm text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out">Show more offers</p>
            </NavLink>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" >
              {offerListings.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </div>
        )}

          {/* ===== for rent ==========*/}
          {rentListings && rentListings.length > 0 && (
          <div className="mt-6 mb-6">
            <h2 className="text-2xl font-semibold">Places for rent</h2>
            <NavLink to="/category/rent">
              <p className="text-sm text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out">Show more places for rent</p>
            </NavLink>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" >
              {rentListings.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </div>
          )}

          {/* ===== for sale ==========*/}
          {saleListings && saleListings.length > 0 && (
          <div className="mt-6 mb-6">
            <h2 className="text-2xl font-semibold">Places for sale</h2>
            <NavLink to="/category/sale">
              <p className="text-sm text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out">Show more places for sale</p>
            </NavLink>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" >
              {saleListings.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </div>
          )}
      </div>
    </>
  )
}

export default Home