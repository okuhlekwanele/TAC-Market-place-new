import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ Import BrowserRouter
import App from './App.tsx';
import './index.css';

// Add error handling for the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter> {/* ✅ Wrap App in Router */}
        <App />
      </BrowserRouter>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  
  // Fallback error display
  rootElement.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #fef2f2 0%, #fef3c7 100%);
      font-family: system-ui, -apple-system, sans-serif;
      padding: 1rem;
    ">
      <div style="
        text-align: center;
        max-width: 400px;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      ">
        <div style="
          width: 4rem;
          height: 4rem;
          background: #fee2e2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 2rem;
        ">⚠️</div>
        <h2 style="color: #1f2937; margin-bottom: 1rem;">App Failed to Load</h2>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">
          Please check your environment configuration and try again.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            background: #dc2626;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
          "
        >
          Reload Page
        </button>
      </div>
    </div>
  `;
}
