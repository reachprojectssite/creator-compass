// Global script to fix clickability issues
if (typeof window !== 'undefined') {
  (function() {
    console.log("Global click enhancement script loaded!");
    
    // Function to make an element fully clickable
    function enhanceClickability(element) {
      if (!element) return;
      
      // Add necessary style attributes
      element.style.cursor = "pointer";
      element.style.pointerEvents = "auto";
      
      // Add multiple event listeners in case one doesn't work
      const forceTriggerClick = function(e) {
        console.log("Enhanced click detected on:", element);
        
        // If this element has an onClick prop in React, try to trigger it
        const reactProps = element._reactProps;
        if (reactProps && reactProps.onClick) {
          reactProps.onClick(e);
        }
        
        // Try to trigger a native click event
        try {
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          element.dispatchEvent(clickEvent);
        } catch (error) {
          console.log("Error dispatching click event:", error);
        }
      };
      
      // Attach additional event listeners for redundancy
      element.addEventListener("mousedown", forceTriggerClick);
      element.addEventListener("touchstart", forceTriggerClick);
    }
    
    // Function to enhance all clickable elements on the page
    function enhanceAllClickableElements() {
      console.log("Enhancing all clickable elements");
      
      // Enhance all buttons
      document.querySelectorAll('button, a, [role="button"], [onClick]').forEach(enhanceClickability);
      
      // Specifically target elements with common button class names
      document.querySelectorAll('.btn, .button, [class*="button"], [class*="btn"]').forEach(enhanceClickability);
      
      // Enhance other potentially clickable elements with cursor:pointer style
      document.querySelectorAll('[style*="cursor: pointer"], [style*="cursor:pointer"]').forEach(enhanceClickability);
    }
    
    // Run on page load
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(enhanceAllClickableElements, 500);
    } else {
      document.addEventListener("DOMContentLoaded", function() {
        setTimeout(enhanceAllClickableElements, 500);
      });
    }
    
    // Re-run periodically to catch dynamically added elements
    setInterval(enhanceAllClickableElements, 2000);
    
    // Also run when the DOM changes
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function(mutations) {
        enhanceAllClickableElements();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  })();
} 