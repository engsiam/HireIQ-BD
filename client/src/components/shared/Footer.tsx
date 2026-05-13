'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const footerLinks = {
    platform: [
      { label: 'Browse Jobs', href: '/jobs' },
      { label: 'AI CV Analyzer', href: '/ai-tools' },
      { label: 'Post a Job', href: '/register' },
      { label: 'Pricing', href: '/pricing' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security', href: '/security' },
    ],
  };

  return (
    <footer className="bg-[#0F0808] dark:bg-[#0B1120] border-t border-gray-800 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">

              <div>
                <span className="text-xl font-bold text-white">Hire<span className="text-[#EB4C4C]">IQ</span> BD</span>
                <span className="text-[10px] block text-gray-400">AI-Powered Jobs</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Bangladesh&apos;s premier AI-powered job platform. Connecting top talent with leading companies through intelligent matching technology.
            </p>

            <div className="space-y-3 text-gray-400 text-sm">
              <p>support@hireiq.com.bd</p>
              <p>+880 1234 567 890</p>
              <p>Gulshan-2, Dhaka, Bangladesh</p>
            </div>

            <div className="flex gap-3">
              <a href="https://facebook.com/hireiqbd" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#EB4C4C] hover:text-white transition-all">F</a>
              <a href="https://twitter.com/hireiqbd" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#EB4C4C] hover:text-white transition-all">T</a>
              <a href="https://linkedin.com/company/hireiqbd" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#EB4C4C] hover:text-white transition-all">L</a>
              <a href="https://instagram.com/hireiqbd" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#EB4C4C] hover:text-white transition-all">I</a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h5 className="text-white font-bold text-sm uppercase tracking-wider">Platform</h5>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#EB4C4C] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h5 className="text-white font-bold text-sm uppercase tracking-wider">Company</h5>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#EB4C4C] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h5 className="text-white font-bold text-sm uppercase tracking-wider">Legal</h5>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#EB4C4C] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-bold text-lg">Stay updated with latest jobs</h4>
              <p className="text-gray-400 text-sm mt-1">Get the latest job alerts delivered to your inbox</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#EB4C4C] w-64"
              />
              <button className="px-6 py-3 bg-[#EB4C4C] hover:bg-[#d43e3e] text-white font-bold rounded-xl transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© {year} HireIQ BD. All rights reserved.</p>
            <p className="text-gray-500 text-sm">Made with ❤️ in Bangladesh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}