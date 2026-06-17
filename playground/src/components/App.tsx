// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { Login } from "./Login.js";
import { StartButtons } from "./StartButtons.js";
import { RoomTokenInput } from "./RoomTokenInput.js";
import { MonacoEditorPage } from "./MonacoEditorPage.js";
import { SERVER_URL, usePlaygroundStore } from "../store/playgroundStore.js";
import { useInitCollabApi } from "../hooks/useInitCollabApi.js";
import { useRouting } from "../hooks/useRouting.js";
import { useProposalSync } from "../hooks/useProposalSync.js";

export function App() {
    useInitCollabApi();
    useRouting();
    useProposalSync();

    const page = usePlaygroundStore(state => state.page);
    const error = usePlaygroundStore(state => state.error);
    const info = usePlaygroundStore(state => state.info);
    const token = usePlaygroundStore(state => state.token);
    const roomToken = usePlaygroundStore(state => state.roomToken);
    const collabApi = usePlaygroundStore(state => state.collabApi);
    const authenticated = usePlaygroundStore(state => state.authenticated);
    const currentAction = usePlaygroundStore(state => state.currentAction);
    const pendingDiffs = usePlaygroundStore(state => state.pendingDiffs);

    const handleLogin = usePlaygroundStore(state => state.handleLogin);
    const handleBack = usePlaygroundStore(state => state.handleBack);
    const handleJoinRoom = usePlaygroundStore(state => state.handleJoinRoom);
    const handleCreateRoom = usePlaygroundStore(state => state.handleCreateRoom);
    const handleJoinToken = usePlaygroundStore(state => state.handleJoinToken);
    const handleLogout = usePlaygroundStore(state => state.handleLogout);
    const acceptDiff = usePlaygroundStore(state => state.acceptDiff);
    const rejectDiff = usePlaygroundStore(state => state.rejectDiff);
    const dismissDiff = usePlaygroundStore(state => state.dismissDiff);

    const renderCurrentPage = () => {
        switch (page) {
            case 'loading':
                return <Spinner info={info} />;
            case 'login':
                return <div className="flex justify-center items-center w-full h-full">
                    <Login token={token} serverUrl={SERVER_URL} onLogin={handleLogin} onBack={handleBack} currentAction={currentAction} />
                </div>
            case 'editor':
                return <div className="flex w-full h-full grow font-urbanist">
                    <MonacoEditorPage
                        roomToken={roomToken!}
                        collabApi={collabApi!}
                        pendingDiffs={pendingDiffs}
                        onAcceptDiff={acceptDiff}
                        onRejectDiff={rejectDiff}
                        onDismissDiff={dismissDiff}
                    />
                </div>;
            case 'joinInput':
                return <div className="flex justify-center items-center w-full h-full grow">
                    <RoomTokenInput onToken={handleJoinToken} onBack={handleBack} />
                </div>;
            default:
                return <StartButtons onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} authenticated={authenticated} onLogout={handleLogout} />;
        }
    }

    const content = () => {
        return (
            <>
                {renderCurrentPage()}
                {error && <div className="p-4 text-center text-red-500">{error}</div>}
            </>
        )
    }

    const container = () => {
        return (
            <div className="flex flex-col items-center justify-center h-full border-t-[3px] border-octoLilac font-urbanist grow">
                {content()}
            </div>
        )
    }

    return (
        page === 'editor' ? content() : container()
    );
}

export function Spinner({ info }: { info?: string }) {
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="mb-2 w-16 h-16 rounded-full border-4 border-solid animate-spin border-b-transparent border-eminence"></div>
            {info && <div className="mt-2 text-base text-center text-gray-500">{info}</div>}
        </div>);
}
