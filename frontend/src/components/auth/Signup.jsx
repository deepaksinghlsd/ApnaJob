import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2, Eye, EyeOff, FileText, User, Mail, Phone, Lock, Camera } from 'lucide-react';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    profilePhoto: '',
    resume: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e, type) => {
    setInput({ ...input, [type]: e.target.files?.[0] });
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.profilePhoto) {
      toast.error('Profile picture is required!');
      return;
    }

    const formData = new FormData();
    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('password', input.password);
    formData.append('role', input.role);
    formData.append('profilePhoto', input.profilePhoto);
    if (input.resume) {
      formData.append('resume', input.resume);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-50'>
      {/* <Navbar /> */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <form 
          onSubmit={submitHandler} 
          className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white shadow-md border border-gray-200 rounded-lg p-6 sm:p-8"
        >
          <h1 className="font-bold text-2xl mb-5 text-center">Sign Up</h1>
          <div className="mb-4">
            <Label>Full Name</Label>
            <Input type="text" value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder="Enter fullname" />
          </div>
          <div className="mb-4">
            <Label>Email</Label>
            <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="Enter Email" />
          </div>
          <div className="mb-4">
            <Label>Phone Number</Label>
            <Input type="text" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder="Enter your Number" />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                value={input.password} 
                name="password" 
                onChange={changeEventHandler} 
                placeholder="Enter password" 
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4">
            <RadioGroup className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Input type="radio" name="role" value="student" checked={input.role === 'student'} onChange={changeEventHandler} className="cursor-pointer" />
                <Label>Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="cursor-pointer" />
                <Label>Recruiter</Label>
              </div>
            </RadioGroup>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">Profile Photo</Label>
                <Input accept="image/*" type="file" onChange={(e) => changeFileHandler(e, 'profilePhoto')} className="cursor-pointer text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">Resume (PDF, Opt)</Label>
                <Input accept="application/pdf" type="file" onChange={(e) => changeFileHandler(e, 'resume')} className="cursor-pointer text-xs" />
              </div>
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4"> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </Button>
          ) : (
            <Button type="submit" className="w-full my-4">Signup</Button>
          )}
          <span className="text-sm block text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
