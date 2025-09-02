'use client';

import React, { useEffect } from 'react';
import { showToast } from './ToastNotification';

// This component should be added to the layout or anywhere in the app to fix clicking issues
export default function ButtonFixer() {
  useEffect(() => {
    function enhanceButtons() {
      // console.log('Enhancing clickable elements...'); // Removed spam
      
      const clickableElements = document.querySelectorAll('button, a, [role="button"], .btn, [class*="button"]');
      
      clickableElements.forEach(el => {
        if (el.getAttribute('data-enhanced')) return;
        
        // Make sure element is styled for clicking
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        el.style.userSelect = 'none';
        el.style.WebkitTapHighlightColor = 'transparent';
        
        // Add enhanced attribute to prevent re-enhancing
        el.setAttribute('data-enhanced', 'true');
        
        // Add multiple event listeners to ensure clicks are captured
        ['mousedown', 'touchstart'].forEach(eventType => {
          el.addEventListener(eventType, (e) => {
            // Check for specific classes or characteristics to determine what was clicked
            const tagName = el.tagName.toLowerCase();
            const className = el.className || '';
            const text = el.innerText || el.textContent || '';
            const href = el.getAttribute('href') || '';
            
            // Create descriptive message
            let actionDescription = 'Clicked: ';
            if (text && text.trim().length < 30) {
              actionDescription += `"${text.trim()}"`;
            } else if (tagName === 'a' && href) {
              actionDescription += `Link to ${href}`;
            } else {
              actionDescription += `${tagName} element`;
            }
            
            // Log enhanced click
            console.log('ENHANCED CLICK:', actionDescription);
            
            // Show toast notification
            showToast(actionDescription);
            
            // Call the original onClick handler if it exists
            const onClick = el.onclick;
            if (typeof onClick === 'function') {
              // Create a synthetic event similar to original
              const syntheticEvent = {
                target: e.target,
                currentTarget: el,
                preventDefault: () => e.preventDefault(),
                stopPropagation: () => e.stopPropagation()
              };
              
              // Call original handler
              onClick.call(el, syntheticEvent);
            }
            
            // For links, trigger navigation if no href was specified
            if (tagName === 'a' && href && !e.defaultPrevented) {
              setTimeout(() => {
                window.location.href = href;
              }, 10);
            }
          }, { capture: true });
        });
      });
    }
    
    // Run immediately
    enhanceButtons();
    
    // Run periodically to catch any new elements (less frequent)
    const interval = setInterval(enhanceButtons, 10000); // Changed from 2000 to 10000
    
    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      let shouldEnhance = false;
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldEnhance = true;
        }
      });
      
      if (shouldEnhance) {
        enhanceButtons();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Cleanup
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);
  
  // This component doesn't render anything
  return null;
} 