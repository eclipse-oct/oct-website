// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { useCallback, useState } from "react";

export type LoginProps = {
    token: string;
    serverUrl: string;
    onLogin: (userName: string, email: string) => void;
    onBack: () => void;
}

export function Login(props: LoginProps) {
    const [termsAccepted, setTermsAccepted] = useState(false);
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

        if (token && serverUrl) {
            const res = await fetch(serverUrl + '/api/login/simple', {
                method: 'POST',
                body: JSON.stringify({ user: userName, email, token }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                props.onLogin(userName, email);
            } else {
                console.error('Login failed');
            }
        }
    }, [props.token, props.serverUrl, props.onLogin, userName, email]);



    return (
        <div className="flex-col justify-center items-center h-full">
            <div className="flex gap-4 mb-4 align-center">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                    />
                    <label className="mt-0">I accept the Eclipse{' '}
                        <a href="http://www.eclipse.org/legal/privacy.php" className="hover:underline text-eminence">Privacy Policy</a>,{' '}
                        <a href="http://www.eclipse.org/legal/termsofuse.php" className="hover:underline text-eminence">Terms of Use</a>
                        {' '}and{' '}
                        <a href="https://www.eclipse.org/org/documents/Community_Code_of_Conduct.php" className="hover:underline text-eminence">Code of Conduct</a>.
                        </label>
                </div>
            { termsAccepted && <div className="flex flex-col space-y-4">
                <input
                    value={userName}
                    type="text" placeholder="Username (required)"
                    className="border border-gray-300 rounded-md p-2"
                    onChange={handleUserNameChange}
                />
                <input
                    type="email" placeholder="Email"
                    className="border border-gray-300 rounded-md p-2"
                    onChange={handleEmailChange}
                />
                <button
                    className="bg-black enabled:hover:bg-gray-500 text-white font-bold py-2 px-4 rounded disabled:opacity-30"
                    onClick={login} disabled={!userName}>
                    Login
                </button>
                <button
                    className="bg-none hover:bg-gray-500 hover:text-white text-columbiaBlue font-bold py-2 px-4 rounded"
                    onClick={props.onBack}>
                    Back
                </button>
            </div>}
        </div>
    );
}