export type StartButtonsProps = {
    onCreateRoom: () => void;
    onJoinRoom: () => void;
}

export function StartButtons(props: StartButtonsProps) {
    return <div className="flex flex-col space-y-4">
        <button
            className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={props.onCreateRoom}
        >
            Create Room
        </button>
        <button
            className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={props.onJoinRoom}
        >
            Join Room
        </button>
    </div>
}