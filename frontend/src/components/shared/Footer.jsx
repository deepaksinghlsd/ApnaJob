import React from "react";
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Mail, Github, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#020817] border-t border-slate-100 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link to="/">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Career<span className="text-primary">Spriter</span>
              </h2>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Empowering careers through AI-driven intelligence. Find your next opportunity with precision and speed.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={<Linkedin size={18} />} href="https://www.linkedin.com/in/deepak-kumar-singh-486994215" />
              {/* <SocialIcon icon={<Twitter size={18} />} href="https://twitter.com" /> */}
              <SocialIcon icon={<Instagram size={18} />} href="https://www.instagram.com/deepaksingh_lsd  " />
              <SocialIcon icon={<Github size={18} />} href="https://github.com/deepaksinghlsd/deepaksinghlsd" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Discovery</h3>
            <ul className="space-y-4 font-bold text-slate-500 dark:text-slate-400">
              <li><Link to="/jobs" className="hover:text-primary transition-colors">Local Jobs</Link></li>
              <li><Link to="/global-search" className="hover:text-primary transition-colors">Global Search</Link></li>
              <li><Link to="/browse" className="hover:text-primary transition-colors">Browse Roles</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Company</h3>
            <ul className="space-y-4 font-bold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">About Mission</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Settings</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Contact</h3>
            <ul className="space-y-4 font-bold text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary" />
                <span>support@CareerSpriter.com</span>
              </li>
              <li className="text-xs italic mt-4 opacity-70">
                Facing issues? Our AI support team is available 24/7 to assist your career journey.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
            © {currentYear} CareerSpriter. All rights reserved. Built with precision for the future of work.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-300 dark:text-slate-700">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
