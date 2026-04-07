import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from "react-hot-toast";
import { 
  MessageSquareText, Mail, Lock, User, TextCursorInput, ArrowRightCircle, 
  Eye, EyeOff 
} from 'lucide-react';

const Login = () => {
  const [currState, setCurrState] = useState("sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (currState === "sign up" && !isDataSubmitted) {
      try {
        const { data } = await axios.post("/api/auth/check-email", { email });
        if (data.success) {
          setIsDataSubmitted(true);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Something went wrong";
        toast.error(errorMsg);
      }
      return;
    }
    login(currState === "sign up" ? 'signup' : 'login', { fullName, email, password, bio });
  };

  return (
    <div className='min-h-screen w-full bg-[#0a0f1e] bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-slate-950 via-emerald-950/20 to-slate-950 flex items-center justify-center p-4 selection:bg-emerald-500/30 font-inter'>
      
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className='w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-16 z-10 p-4'>
        
        <div className='flex flex-col items-center text-center space-y-5 flex-1 max-w-sm'>
          
          <div className='p-6 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-3xl shadow-emerald-500/5 group relative overflow-hidden'>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
            <MessageSquareText 
              className='w-20 h-20 md:w-24 md:h-24 text-emerald-100 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-5deg]' 
              strokeWidth={1.2}
            />
          </div>
          <h1 className='text-5xl md:text-7xl font-extrabold text-white tracking-tighter'>
            Chatly<span className='text-emerald-400'>.</span>
          </h1>
          <p className='text-slate-300 text-xl font-light leading-relaxed max-w-xs'>
            Connect. Chat. Integrate.
          </p>
        </div>

        <form 
          onSubmit={onSubmitHandler} 
          className='w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-10 rounded-[40px] shadow-[0_30px_70px_-10px_rgba(0,0,0,0.5)] flex flex-col gap-6 transition-all duration-500'
        >
          <div className='flex justify-between items-center mb-1'>
            <h2 className='text-3xl font-bold text-white capitalize tracking-tight'>
              {currState}
            </h2>
            {isDataSubmitted && (
              <button 
                type="button"
                onClick={() => setIsDataSubmitted(false)}
                className='text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full'
              >
                ← Edit Info
              </button>
            )}
          </div>

          <div className='flex flex-col gap-5'>
            {currState === "sign up" && !isDataSubmitted && (
              <div className='relative space-y-1 animate-in fade-in slide-in-from-left-4 duration-300'>
                <User className="absolute left-4 top-11 w-5 h-5 text-slate-500" />
                <label className='text-xs font-medium text-slate-400 ml-1'>Full Name</label>
                <input 
                  onChange={(e) => setFullName(e.target.value)} 
                  value={fullName} 
                  type="text" 
                  className='w-full p-4 pl-12 bg-white/[0.03] border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder:text-slate-600 transition-all'
                  placeholder='Shreya Das' 
                  required 
                />
              </div>
            )}

            {!isDataSubmitted && (
              <div className='space-y-5 animate-in fade-in duration-300'>
                <div className='relative space-y-1'>
                  <Mail className="absolute left-4 top-11 w-5 h-5 text-slate-500" />
                  <label className='text-xs font-medium text-slate-400 ml-1'>Email</label>
                  <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    type="email" 
                    placeholder='your@email.com' 
                    required 
                    className='w-full p-4 pl-12 bg-white/[0.03] border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder:text-slate-600 transition-all'
                  />
                </div>
                
                <div className='relative space-y-1'>
                  <Lock className="absolute left-4 top-11 w-5 h-5 text-slate-500" />
                  <label className='text-xs font-medium text-slate-400 ml-1'>Password</label>
                  <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    type={showPassword ? "text" : "password"} 
                    placeholder='••••••••' 
                    required 
                    className='w-full p-4 pl-12 pr-12 bg-white/[0.03] border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder:text-slate-600 transition-all'
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-11 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {currState === "sign up" && isDataSubmitted && (
              <div className='relative space-y-1 animate-in fade-in slide-in-from-right-4 duration-300'>
                <TextCursorInput className="absolute left-4 top-11 w-5 h-5 text-slate-500" />
                <label className='text-xs font-medium text-slate-400 ml-1'>Short Bio</label>
                <textarea 
                  rows={4} 
                  onChange={(e) => setBio(e.target.value)} 
                  value={bio} 
                  placeholder='Tell us about yourself...' 
                  className='w-full p-4 pl-12 bg-white/[0.03] border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder:text-slate-600 transition-all resize-none'
                />
              </div>
            )}
          </div>

          <button 
            type='submit' 
            className='mt-3 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white rounded-2xl font-semibold shadow-2xl shadow-emerald-500/10 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2'
          >
            {currState === "login" 
              ? "Sign In" 
              : (isDataSubmitted ? "Complete Registration" : "Continue")}
            <ArrowRightCircle className='w-5 h-5' />
          </button>

          <div className='flex items-center gap-3 mt-1.5 px-1'>
            <input type="checkbox" required className='w-4 h-4 rounded border-white/10 bg-white/5 accent-emerald-500 cursor-pointer' />
            <p className='text-xs text-slate-500'>I agree to the <span className='text-white cursor-pointer hover:underline'>Terms</span> and <span className='text-white cursor-pointer hover:underline'>Privacy Policy</span></p>
          </div>

          <div className='pt-5 mt-2 border-t border-white/5 text-center'>
            {currState === "sign up" ? (
              <p className='text-sm text-slate-400'>
                Already a member? {' '}
                <span 
                  onClick={() => { setCurrState("login"); setIsDataSubmitted(false); }} 
                  className='text-emerald-400 font-medium cursor-pointer hover:text-emerald-300 transition-colors'
                >
                  Sign in
                </span>
              </p>
            ) : (
              <p className='text-sm text-slate-400'>
                New to Chatly? {' '}
                <span 
                  onClick={() => setCurrState("sign up")} 
                  className='text-emerald-400 font-medium cursor-pointer hover:text-emerald-300 transition-colors'
                >
                  Create an account
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;