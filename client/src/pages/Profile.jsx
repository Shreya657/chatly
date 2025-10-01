import React, { use, useState } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const Profile = () => {
 const {authUser,updateProfile}=useContext(AuthContext)

  const[selectedImg,setSelectedImg]=useState(null)
  const navigate=useNavigate();
  const[name,setName]=useState(authUser.fullName);
   const[bio,setBio]=useState(authUser.bio);

const onSubmitHandler = async (e) => {
  e.preventDefault();

  let updatedUser = null;

  if (!selectedImg) {
    updatedUser = await updateProfile({ fullName: name, bio });
  } else {
    // Wrap FileReader in a Promise to await
    updatedUser = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        const user = await updateProfile({
          profilePic: reader.result,
          fullName: name,
          bio, 
        });
        resolve(user); // return user to outer async function
      };
    });
  }

  if (updatedUser) navigate("/"); // navigate after authUser is valid
};



  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center '>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={onSubmitHandler}  className='flex flex-col gap-5 p-10 flex-1' action="">
          <h3 className='text-lg font-semibold'>profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>

            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .svg' hidden />
            {/* sirf ek hi file select karne deta hai,-----files[0] */}
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : "./vite.svg"} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
            upload profile image


            {/* URL.createObjectURL() ka kaam hai local file ko ek temporary URL me convert karna */}
            {/* Blob URL ek shortcut hai tumhari local file ko browser me preview karne ka. */}
            {/* Blob = Binary Large Object

Ye ek object hai jo raw binary data (jaise images, audio, video, pdf, ya koi bhi file) ko represent karta hai.

JavaScript me tum file input se jo file select karte ho (File object), wo bhi Blob ka hi ek special type hota hai. */}



          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" required placeholder='your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} required placeholder='your bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
            <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>save</button>
        </form>
        <img className={`w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={ authUser?.profilePic || "./vite.svg" } alt="" />
      </div>
    </div>
  )
}

export default Profile
