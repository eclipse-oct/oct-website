// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { useCallback, useState } from "react";

export type LoginProps = {
    token: string;
    serverUrl: string;
    // info for the oauth login to determine the redirect url
    currentAction?: 'create' | string | undefined;
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
        <div className="flex flex-col justify-center items-center h-full">
            <div className="flex gap-2 mb-4 items-center">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                    />
                    <label className="mt-0">I accept the Eclipse{' '}
                        <a href="https://www.eclipse.org/legal/privacy/" className="hover:underline text-eminence">Privacy Policy</a>,{' '}
                        <a href="https://www.eclipse.org/legal/terms-of-use/" className="hover:underline text-eminence">Terms of Use</a>
                        {' '}and{' '}
                        <a href="https://www.eclipse.org/org/documents/Community_Code_of_Conduct.php" className="hover:underline text-eminence">Code of Conduct</a>.
                        </label>
                </div>
            <div className="flex flex-col space-y-4">
                <OAuthButton icon="/assets/github-mark.svg" alt="GitHub logo" text="Log in with GitHub"
                    serverUrl={props.serverUrl} token={props.token} endpoint="/api/login/github"
                    termsAccepted={termsAccepted} currentAction={props.currentAction}/>
                <OAuthButton icon="/assets/google-g.svg" alt="Google logo" text="Log in with Google"
                    serverUrl={props.serverUrl} token={props.token} endpoint="/api/login/google"
                    termsAccepted={termsAccepted} currentAction={props.currentAction}/>
                <OAuthButton  icon="/assets/eclipse-mark.svg" alt="Eclipse logo" text="Log in with Eclipse"
                    serverUrl={props.serverUrl} token={props.token} endpoint="/api/login/keycloak"
                    termsAccepted={termsAccepted} currentAction={props.currentAction}/>

                <hr className="border-gray-300" />

                <h2 className="text-2xl font-bold text-center">Unverified Login</h2>

                <input
                    value={userName}
                    style={{opacity: termsAccepted ? 1 : 0.5}}
                    type="text" placeholder="Username (required)"
                    className="border border-gray-300 rounded-md p-2"
                    onChange={handleUserNameChange}
                    disabled={!termsAccepted}
                />
                <input
                    type="email" placeholder="Email"
                    style={{opacity: termsAccepted ? 1 : 0.5}}
                    className="border border-gray-300 rounded-md p-2"
                    onChange={handleEmailChange}
                    disabled={!termsAccepted}
                />
                <button
                    className="bg-darkBlue enabled:hover:bg-gray-500 text-white font-bold py-2 px-4 rounded disabled:opacity-30"
                    style={{opacity: (termsAccepted && userName) ? 1 : 0.5}}
                    onClick={login} disabled={!userName}>
                    Login
                </button>
                <button
                    className="bg-none hover:bg-gray-500 hover:text-white font-bold py-2 px-4 rounded"
                    style={{opacity: 1}}
                    onClick={props.onBack}>
                    Back
                </button>
            </div>
        </div>
    );
}

interface OAuthButtonProps {
    icon: string;
    alt: string;
    text: string;
    serverUrl: string;
    endpoint: string;
    token: string;
    termsAccepted?: boolean;
    currentAction?: 'create' | string | undefined;
}

function OAuthButton({icon, text, alt, serverUrl, endpoint, token, termsAccepted, currentAction}: OAuthButtonProps) {
    let query = ''
    if( currentAction === 'create') {
        query += 'create';
    } else if (typeof currentAction === 'string') {
        query += `room=${currentAction}`;
    }

    const redirect = `${window.location.origin}${window.location.pathname}?${query}`;
    return <a style={termsAccepted ? {} : {opacity: 0.5, pointerEvents: 'none', cursor: 'default'}} href={`${serverUrl}${endpoint}?token=${token}&redirect=${redirect}`}
                id="login-github">
        <div className="px-3 py-2 font-barlow text-white text-[1.2rem] font-medium bg-eminence rounded-xl cursor-pointer flex items-center border-none">
            <img src={icon} alt={alt} className="w-7 h-7 mr-2"/>
            <span>{text}</span>
        </div>
    </a>
}
