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
        <header className="w-full flex justify-center sticky bg-richBlack">
            <div className="flex flex-wrap justify-between items-center max-w-[1300px] w-[85%]">
                <a href="https://www.open-collab.tools/" target="_blank" className="no-underline">
                    <div className="flex items-center">
                        <img src="/assets/logo.jpg" alt="Open Collaboration Tools Logo" className="w-[110px] h-[110px]" />
                        <h1 className="my-[0.67em] text-[32px] font-barlow text-columbiaBlue md:text-[32px] leading-[normal]">Open Collaboration Tools</h1>
                    </div>
                </a>
                <div className="flex-grow"></div>
                <nav className="flex items-center">
                    <a href="https://github.com/TypeFox/open-collaboration-tools/discussions" className="ml-6 font-urbanist font-bold text-columbiaBlue hover:underline" target='_blank'>Community</a>
                    <a href="https://www.typefox.io" className="ml-6 font-urbanist font-bold text-columbiaBlue hover:underline" target='_blank'>Support</a>
                </nav>
                <nav className="flex items-center">
                    <a href="https://github.com/TypeFox/open-collaboration-tools" target="_blank" className="ml-6">
                        <img src="/assets/github-mark.svg" alt="GitHub Repository" className="w-[43px] h-[43px]" />
                    </a>
                </nav>
            </div>
        </header>
        <App />
        <footer className="w-full flex justify-center items-center text-white bg-eminence font-barlow font-light">
            <div className="flex justify-between items-center gap-4 w-4/5 max-w-[640px]">
                <a href="https://www.open-collab.tools/privacy/" target='_blank' className="hover:underline">Privacy Policy</a>
                <p className="my-[1em]"> • </p>
                <a href="https://www.open-collab.tools/tos/" target='_blank' className="hover:underline">Terms of Use</a>
                <p> • </p>
                <div>
                    Copyright ©️ <a href="https://www.typefox.io/" target="_blank" className="hover:underline">TypeFox GmbH</a>
                </div>
            </div>
        </footer>
    </div>
)
