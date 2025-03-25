"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardTest() {
  console.log("DashboardTest component rendering");
  const [count, setCount] = useState(0);
  
  return (
    <div style={{padding: "20px"}}>
      <h1>Dashboard Test</h1>
      <p>Count: {count}</p>
      <button
        onClick={() => {
          console.log("Increment clicked");
          setCount(count + 1);
        }}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Increment
      </button>
      
      <div style={{marginTop: "20px"}}>
        <Link 
          href="/dashboard"
          style={{
            color: "blue",
            textDecoration: "underline"
          }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
} 