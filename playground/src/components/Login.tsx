import { useCallback, useState } from "react";

export type LoginProps = {
    token: string;
    serverUrl: string;
    onLogin: (userName: string, email: string) => void;
}

export function Login(props: LoginProps) {
    const [userName, setUserName] = useState('');
    const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    }
    const [email, setEmail] = useState('');
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }
    
    const login = useCallback(async () => {
        const token = props.token;
        const serverUrl = props.serverUrl;

        if(token && serverUrl) {
            const res = await fetch(serverUrl + '/api/login/simple', {
                method: 'POST',
                body: JSON.stringify({ user: userName, email, token }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(res.ok) {
                props.onLogin(userName, email);
            } else {
                console.error('Login failed');
            }
        }
    }, [props.token, props.serverUrl, props.onLogin, userName, email]);

    return (
        <div className="flex justify-center items-center h-full">
            <div className="flex flex-col space-y-4">
                <input 
                    value={userName}
                    type="text" placeholder="Username" 
                    className="border border-gray-300 rounded-md p-2"
                    onChange={handleUserNameChange} 
                />
                <input 
                    type="email" placeholder="Email" 
                    className="border border-gray-300 rounded-md p-2" 
                    onChange={handleEmailChange}
                />
                <button 
                    className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded" 
                    onClick={login}>
                    Login
                </button>
            </div>
        </div>
    );
}