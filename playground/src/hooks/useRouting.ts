// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { useEffect } from "react";
import { usePlaygroundStore } from "../store/playgroundStore.js";

export function useRouting() {
    const collabApi = usePlaygroundStore(state => state.collabApi);
    const roomToken = usePlaygroundStore(state => state.roomToken);
    const setPage = usePlaygroundStore(state => state.setPage);
    const handleJoinToken = usePlaygroundStore(state => state.handleJoinToken);
    const handleCreateRoom = usePlaygroundStore(state => state.handleCreateRoom);

    useEffect(() => {
        const setInitialPage = () => {
            const search = new URLSearchParams(window.location.search);
            if (!collabApi) {
                setPage('loading');
            } else if (search.has('room')) {
                handleJoinToken(search.get('room')!);
            } else if (search.has('create')) {
                handleCreateRoom();
            } else {
                setPage('startButtons');
                collabApi.leaveRoom();
            }
        };
        setInitialPage();
        window.addEventListener('popstate', setInitialPage);
        return () => {
            window.removeEventListener('popstate', setInitialPage);
        };
    }, [collabApi, setPage, handleJoinToken, handleCreateRoom]);

    useEffect(() => {
        if (roomToken) {
            history.pushState({}, '', `${location.pathname}?room=${roomToken}`);
            setPage('editor');
        }
    }, [roomToken, setPage]);
}
