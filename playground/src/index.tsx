// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import './style.css'
import { App } from './components/App.js'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
    // <RouterProvider router={router} />
    <>
    <header className="w-full h-[70px] flex justify-center sticky bg-[#fefaf4] bg-[url(/assets/header-background.webp)] bg-cover bg-center">
        <div className="flex flex-wrap justify-between items-center py-2 w-[90%] max-w-[1300px]">
            <a href="/" className="no-underline">
                <img src="/assets/oct-logo-acronym.svg" alt="Open Collaboration Tools" className="h-[50px]" />
            </a>
            <div className="flex-grow"></div>
            <nav className="hidden md:flex items-center">
                <a href="/playground" className="ml-6 font-urbanist font-bold text-darkBlue hover:underline">Playground</a>
                <a href="https://github.com/TypeFox/open-collaboration-tools/discussions" className="ml-6 font-urbanist font-bold text-darkBlue hover:underline">Community</a>
                <a href="https://www.typefox.io" className="ml-6 font-urbanist font-bold text-darkBlue hover:underline">Support</a>
                <a href="https://github.com/TypeFox/open-collaboration-tools" target="_blank" className="ml-6">
                    <img src="/assets/github-mark-header.svg" alt="GitHub Repository" className="w-[30px] h-[30px]" />
                </a>
            </nav>
        </div>
    </header>
    <main className="h-[calc(100vh-130px)] flex flex-col">
        <App />
    </main>
    <footer className="w-full h-[60px] flex items-center justify-center font-light text-white bg-darkBlue font-barlow text-xs md:text-base">
        <div className="flex justify-center items-center gap-3 md:gap-4 py-2 w-[90%] max-w-[1300px]">
            <a href="https://www.eclipse.org/legal/privacy/" className="text-center hover:underline">Privacy Policy</a>
            <p className="md:px-2"> • </p>
            <a href="https://www.eclipse.org/legal/terms-of-use/" className="text-center hover:underline">Terms of Use</a>
            <p className="md:px-2"> • </p>
            <a href="https://www.eclipse.org/legal/copyright/" className="text-center hover:underline">Copyright Agent</a>
            <p className="md:px-2"> • </p>
            <a href="https://www.eclipse.org/legal" className="text-center hover:underline">Legal</a>
            <p className="md:px-2"> • </p>
            <div className="text-center">
                &copy; 2025 by <a href="https://www.eclipse.org/" target="_blank" className="hover:underline">Eclipse
                    Foundation</a>
            </div>
        </div>
    </footer>
    </>
)
