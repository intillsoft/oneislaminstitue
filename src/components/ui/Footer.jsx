import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerColumns = [
    {
      title: 'Product',
      links: [
        { label: 'Browse Jobs', path: '/jobs' },
        { label: 'Browse Talents', path: '/talent/discover' },
        { label: 'For Recruiters', path: '/recruiter/dashboard' },
        { label: 'Pricing', path: '/pricing' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', path: '/blog' },
        { label: 'Help Center', path: '/help' },
        { label: 'Career Guide', path: '/career-guide' },
        { label: 'API Documentation', path: '/api-docs' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Careers', path: '/careers' },
        { label: 'Privacy Policy', path: '/privacy' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Cookie Policy', path: '/cookies' },
        { label: 'GDPR', path: '/gdpr' },
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
    <footer className="footer-container" style={{ padding: '32px 40px', background: '#003D6B', color: '#FFFFFF', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap', gap: '20px' }}>
        <p className="copyright" style={{ color: '#E2E8F0', fontSize: '13px', margin: 0, fontWeight: 500 }}>
          © {currentYear} Hope Dawah Institute. All rights reserved.
        </p>
        <div className="social-links" style={{ display: 'flex', gap: '16px' }}>
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: 'rgba(255,255,255,0.08)', 
                  border: '1px solid rgba(255,255,255,0.15)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#F1F5F9', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                whileHover={{ scale: 1.1, y: -2, background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <IconComponent className="icon" size={20} />
              </motion.a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
