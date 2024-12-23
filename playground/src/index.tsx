import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import { App } from './components/App.js'

import './index.css'
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
    <App />
)
