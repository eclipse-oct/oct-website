// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

export type StartButtonsProps = {
    onCreateRoom: () => void;
    onJoinRoom: () => void;
    onLogout: () => void;
    authenticated: boolean;
}

export function StartButtons(props: StartButtonsProps) {
    return <div className="flex flex-col space-y-4">
        <button
            className="bg-richBlack hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={props.onCreateRoom}
        >
            Create Room
        </button>
        <button
            className="bg-richBlack hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={props.onJoinRoom}
        >
            Join Room
        </button>
        {props.authenticated && (
            <button
                className="bg-transparent hover:bg-gray-500 text-grey font-bold py-2 px-4 rounded"
                onClick={props.onLogout}
            >
                Logout
            </button>
        )}
    </div>
}