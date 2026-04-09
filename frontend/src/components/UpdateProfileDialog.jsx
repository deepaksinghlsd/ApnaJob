import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, Upload, X, Briefcase, User, Phone, Mail, FileText, Image as ImageIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        profilePhoto: null,
        resume: null
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e, type) => {
        const file = e.target.files?.[0];
        setInput({ ...input, [type]: file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        if (input.resume) {
            formData.append("resume", input.resume);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent 
                className="sm:max-w-[550px] bg-white dark:bg-slate-900 border-none rounded-[2.5rem] shadow-2xl p-0 overflow-hidden" 
                onInteractOutside={() => setOpen(false)}
            >
                <div className="bg-primary/5 h-2 w-full absolute top-0 left-0" />
                
                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <User size={20} />
                        </div>
                        Edit Professional Profile
                    </DialogTitle>
                    <p className="text-slate-500 text-sm font-medium">Keep your credentials up to date for precise matching.</p>
                </DialogHeader>

                <form onSubmit={submitHandler} className="p-8 pt-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullname" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <User size={16} />
                                </div>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="pl-11 h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Phone size={16} />
                                </div>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="pl-11 h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Professional Bio</Label>
                        <Input
                            id="bio"
                            name="bio"
                            value={input.bio}
                            onChange={changeEventHandler}
                            placeholder="Briefly describe your career goals..."
                            className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold focus-visible:ring-primary/20"
                        />
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <Label htmlFor="skills" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Core Skills (Comma separated)</Label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Briefcase size={16} />
                            </div>
                            <Input
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                placeholder="React, Node.js, Python..."
                                className="pl-11 h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Profile Photo */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Profile Photo</Label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    id="profilePhoto"
                                    accept="image/*"
                                    onChange={(e) => fileChangeHandler(e, 'profilePhoto')}
                                    className="hidden"
                                />
                                <label 
                                    htmlFor="profilePhoto" 
                                    className="flex items-center justify-between px-4 h-14 bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <ImageIcon size={16} className="text-primary" />
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                                            {input.profilePhoto ? input.profilePhoto.name : "Change Photo"}
                                        </p>
                                    </div>
                                    <Upload size={14} className="text-primary" />
                                </label>
                            </div>
                        </div>

                        {/* Resume Upload */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Resume (PDF)</Label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    id="resume"
                                    accept="application/pdf"
                                    onChange={(e) => fileChangeHandler(e, 'resume')}
                                    className="hidden"
                                />
                                <label 
                                    htmlFor="resume" 
                                    className="flex items-center justify-between px-4 h-14 bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText size={16} className="text-primary" />
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                                            {input.resume ? input.resume.name : "Update Resume"}
                                        </p>
                                    </div>
                                    <Upload size={14} className="text-primary" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-16 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Updating Intelligence...
                                </>
                            ) : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog