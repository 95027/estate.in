import { useState } from 'react';

const CreateListing = () => {

  const [formData, setFormData] = useState({
    type : "rent",
    name : "",
    beds : 1,
    baths : 1,
    parking : false,
    furnished : false,
    address : "",
    description : "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
  })

  const {type, name, beds, baths, parking, furnished, address, description, offer, regularPrice, discountedPrice} = formData;

  const changeFormData = () => {

  }

  return (
    <main className="max-w-md mx-auto px-2">
      <h1 className="text-xl md:text-3xl text-center font-bold mt-6 text-blue-800">Create a Listing</h1>
      <form >
        <p className="text-base sm:text-lg font-semibold mt-6">Sell / Rent</p>
        <div className="flex">
          <button type="button" value={type} id="type" onClick={changeFormData} className={`w-full mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>sell</button>
          <button type="button" value={type} id="type" onClick={changeFormData} className={`w-full ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>rent</button>
        </div>
        <p className="text-base sm:text-lg font-semibold mt-6">Name</p>
        <input type="text" placeholder="Name" id="name" value={name} onChange={changeFormData} maxLength="32" minLength="8" required className="w-full px-4 py-2 text-xl text-gray-700 rounded-md bg-white border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300" />
        <div className="flex space-x-6">
          <div>
            <p className="text-base sm:text-lg font-semibold mt-6">Beds</p>
            <input type="number" id="beds" value={beds} onChange={changeFormData} min="1" max="50" required className="w-full px-4 py-2 text-xl text-gray-700 rounded-md bg-white border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300 mb-6 text-center" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-semibold mt-6">Baths</p>
            <input type="number" id="baths" value={baths} onChange={changeFormData} min="1" max="50" required className="w-full px-4 py-2 text-xl text-gray-700 rounded-md bg-white border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300 mb-6 text-center" />
          </div>
        </div>
        <p className="text-base sm:text-lg font-semibold">Parking Spot</p>
        <div className="flex">
          <button type="button" value={parking} id="parking" onClick={changeFormData} className={`w-full mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>yes</button>
          <button type="button" value={parking} id="parking" onClick={changeFormData} className={`w-full ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${ parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>no</button>
        </div>
        <p className="text-base sm:text-lg font-semibold mt-6">Furnished</p>
        <div className="flex">
          <button type="button" value={furnished} id="furnished" onClick={changeFormData} className={`w-full mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${ !furnished ? "bg-white text-black" : "bg-black text-white"}`}>yes</button>
          <button type="button" value={furnished} id="furnished" onClick={changeFormData} className={`w-full ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${ furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>no</button>
        </div>
        <p className="text-base sm:text-lg font-semibold mt-6">Address</p>
        <textarea placeholder="Address" id="address" value={address} onChange={changeFormData} required className="w-full px-4 py-2 text-xl text-gray-700 rounded-md bg-white border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300 mb-6" />
        <p className="text-base sm:text-lg font-semibold">Description</p>
        <textarea placeholder="Description" id="description" value={description} onChange={changeFormData} required className="w-full px-4 py-2 text-xl text-gray-700 rounded-md bg-white border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300 mb-6" />
        <p className="text-base sm:text-lg font-semibold">Offer</p>
        <div className="flex">
          <button type="button" value={offer} id="offer" onClick={changeFormData} className={`w-full mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>yes</button>
          <button type="button" value={parking} id="parking" onClick={changeFormData} className={`w-full ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${ offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>no</button>
        </div>
        <div className="flex items-center mt-6">
          <div>
            <p className="text-base sm:text-lg font-semibold">Regular Price</p>
            <div className="w-full flex items-center justify-center space-x-6">
              <input type="number" id="regular-price" value={regularPrice} onChange={changeFormData} required min="50" className="w-full px-4 py-2 text-xl font-medium shadow-md rounded-md border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300" />
              {type === "rent" && (
              <div>
                <p className="w-full whitespace-nowrap">$ / Month</p>
              </div>
            )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex items-center mt-6">
            <div>
              <p className="text-base sm:text-lg font-semibold">Discounted Price</p>
              <div className="w-full flex items-center justify-center space-x-6">
                <input type="number" id="discounted-price" value={discountedPrice} onChange={changeFormData} required={offer} className="w-full px-4 py-2 text-xl font-medium shadow-md rounded-md border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300" />
                {type === "rent" && (
                 <div>
                  <p className="w-full whitespace-nowrap">$</p>
                </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 mb-6">
         <p className="text-base sm:text-lg font-semibold">Images</p>
         <p className="text-gray-600">The first image will be cover (max 6) </p>
         <input type="file" id="images" onChange={changeFormData} accept=".jpg,.png,.jpeg" multiple required className="w-full bg-white px-3 py-1.5 shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:ring-0 focus:bg-white focus:border-2 focus:border-slate-300"/>
        </div>
        <button type="submit" className="mb-6 w-full bg-blue-600 px-7 py-2.5 text-white sm:text-sm text-xs uppercase font-medium rounded-md shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">Create Listing</button>
      </form>
    </main>
  )
}

export default CreateListing