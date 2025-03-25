"use client";

import { useState } from "react";

export default function TestButtons() {
  // Using React state
  const [reactCount, setReactCount] = useState(0);
  
  // Function to update a counter via DOM manipulation
  function incrementCounter() {
    const counter = document.getElementById('vanilla-counter');
    if (counter) {
      const currentValue = parseInt(counter.innerText || '0', 10);
      counter.innerText = currentValue + 1;
    }
  }
  
  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h1 style={{marginBottom: '20px'}}>Button Test Page</h1>
      
      <hr style={{margin: '20px 0', border: 'none', height: '1px', backgroundColor: '#ddd'}} />
      
      <h2>React Button</h2>
      <p>Counter: {reactCount}</p>
      <button
        onClick={() => setReactCount(reactCount + 1)}
        style={{
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '10px 0'
        }}
      >
        Increment React Counter
      </button>
      
      <hr style={{margin: '20px 0', border: 'none', height: '1px', backgroundColor: '#ddd'}} />
      
      <h2>Vanilla HTML Button</h2>
      <p>Counter: <span id="vanilla-counter">0</span></p>
      {/* Using direct HTML onclick attribute */}
      <button
        id="vanilla-button"
        style={{
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '10px 0'
        }}
        // The onclick HTML attribute works even if React event handlers are broken
        onClick={incrementCounter}
      >
        Increment Vanilla Counter
      </button>
      
      <hr style={{margin: '20px 0', border: 'none', height: '1px', backgroundColor: '#ddd'}} />
      
      <h2>Direct HTML Attributes</h2>
      <p>These buttons use direct HTML attributes</p>
      <button 
        id="direct-button"
        style={{
          padding: '10px 20px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '10px 0'
        }}
        onClick={() => alert('Direct button clicked')}
      >
        Alert Button
      </button>
      
      <hr style={{margin: '20px 0', border: 'none', height: '1px', backgroundColor: '#ddd'}} />
      
      <a 
        href="/dashboard" 
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: 'purple',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '20px'
        }}
      >
        Back to Dashboard
      </a>
    </div>
  );
} 