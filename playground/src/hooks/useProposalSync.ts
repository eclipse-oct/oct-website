// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { useEffect, useRef } from "react";
import { usePlaygroundStore } from "../store/playgroundStore.js";

export function useProposalSync() {
    const collabApi = usePlaygroundStore(state => state.collabApi);
    const roomToken = usePlaygroundStore(state => state.roomToken);
    const removeProposalByPath = usePlaygroundStore(state => state.removeProposalByPath);
    const closeHandlerRegistered = useRef(false);

    useEffect(() => {
        if (!collabApi || !roomToken || closeHandlerRegistered.current) {
            return;
        }
        closeHandlerRegistered.current = true;
        collabApi.onCloseProposal((path: string) => {
            removeProposalByPath(path);
        });
    }, [collabApi, roomToken, removeProposalByPath]);
}
