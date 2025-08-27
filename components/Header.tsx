import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { APP_NAME } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg w-full sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FacebookIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-xl font-bold text-white tracking-wider">{APP_NAME}</h1>
        </div>
        <div className="text-sm text-gray-400">
          Platform Interaksi Eksklusif
        </div>
      </div>
    </header>
  );
};

export default Header;
