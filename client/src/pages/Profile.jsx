
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Camera, User, FileText, ChevronLeft } from 'lucide-react';

const Profile = () => {
  const { authUser, updateProfile } = useContext(AuthContext)
  const [selectedImg, setSelectedImg] = useState(null)
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const navigate = useNavigate();


  const hasChanges = 
    name !== authUser?.fullName || 
    bio !== authUser?.bio || 
    selectedImg !== null;

  const isFormValid = name.trim() !== "" && bio.trim() !== "";
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if(!hasChanges) return;
    let updatedUser = null;

    if (!selectedImg) {
      updatedUser = await updateProfile({ fullName: name, bio });
    } else {
      updatedUser = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onload = async () => {
          const user = await updateProfile({
            profilePic: reader.result,
            fullName: name,
            bio,
          });
          resolve(user);
        };
      });
    }

    if (updatedUser) navigate("/");
  };

  return (
    <div className='min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4'>
   
   

      <div className='w-full max-w-4xl bg-white/[0.02] backdrop-blur-3xl text-gray-300 border border-white/10 flex flex-col md:flex-row items-center justify-between rounded-3xl overflow-hidden shadow-2xl'>
            <button onClick={() => navigate("/")} className=' p-1 text-slate-400 absolute top-2 left-2'>
                 <ChevronLeft />
               </button>
        {/* FORM  */}
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-6 p-8 md:p-12 flex-1 w-full'>
          <div className="space-y-1">
            <h3 className='text-2xl font-bold text-white tracking-tight'>Profile Settings</h3>
            <p className="text-slate-500 text-sm">Update your personal information and avatar.</p>
          </div>

          <label htmlFor="avatar" className='flex items-center gap-4 cursor-pointer group bg-white/5 p-4 rounded-2xl border border-dashed border-white/10 hover:border-emerald-500/50 transition-all'>
            <input 
              onChange={(e) => setSelectedImg(e.target.files[0])} 
              type="file" 
              id='avatar' 
              accept='image/*' 
              hidden 
            />
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500/20 bg-[#0f172a] flex items-center justify-center">
                {selectedImg ? (
                  <img src={URL.createObjectURL(selectedImg)} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" />
                )}

                 {/* URL.createObjectURL() ka kaam hai local file ko ek temporary URL me convert karna */}
            {/* Blob URL ek shortcut hai tumhari local file ko browser me preview karne ka. */}
            {/* Blob = Binary Large Object

Ye ek object hai jo raw binary data (jaise images, audio, video, pdf, ya koi bhi file) ko represent karta hai.

JavaScript me tum file input se jo file select karte ho (File object), wo bhi Blob ka hi ek special type hota hai. */}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-[#111827]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                {selectedImg ? "Image selected" : "Upload new avatar"}
              </span>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Recommended: Square PNG/JPG</p>
            </div>
          </label>

          {/* INPUTS */}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                type="text" 
                required 
                placeholder='Full Name' 
                className='w-full bg-white/5 border border-white/10 p-3 pl-10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all' 
              />
            </div>

            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <textarea 
                onChange={(e) => setBio(e.target.value)} 
                value={bio} 
                required 
                placeholder='Tell us about yourself...' 
                rows="3"
                className='w-full bg-white/5 border border-white/10 p-3 pl-10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all resize-none' 
              />
            </div>
          </div>

         <button 
  type="submit"
  disabled={!hasChanges || !isFormValid}
  className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg active:scale-95 ${
    hasChanges && isFormValid
      ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20'
      : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
  }`}
>
  {hasChanges ? "Save Changes" : "No Changes Made"}
</button>
        </form>

        <div className='hidden md:flex flex-col items-center justify-center bg-white/[0.03] w-72 h-full p-12 border-l border-white/5'>
          <div className="relative group">
            <img 
              className='w-40 h-40 rounded-full object-cover border-4 border-emerald-500/20 p-2 shadow-2xl transition-transform duration-500 group-hover:scale-105' 
              src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || "/vite.svg")} 
              alt="Profile" 
            />
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse -z-10" />
          </div>
          <h4 className="mt-6 font-bold text-white text-lg truncate w-full text-center">{name || "User"}</h4>
          <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Preview</p>
        </div>

      </div>
    </div>
  )
}

export default Profile;