import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Facebook, Instagram, Heart, ArrowRight, BookOpen } from 'lucide-react';
import Logo from '../Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerColumns = [
    {
      title: 'Academic Pathways',
      links: [
        { label: 'All Courses', path: '/courses' },
        { label: 'Scholar Dashboard', path: '/dashboard' },
        { label: 'Study Progress', path: '/dashboard/progress' },
      ]
    },
    {
      title: 'Institute Resources',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Curation Team', path: '/team' },
        { label: 'Sacred Sciences', path: '/courses' },
      ]
    },
    {
      title: 'Scholar Portal',
      links: [
        { label: 'Impact Support', path: '/donate' },
        { label: 'Scholar Login', path: '/login' },
        { label: 'Settings', path: '/settings' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className="bg-[var(--color-primary)] dark:bg-[#070b19] border-t border-transparent dark:border-white/5 text-white dark:text-foreground transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Subtle bottom-right dynamic light gradient accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 dark:bg-[var(--color-primary)]/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 dark:bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        
        {/* Sleek, Minimalistic Quote Plate */}
        <div className="mb-10 p-5 rounded-2xl bg-black/10 dark:bg-[#0c1228]/50 border border-white/10 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 dark:bg-[var(--color-primary)]/10 flex items-center justify-center text-white dark:text-[var(--color-primary)] shrink-0">
              <BookOpen size={16} />
            </div>
            <div>
              <p className="text-xs font-medium italic text-white/90 dark:text-slate-300 leading-relaxed">
                "Whoever takes a path to seek knowledge, Allah makes easy for him a path to Paradise."
              </p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/70 dark:text-[var(--color-primary)] mt-1 opacity-70">— Sahih Muslim</p>
            </div>
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[var(--color-primary)] hover:bg-white/90 dark:hover:bg-[var(--color-primary)]/90 text-[var(--color-primary)] dark:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            Start Seeking <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-100 dark:border-white/5">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="sm" className="mr-8" inverse={true} />
            <p className="text-xs text-white/80 dark:text-muted-foreground max-w-sm leading-relaxed font-light">
              Hope Dawah Institute is dedicated to providing structured Islamic curriculum curated from verified classical repositories. Master the sacred sciences with academic excellence.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-black/10 dark:bg-[#0c1228] hover:bg-white/20 dark:hover:bg-[var(--color-primary)]/15 border border-white/10 dark:border-white/5 flex items-center justify-center text-white/80 dark:text-muted-foreground hover:text-white dark:hover:text-[var(--color-primary)] transition-all duration-200 shadow-sm"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <IconComponent size={14} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Columns */}
          {footerColumns.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white dark:text-[var(--color-primary)]">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.path}
                      className="text-xs text-white/70 dark:text-muted-foreground hover:text-white dark:hover:text-[var(--color-primary)] font-medium flex items-center gap-1 transition-colors duration-200 group"
                    >
                      <ArrowRight size={8} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-white dark:text-[var(--color-primary)]" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Footer Bottom Block */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-white/50 dark:text-muted-foreground uppercase tracking-wider">
            © {currentYear} Hope Dawah Institute. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/60 dark:text-muted-foreground">
            <Link to="/terms" className="hover:text-white dark:hover:text-[var(--color-primary)] transition-all">Terms</Link>
            <span className="opacity-25">•</span>
            <Link to="/privacy" className="hover:text-white dark:hover:text-[var(--color-primary)] transition-all">Privacy</Link>
            <span className="opacity-25">•</span>
            <Link to="/donate" className="hover:text-white dark:hover:text-[var(--color-primary)] transition-all flex items-center gap-1">
              <Heart size={9} className="fill-destructive text-destructive" /> Support Us
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
