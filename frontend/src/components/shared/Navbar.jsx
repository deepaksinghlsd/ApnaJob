import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Menu, X, Bell, CheckCircle2, Briefcase, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT, NOTIFICATION_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { setNotifications, markNotificationAsRead } from '@/redux/notificationSlice'
import { toast } from 'sonner'
import { ThemeToggle } from './ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import { openModal } from '@/redux/authModalSlice'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { notifications, unreadCount } = useSelector(store => store.notification);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${NOTIFICATION_API_END_POINT}/get`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setNotifications(res.data.notifications));
            }
        } catch (error) {
            console.log("Error fetching notifications:", error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleMarkAsRead = async (id) => {
        try {
            const res = await axios.post(`${NOTIFICATION_API_END_POINT}/mark-read/${id}`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(markNotificationAsRead(id));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-8'>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/">
                        <h1 className='text-2xl font-black tracking-tight text-slate-900 dark:text-white'>
                            Apna<span className='text-primary'>Job</span>
                        </h1>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className='hidden lg:flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-7 text-slate-600 dark:text-slate-300'>
                        {user && user.role === 'recruiter' ? (
                            <>
                                <NavLink to="/admin/companies">Companies</NavLink>
                                <NavLink to="/admin/jobs">Jobs</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/jobs">Jobs</NavLink>
                                <NavLink to="/browse">Browse</NavLink>
                                <NavLink to="/global-search">Global Search</NavLink>
                            </>
                        )}
                    </ul>
                    
                    <div className='flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800'>
                        <ThemeToggle />
                        
                        {user && <NotificationBell unreadCount={unreadCount} notifications={notifications} onRead={handleMarkAsRead} />}
                        
                        {!user ? (
                            <div className='flex items-center gap-3'>
                                <Button 
                                    onClick={() => dispatch(openModal('login'))}
                                    variant="ghost" 
                                    className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold"
                                >
                                    Login
                                </Button>
                                <Button 
                                    onClick={() => dispatch(openModal('signup'))}
                                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95 font-bold rounded-xl px-6"
                                >
                                    Signup
                                </Button>
                            </div>
                        ) : (
                            <UserMenu user={user} logoutHandler={logoutHandler} />
                        )}
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className='flex items-center gap-3 lg:hidden'>
                    <ThemeToggle />
                    {user && <NotificationBell unreadCount={unreadCount} notifications={notifications} onRead={handleMarkAsRead} />}
                    <button onClick={() => setIsOpen(!isOpen)} className='p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className='lg:hidden fixed top-16 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl z-40'
                        >
                            <div className='flex flex-col gap-6 p-2'>
                                <ul className='flex flex-col space-y-4 font-medium'>
                                    {user && user.role === 'recruiter' ? (
                                        <>
                                            <li><Link to="/admin/companies" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Companies</Link></li>
                                            <li><Link to="/admin/jobs" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Jobs</Link></li>
                                        </>
                                    ) : (
                                        <>
                                            <li><Link to="/" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Home</Link></li>
                                            <li><Link to="/jobs" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Jobs</Link></li>
                                            <li><Link to="/browse" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Browse</Link></li>
                                            <li><Link to="/global-search" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors text-primary font-bold">Global Search</Link></li>
                                        </>
                                    )}
                                </ul>
                                
                                <div className='pt-4 border-t border-slate-200 dark:border-slate-800'>
                                    {!user ? (
                                        <div className='flex flex-col gap-3'>
                                            <Button 
                                                onClick={() => { dispatch(openModal('login')); setIsOpen(false); }}
                                                variant="outline" 
                                                className="w-full font-bold rounded-xl"
                                            >
                                                Login
                                            </Button>
                                            <Button 
                                                onClick={() => { dispatch(openModal('signup')); setIsOpen(false); }}
                                                className="w-full font-bold rounded-xl"
                                            >
                                                Signup
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex items-center gap-3 mb-2'>
                                                <Avatar className="h-10 w-10 border-2 border-primary/20">
                                                    <AvatarImage src={user?.profile?.profilePhoto} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                        {user?.fullname?.split(" ").map(n => n[0]).join("").toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='overflow-hidden'>
                                                    <h4 className='font-semibold truncate'>{user?.fullname}</h4>
                                                    <p className='text-xs text-slate-500 truncate'>{user?.email}</p>
                                                </div>
                                            </div>
                                            {user.role === 'student' && (
                                                <Link to="/profile" onClick={() => setIsOpen(false)}>
                                                    <Button variant="outline" className="w-full flex items-center justify-start gap-3">
                                                        <User2 size={18} className="text-primary" />
                                                        Profile
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button onClick={() => { logoutHandler(); setIsOpen(false); }} variant="destructive" className="w-full flex items-center justify-start gap-3 opacity-90">
                                                <LogOut size={18} />
                                                Logout
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

const NavLink = ({ to, children }) => (
    <li>
        <Link to={to} className='relative group py-2'>
            <span className='transition-colors group-hover:text-primary'>{children}</span>
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full'></span>
        </Link>
    </li>
)

const NotificationBell = ({ unreadCount, notifications, onRead }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl">
            <div className='p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between'>
                <h4 className='font-bold text-sm tracking-tight'>Notifications</h4>
                <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider'>Real-time</span>
            </div>
            <div className='max-h-[350px] overflow-y-auto custom-scrollbar'>
                {notifications.length === 0 ? (
                    <div className='flex flex-col items-center justify-center p-10 text-center'>
                        <div className='h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3'>
                            <Bell className='h-6 w-6 text-slate-300' />
                        </div>
                        <p className='text-sm text-slate-500'>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div 
                            key={n._id} 
                            onClick={() => onRead(n._id)}
                            className={`p-4 border-b border-slate-50 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 flex gap-3 ${!n.isRead ? 'bg-primary/[0.03] dark:bg-primary/[0.02]' : ''}`}
                        >
                            <div className={`mt-1 h-2 w-2 min-w-[8px] rounded-full ${n.type === 'auto-apply' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-blue-500'}`} />
                            <div className='flex-1'>
                                <p className={`text-xs leading-relaxed ${!n.isRead ? 'font-semibold text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {n.message}
                                </p>
                                <p className='text-[10px] text-slate-400 mt-1.5 font-medium'>
                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {notifications.length > 0 && (
                <div className='p-2 bg-slate-50/30 dark:bg-slate-900/30'>
                    <Button variant="ghost" className="w-full text-[11px] h-8 text-primary hover:text-primary/80 hover:bg-transparent font-semibold">View All Notifications</Button>
                </div>
            )}
        </PopoverContent>
    </Popover>
)

const UserMenu = ({ user, logoutHandler }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Avatar className="cursor-pointer h-9 w-9 border-2 border-primary/10 hover:border-primary/30 transition-colors shadow-sm">
                <AvatarImage src={user?.profile?.profilePhoto} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {user?.fullname?.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl">
            <div className='p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10'>
                <div className='flex items-center gap-3'>
                    <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-sm">
                        <AvatarImage src={user?.profile?.profilePhoto} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {user?.fullname?.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='overflow-hidden'>
                        <h4 className='font-bold text-sm truncate dark:text-white'>{user?.fullname}</h4>
                        <p className='text-[11px] text-slate-500 truncate font-medium'>{user?.email}</p>
                    </div>
                </div>
            </div>
            <div className='p-2 flex flex-col gap-1'>
                {user && user.role === 'student' && (
                    <Link to="/profile" className='w-full'>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all">
                            <User2 className="h-4 w-4" />
                            <span className='text-sm'>My Profile</span>
                        </Button>
                    </Link>
                )}
                <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all">
                    <Briefcase className="h-4 w-4" />
                    <span className='text-sm'>Active Applications</span>
                </Button>
                <div className='h-px bg-slate-100 dark:bg-slate-800 my-1' />
                <Button 
                    onClick={logoutHandler} 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    <span className='text-sm font-semibold'>Logout</span>
                </Button>
            </div>
        </PopoverContent>
    </Popover>
);

export default Navbar