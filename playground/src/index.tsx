// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import './style.css'
import { App } from './components/App.js'
// import { createBrowserRouter, RouterProvider } from 'react-router'

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <App /> 
//     }
// ]);

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
    // <RouterProvider router={router} />
    <div className="flex flex-col min-h-screen">
        
        <App />
       
    </div>
)
