import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import { App } from './components/App.js'

import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Login } from './components/Login.js'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
    <BrowserRouter>
        <Routes>
            <Route index element={<App />} />
            <Route path='login' element={<Login />} />
        </Routes>
    </BrowserRouter>
)
