import React, { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
  const[currState,setCurrState]=useState("sign up")
  const[fullName,setFullName]=useState("")
   const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
     const[bio,setBio]=useState("")
     const[isDataSubmitted,setIsDataSubmitted]=useState(false)
  


     const {login}=useContext(AuthContext);




     const onSubmitHandler=(e)=>{
      e.preventDefault();
      if(currState==="sign up" && !isDataSubmitted){
        setIsDataSubmitted(true)
        return;
      }
      

       login(currState==="sign up"? 'signup':'login',{fullName,email,password,bio});
        
  
     }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

    {/* ----------------left */}
    <img src="./vite.svg" alt="" className='w-44 aspect-square rounded-full mx-10 max-sm:mt-10' />
    {/* w-[min(300vw,250px] */}

    {/* --------------------right */}
    <form onSubmit={onSubmitHandler} action="" className='w-150 border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
    <h2 className='font-medium text-2xl flex justify-between items-center'>{currState}
      {isDataSubmitted &&
          <img onClick={()=>setIsDataSubmitted(false)} src="./vite.svg" alt="" className='w-5 cursor-pointer ' />
}
    </h2>
    {currState==="sign up" && !isDataSubmitted && (
    <input  onChange={(e)=>setFullName(e.target.value)} value={fullName} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='full name' required />

    )}
    {!isDataSubmitted && (
      <>
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='email address' required  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='set password' required  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>

      </>
    )}

    {
      currState==="sign up" && isDataSubmitted && (
        <textarea rows={4} onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='provide a short bio...' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
      )
    }
    <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer' >
      {currState==="sign up" ? "create account" :"log in"}
    </button>

    <div>
      <input type="checkbox" required />
      <p>agree with terms of use & privacy policy</p>
    </div>
    <div className='flex flex-col gap-2'>

      {currState==="sign up"?(
        <p className='text-sm text-gray-600'>already have an account? <span onClick={()=>{setCurrState("login"); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>login here</span></p>
      ):(
                <p className='text-sm text-gray-600'>create an account <span onClick={()=>{setCurrState("sign up")}} className='font-medium text-violet-500 cursor-pointer'>click here</span></p>

      )}
    </div>
    </form>
      
    </div>
  )
}

export default Login
