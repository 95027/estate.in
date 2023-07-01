import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {getAuth} from 'firebase/auth';
import {v4 as uuidv4} from 'uuid';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate, useParams } from 'react-router-dom';

const CreateListing = () => {

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);

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
    regularPrice : 0,
    discountedPrice : 0,
    images : {},
    latitude : "",
    longitude : "",
  })

  const {type, name, beds, baths, parking, furnished, address, description, offer, regularPrice, discountedPrice, images, latitude, longitude} = formData;

  //preventing from others unable to edit except owner
  useEffect(()=>{
    if(listing && listing.userRef !== auth.currentUser.uid){
        toast.error("you can't edit this listing");
        navigate("/");
    }
  },[auth.currentUser.uid, listing, navigate]);

  //for teching listing from the db
  useEffect(()=>{
    setLoading(true);

    async function fetchListing(){
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            setListing(docSnap.data());
            setFormData({...docSnap.data()});
            setLoading(false);
        }
        else {
            navigate('/');
            toast.error("listing does not exists");
        }
    }
    fetchListing();
  },[navigate, params.listingId])

  const changeFormData = (e) => {
    let boolean = null;

    if(e.target.value === "true"){
      boolean = true;
    }
    if(e.target.value === "false"){
      boolean = false;
    }
    //files
    if(e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        images : e.target.files
      }))
    }
    //text / boolean / number
    if(!e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        [e.target.id] : boolean ?? e.target.value
      }))
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(+discountedPrice >= +regularPrice){
      setLoading(false);
      toast.error("Discounted price must be less than regular price");
      return;
    }

    if(images.length > 6){
      setLoading(false);
      toast.error("max 6 images are allowed !");
      return;
    }

    async function storeImage(image){
      return new Promise((resolve, reject)=>{
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default : break;
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      })
    }
    const imgUrls = await Promise.all(
      [...images].map((image)=> storeImage(image)))
      .catch(error=>{
        setLoading(false);
        //console.log(error);
        toast.error("Unable to update the images !");
        return;
      });
    
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp : serverTimestamp(),
      userRef : auth.currentUser.uid,
    }
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef,formDataCopy);
    setLoading(false);
    toast.success("Listing updated successfully !");

    navigate(`/category/${formDataCopy.type}/${docRef.id}`);

  }


  if(loading){
    return <Spinner/>
  }
  return (
    <main className="max-w-md mx-auto px-2">
      <h1 className="text-xl md:text-3xl text-center font-bold mt-6 text-blue-800">Edit Listing</h1>
      <form onSubmit = {submitHandler}>
        <p className="text-base sm:text-lg font-semibold mt-6">Sell / Rent</p>
        <div className="flex">
          <button type="button" value="sale" id="type" onClick={changeFormData} className={`w-full mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>sell</button>
          <button type="button" value="rent" id="type" onClick={changeFormData} className={`w-full ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>rent</button>
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
          <button type="button" value="true" id="parking" onClick={changeFormData} className={`w-full mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>yes</button>
          <button type="button" value="false" id="parking" onClick={changeFormData} className={`w-full ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${ parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>no</button>
        </div>
        <p className="text-base sm:text-lg font-semibold mt-6">Furnished</p>
        <div className="flex">
          <button type="button" value="true" id="furnished" onClick={changeFormData} className={`w-full mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${ !furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>yes</button>
          <button type="button" value="false" id="furnished" onClick={changeFormData} className={`w-full ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${ furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>no</button>
        </div>
        <div className="mt-6 mb-6">
          <p className="text-base sm:text-lg font-semibold">Address</p>
          <textarea placeholder="Address" id="address" value={address} onChange={changeFormData} required className="w-full px-4 py-2 text-xl text-gray-700 rounded-md bg-white border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300" />
            <div className="w-full flex items-center space-x-6">
              <div>
                <p className="text-base sm:text-lg font-light">latitude</p>
                <input type="number" step="any" id="latitude" value={latitude} onChange={changeFormData} min="-90" max="90" required className="w-full px-4 py-2 shadow-md rounded-md border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-light">longitude</p>
                <input type="number" step="any" id="longitude" value={longitude} onChange={changeFormData} min="-180" max="180" required className="w-full px-4 py-2 shadow-md rounded-md border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300" />
              </div>
            </div>
        </div>
        <p className="text-base sm:text-lg font-semibold">Description</p>
        <textarea placeholder="Description" id="description" value={description} onChange={changeFormData} required className="w-full px-4 py-2 text-xl text-gray-700 rounded-md bg-white border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300 mb-6" />
        <p className="text-base sm:text-lg font-semibold">Offer</p>
        <div className="flex">
          <button type="button" value="true" id="offer" onClick={changeFormData} className={`w-full mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>yes</button>
          <button type="button" value="false" id="offer" onClick={changeFormData} className={`w-full ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${ offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>no</button>
        </div>
        <div className="flex items-center mt-6">
          <div>
            <p className="text-base sm:text-lg font-semibold">Regular Price</p>
            <div className="w-full flex items-center justify-center space-x-6">
              <input type="number" id="regularPrice" value={regularPrice} onChange={changeFormData} required min="50" className="w-full px-4 py-2 text-xl font-medium shadow-md rounded-md border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300" />
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
                <input type="number" id="discountedPrice" min="0" value={discountedPrice} onChange={changeFormData} required={offer} className="w-full px-4 py-2 text-xl font-medium shadow-md rounded-md border border-gray-300 focus:ring-0 focus:border-2 focus:bg-white focus:border-slate-300" />
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
        <button type="submit" className="mb-6 w-full bg-blue-600 px-7 py-2.5 text-white sm:text-sm text-xs uppercase font-medium rounded-md shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">Update Listing</button>
      </form>
    </main>
  )
}

export default CreateListing