import Moment from 'react-moment';
import {NavLink} from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

const ListingItem = ({id, listing}) => {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center rounded-md shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-150 m-[10px]">
      <NavLink className="contents" to ={`/category/${listing.type}/${id}`}>
        <img className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200" src={listing.imgUrls[0]} loading="lazy" alt="home" />
        <Moment className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold px-2 py-1 rounded-md shadow-lg' fromNow>{listing.timestamp?.toDate()}</Moment>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-xs mb-[2px] text-gray-600 truncate">{listing.address}</p>
          </div>
          <h3 className="text-lg font-semibold truncate">{listing.name}</h3>
          <p className="mt-2 font-semibold text-[#457b9d]">$ {listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") :  
            listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / Month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">{listing.beds > 1 ? `${listing.beds} beds` : "1 bed"}</p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">{listing.baths > 1 ? `${listing.baths} baths` : "1 bath"}</p>
            </div>
          </div>
        </div>
      </NavLink>
    </li>
  )
}

export default ListingItem