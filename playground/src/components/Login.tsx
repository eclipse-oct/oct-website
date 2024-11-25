export function Login() {

    // login form with Username and Email and a Login button
    return (
        <div className="flex justify-center items-center h-full">
            <div className="flex flex-col space-y-4">
                <input type="text" placeholder="Username" className="border border-gray-300 rounded-md p-2" />
                <input type="email" placeholder="Email" className="border border-gray-300 rounded-md p-2" />
                <button 
                    className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded" 
                    onClick={() => {}}>
                    Login
                </button>
            </div>
        </div>
    );
}