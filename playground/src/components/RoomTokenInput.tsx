import { useState, useCallback } from "react";

export type RoomTokenInputProps = {
    onToken: (token: string) => void;
}

export function RoomTokenInput(props: RoomTokenInputProps) {
    const [token, setToken] = useState('');
    const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToken(event.target.value);
    }

    const submitToken = useCallback(() => {
        props.onToken(token);
    }, [props.onToken, token]);

    return (
        <div className="flex justify-center items-center h-full">
            <div className="flex flex-col space-y-4">
                <input 
                    value={token}
                    type="text" placeholder="Room Token" 
                    className="border border-gray-300 rounded-md p-2"
                    onChange={handleTokenChange} 
                />
                <button 
                    className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded" 
                    onClick={submitToken}>
                    Submit
                </button>
            </div>
        </div>
    );
}