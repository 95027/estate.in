import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper';
import {FaShare, FaBed, FaBath, FaChair, FaParking } from 'react-icons/fa';
import {MdLocationOn} from 'react-icons/md';
import {getAuth} from 'firebase/auth';
import ContactLandlord from '../components/ContactLandlord';
import { MapContainer, Popup, TileLayer, Marker } from 'react-leaflet';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const SingleListing = () => {

    const auth = getAuth();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [shareLink, setShareLink] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);

    useEffect(()=>{
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListing(docSnap.data());
                setLoading(false);
            }   
        }
        fetchListing();
    },[params.listingId])


    if(loading){
        return <Spinner/>
    }

  return (
    <main>
        <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            slidesPerView={1}
            navigation
            autoplay = {{delay: 3000}}
            pagination={{ clickable: true}}>
                {
                    listing.imgUrls.map((url, index)=>(
                        <SwiperSlide key={index}>
                            <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden" style={{background : `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize : "cover"}}>
                            </div>
                        </SwiperSlide>
                    ))
                }
        </Swiper>
        <div className="fixed top-[15%] right-[.8%] z-10 cursor-pointer bg-white border-2 border-gray-400 rounded-full p-2" onClick={()=>{
            navigator.clipboard.writeText(window.location.href);
            setShareLink(true);
            setTimeout(()=>{
                setShareLink(false);
            }, 2000)
            }}>
            <FaShare className="text-xl text-slate-500" />
        </div>
        {shareLink && <p className="fixed top-[18%] right-[10%] md:right-[6%] z-10 bg-white p-2 rounded-md border border-gray-400">Link Copied</p>}
        <div className="max-w-6xl flex flex-col md:flex-row items-center m-4 lg:mx-auto p-4 bg-white shadow-lg rounded-md md:space-x-5 space-y-5 md:space-y-0">
            <div className="w-full">
                <h3 className="md:text-2xl text-xl font-semibold text-blue-900">{listing.name} - $ {listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") } {listing.type === "rent" ? "/ Month" : ""}</h3>
                <p className="flex items-center font-semibold mt-1 mb-4 text-gray-600">
                <MdLocationOn className="text-green-700 mr-1" /> {listing.address}
                </p>
                <div className="flex justify-start items-center space-x-4 text-white font-semibold">
                <p className="w-full max-w-[160px] bg-red-700 p-1.5 rounded-md shadow-md text-center">for {listing.type === "rent" ? "Rent" : "Sale"}</p>
                {listing.offer && (
                    <p className="w-full max-w-[160px] p-1.5 rounded-md shadow-md text-center bg-green-700">$ {+listing.regularPrice - +listing.discountedPrice} discount</p>
                )}
                </div>
                <p className="mt-4"><span className="font-semibold">Description: </span>{listing.description}</p>
                <ul className="flex items-center font-semibold space-x-4 md:space-x-8 text-sm mt-4">
                    <li className="flex items-center whitespace-nowrap"><FaBed className="mr-1 text-lg" /> {+listing.beds > 1 ? `${listing.beds} Beds` : "1 Bed"}</li>
                    <li className="flex items-center whitespace-nowrap"><FaBath className="mr-1" /> {+listing.baths > 1 ? `${listing.baths} Baths` : "1 Bath"}</li>
                    <li className="flex items-center whitespace-nowrap"><FaParking className="mr-1 text-lg" /> {listing.parking  ? "Parking spot" : "No parking"}</li>
                    <li className="flex items-center whitespace-nowrap"><FaChair className="mr-1" /> {listing.furniture ? "Furnitured" : "Not furnitured"}</li>
                </ul>
                {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
                    <div className="mt-5">
                    <button onClick={()=>setContactLandlord(true)} className="w-full bg-blue-600 text-white text-sm text-center uppercase font-medium px-7 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out">Contact Landlord</button>
                    </div>
                )}
                {contactLandlord && (
                    <ContactLandlord userRef={listing.userRef} listing={listing} />
                )}
            </div>
            <div className="w-full md:h-[300px] h-[200px]">
            <MapContainer center={[listing.latitude, listing.longitude]} zoom={13} scrollWheelZoom={false}
                style={{height: "100%", width:"100%"}}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[listing.latitude, listing.longitude]}>
                <Popup>
                    {listing.address}
                </Popup>
                </Marker>
            </MapContainer>
            </div>
        </div>
    </main>
  )
}

export default SingleListing