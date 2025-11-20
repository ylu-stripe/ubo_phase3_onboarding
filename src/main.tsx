import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/components.css'
import './styles/animations.css'

// Use basename only in production (GitHub Pages)
const basename = process.env.NODE_ENV === 'production' ? '/ubo_phase3_onboarding' : '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

