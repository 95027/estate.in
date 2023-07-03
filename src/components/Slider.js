import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, EffectFade, Autoplay } from "swiper";
import { useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';

const Slider = () => {

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
  
    useEffect(()=>{
  
      async function fetchListings(){
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        });
        setListings(listings);
        setLoading(false);
      }
      fetchListings();
  
    },[])
  
    if(loading){
      return <Spinner/>
    }
  
    if(listings.length === 0){
      return <></>;
    }
  
  return (
    listings && (
      <>
        <Swiper
          modules={[Navigation, Pagination, A11y, EffectFade, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          effect="fade"
          autoplay={{delay:4000}}
          pagination={{ clickable: true }}>

          {listings.map(({data, id})=>(
            <SwiperSlide key={id} onClick={()=>navigate(`/category/${data.type}/${id}`)}>
              <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden" style={{background:`url(${data.imgUrls[0]}) center no-repeat`, backgroundSize:"cover"}}></div>
              <p className="absolute top-3 left-1 text-[#f1faee] font-medium bg-[#4579bd] rounded-br-2xl rounded-tl-2xl max-w-[90%] p-2 shadow-lg">{data.name}</p>
              <p className="absolute bottom-1 left-1 text-[#f1faee] font-medium bg-[#e63946] rounded-tr-2xl rounded-bl-2xl max-w-[90%] p-2 shadow-lg">
                $ {data.discountedPrice ?? data.regularPrice}
                {data.type === "rent" && " / Month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider