import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-8 w-full max-w-lg transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
