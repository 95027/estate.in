import { useEffect, useState } from "react"
import Spinner from "../components/Spinner";
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../firebase/config";
import ListingItem from "../components/ListingItem";
import { useParams } from "react-router-dom";


const Category = () => {

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(()=>{
    async function fetchListings(){
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(8));
        const querySnap = await getDocs(q);
        //for button fetching from the last
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        let listings = [];
  
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        });
        setListings(listings);
        setLoading(false);
        
      } catch (error) {
        console.log(error);
      }

    }
    fetchListings();
  },[params.categoryName]);

  //for load more listings
  async function fetchMoreListings(){
    try {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"),startAfter(lastFetchedListing), limit(4));
      const querySnap = await getDocs(q);
      //for button fetching from the last
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      let listings = [];

      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      });
      setListings((prevState)=>[...prevState, ...listings]);
      setLoading(false);
      
    } catch (error) {
      console.log(error);
    }
  }


  if(loading){
    return <Spinner/>;
  }

  return (
    <div className="max-w-6xl mx-auto px-3 py-1">
      <h1 className="text-3xl text-center text-blue-600 mt-6 font-bold">
        {params.categoryName === "rent" ? "Places for rent" : "Places for sale"}
      </h1>

      {listings && listings.length > 0 ? (
      <>
        <main className="mt-6">
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {listings.map((listing)=>(
               <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
            ))}
          </ul>
        </main>
        {lastFetchedListing && (
          <div className="flex justify-center items-center mt-6 mb-6">
            <button onClick={fetchMoreListings} className="text-gray-700 bg-white px-3 py-1.5 rounded-md font-semibold shadow-md border border-slate-300 hover:border-slate-500 hover:shadow-lg transition duration-150 ease-in-out">Load more</button>
          </div>
        )}
      </>)
       : <p>
            there are no current places for {params.categoryName === "rent" ? "rent" : "sale"}
        </p>
       }

    </div>
  )
}

export default Category