import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import RightSidebar from './components/RightSidebar'

const App = () => {
  const {authUser,loading}=useContext(AuthContext)
  return (
    <div>
    {
      loading ? 
      (
        <div>loading...</div>
      )
      :
      (
    <div className="bg-[url('https://imgs.search.brave.com/Zs6INcekrcJLRi2JSt7yw69NGw6tMDvWRueBBKB3leA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDM0MTYz/MzYuanBn')] bg-contain">
      <Toaster/>
     <Routes >
<Route path='/' element={ authUser?<Home/>:<Navigate to="/login" />}  />
<Route path='/login' element={ !authUser?<Login/>: <Navigate to="/"/>}  />
<Route path='/profile' element={authUser?<Profile/>:<Navigate to="/login" />}  />


<Route
    path="/rightSidebar"
    element={authUser ? <RightSidebar/> : <Navigate to="/login" />}
  />
     </Routes>
    </div>
      )


    }
    </div>

  )}

export default App
