// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { create } from "zustand";
import { MonacoCollabApi } from "open-collaboration-monaco";
import { ProposedChange } from "../components/DiffReview.js";

export const SERVER_URL = 'https://api.open-collab.tools';

export type pages = 'login' | 'editor' | 'startButtons' | 'joinInput' | 'loading';

export async function checkAndGetAuthentication(collabApi: MonacoCollabApi): Promise<boolean> {
    const query = new URLSearchParams(window.location.search)
    const token = query.get('token');
    if (token) {
        query.delete('token');
        window.history.replaceState({}, '', `${window.location.pathname}?${query.toString()}`);
        const res = await fetch(SERVER_URL + `/api/login/poll/${token}?useCookie=true`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!res.ok) {
            console.error('Failed to get auth token', res.statusText);
            return false;
        }
        return true;
    }

    return collabApi.isLoggedIn();
}

export interface PlaygroundState {
    collabApi: MonacoCollabApi | null;
    page: pages;
    token: string;
    roomToken: string | undefined;
    error: string | undefined;
    authenticated: boolean;
    currentAction: 'create' | string | undefined;
    info: string | undefined;
    pendingDiffs: ProposedChange[];

    setCollabApi: (collabApi: MonacoCollabApi | null) => void;
    setAuthenticated: (authenticated: boolean) => void;
    setInfo: (info: string | undefined) => void;
    setPage: (page: pages) => void;
    setToken: (token: string) => void;
    setRoomToken: (roomToken: string | undefined) => void;

    handleLogin: (userName: string, email: string) => void;
    handleBack: () => void;
    handleJoinRoom: () => void;
    handleCreateRoom: () => void;
    handleJoinToken: (token: string) => void;
    handleLogout: () => void;

    addPendingDiff: (change: Omit<ProposedChange, 'id'>) => void;
    acceptDiff: () => void;
    rejectDiff: () => void;
    dismissDiff: () => void;
    removeProposalByPath: (path: string) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
    collabApi: null,
    page: 'loading',
    token: '',
    roomToken: undefined,
    error: undefined,
    authenticated: false,
    currentAction: undefined,
    info: undefined,
    pendingDiffs: [],

    setCollabApi: (collabApi) => set({ collabApi }),
    setAuthenticated: (authenticated) => set({ authenticated }),
    setInfo: (info) => set({ info }),
    setPage: (page) => set({ page }),
    setToken: (token) => set({ token }),
    setRoomToken: (roomToken) => set({ roomToken }),

    handleLogin: (userName, email) => {
        set({ page: 'loading' });
        console.log('Logged in', userName, email);
    },

    handleBack: () => set({ page: 'startButtons' }),

    handleJoinRoom: () => set({ error: undefined, page: 'joinInput' }),

    handleCreateRoom: () => {
        const { collabApi } = get();
        set({ currentAction: 'create', error: undefined, page: 'loading' });
        collabApi && collabApi.createRoom().then(roomToken => {
            if (roomToken) {
                console.log('Room created');
                collabApi.setWorkspaceName('OCT Playground');
                set({ roomToken });
            } else {
                set({ error: 'Error creating room', page: 'startButtons' });
            }
        }).catch(err => {
            console.error('Error creating room', err);
            set({ error: err.message || 'Error creating room', page: 'startButtons' });
        });
    },

    handleJoinToken: (token) => {
        const { collabApi } = get();
        set({ currentAction: token, page: 'loading' });
        collabApi && collabApi.joinRoom(token).then(res => {
            if (res) {
                console.log('Joined room');
                set({ roomToken: token, page: 'editor' });
            } else {
                history.pushState({}, '', location.pathname);
                set({ error: 'Error joining room, please check the token', page: 'startButtons' });
            }
        }).catch(err => {
            console.error('Error joining room', err);
            set({ error: err.message || 'Error joining room, please check the token', page: 'startButtons' });
        });
    },

    handleLogout: () => {
        const { collabApi } = get();
        collabApi?.logout().then(() => {
            set({ authenticated: false });
        });
    },

    addPendingDiff: (change) => {
        set(state => ({
            pendingDiffs: [...state.pendingDiffs, { id: crypto.randomUUID(), ...change }]
        }));
    },

    acceptDiff: () => {
        const { pendingDiffs, collabApi } = get();
        const current = pendingDiffs[0];
        if (current) {
            current.accept();
            collabApi?.closeProposal(current.path);
            set({ pendingDiffs: pendingDiffs.slice(1) });
        }
    },

    rejectDiff: () => {
        const { pendingDiffs, collabApi } = get();
        const current = pendingDiffs[0];
        if (current) {
            current.reject();
            collabApi?.closeProposal(current.path);
            set({ pendingDiffs: pendingDiffs.slice(1) });
        }
    },

    dismissDiff: () => {
        const { pendingDiffs, collabApi } = get();
        const current = pendingDiffs[0];
        if (current) {
            // Resets stopPropagation so local edits sync again, without broadcasting
            // closeProposal (keeps the proposer's merge editor open).
            collabApi?.cancelProposal(current.path);
            set({ pendingDiffs: pendingDiffs.slice(1) });
        }
    },

    removeProposalByPath: (path) => {
        set(state => ({
            pendingDiffs: state.pendingDiffs.filter(diff => diff.path !== path)
        }));
    },
}));
