'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { showToast } from './ToastNotification';

// This is a wrapper around the Button component that ensures clicks are properly handled
export default function ReliableButton({
  children,
  onClick,
  className,
  actionName,
  ...props
}) {
  const handleClick = (e) => {
    // Prevent event from bubbling up to parent elements
    e.stopPropagation();
    
    // Define message to display
    const message = actionName || 
      (typeof children === 'string' ? `Clicked: "${children}"` : 'Button clicked');
    
    // Show visible feedback
    console.log('Button clicked:', message);
    showToast(message);
    
    // Call the original onClick handler if it exists
    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  return (
    <Button
      className={className}
      onClick={handleClick}
      {...props}
      style={{
        pointerEvents: 'auto',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...props.style
      }}
    >
      {children}
    </Button>
  );
} 