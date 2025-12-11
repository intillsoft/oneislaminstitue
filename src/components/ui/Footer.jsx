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
        { label: 'Browse Jobs', path: '/job-search-browse' },
        { label: 'Browse Talents', path: '/talent/discover' },
        { label: 'For Recruiters', path: '/recruiter-dashboard-analytics' },
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
    <footer className="footer-container">
      <div className="footer-content">
        {footerColumns.map((column, index) => (
          <motion.div
            key={column.title}
            className="footer-column"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="footer-title">{column.title}</h3>
            <ul className="footer-links">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © {currentYear} Workflow. All rights reserved.
        </p>
        <div className="social-links">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                whileHover={{ scale: 1.1, y: -2 }}
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
