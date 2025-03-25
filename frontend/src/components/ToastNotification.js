'use client';

import React, { useState, useEffect } from 'react';

export function showToast(message) {
  // Create and dispatch a custom event
  const event = new CustomEvent('showToastNotification', { detail: { message } });
  document.dispatchEvent(event);
}

export default function ToastNotification() {
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    // Function to handle showing toasts
    const handleShowToast = (event) => {
      const { message } = event.detail;
      const id = Date.now();
      
      // Add new toast
      setToasts(prev => [...prev, { id, message }]);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 3000);
    };
    
    // Add event listener
    document.addEventListener('showToastNotification', handleShowToast);
    
    // Cleanup
    return () => {
      document.removeEventListener('showToastNotification', handleShowToast);
    };
  }, []);
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className="bg-black text-white px-4 py-2 rounded shadow-lg animate-fade-in"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

// Add this CSS to your globals.css
/* 
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
*/ 