import React from 'react';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800/30 w-full mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p>Dibuat untuk Komunitas Facebook Profesional.</p>
      </div>
    </footer>
  );
};

export default Footer;
