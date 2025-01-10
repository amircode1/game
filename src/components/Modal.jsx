// Modal.jsx
import React, { useState, useEffect } from 'react';

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []); // Empty dependency array ensures this effect runs once on mount

  const closeModal = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-auto">
        <h2 className="text-xl font-bold mb-4">Welcome to Our Web App!</h2>
        <h2 className="text-xl font-bold mb-4">If the web app doesn't open, be sure to use VPN.</h2>
        <button 
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
