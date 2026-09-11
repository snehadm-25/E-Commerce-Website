import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PremiumStore. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition duration-200">Terms</a>
            <a href="#" className="hover:text-white transition duration-200">Privacy</a>
            <a href="#" className="hover:text-white transition duration-200">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
