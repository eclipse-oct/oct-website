// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { useEffect } from "react";
import { AuthMetadata, monacoCollab, User } from "open-collaboration-monaco";
import {
    SERVER_URL,
    checkAndGetAuthentication,
    usePlaygroundStore,
} from "../store/playgroundStore.js";

export function useInitCollabApi() {
    const setInfo = usePlaygroundStore(state => state.setInfo);
    const setToken = usePlaygroundStore(state => state.setToken);
    const setPage = usePlaygroundStore(state => state.setPage);
    const setAuthenticated = usePlaygroundStore(state => state.setAuthenticated);
    const setCollabApi = usePlaygroundStore(state => state.setCollabApi);
    const addPendingDiff = usePlaygroundStore(state => state.addPendingDiff);

    useEffect(() => {
        const loginPageOpener = async (token: string, _authenticationMetadata: AuthMetadata) => {
            setToken(token);
            setPage('login');
            return true;
        };

        const collabApi = monacoCollab({
            serverUrl: SERVER_URL,
            callbacks: {
                onUserRequestsAccess: (user: User) => {
                    console.log('User requests access', user);
                    return Promise.resolve(true);
                },
                statusReporter: info => {
                    setInfo(info.message);
                },
                onProposeChanges: (path, originalText, modifiedText, accept, reject) => {
                    addPendingDiff({ path, originalText, modifiedText, accept, reject });
                }
            },
            loginPageOpener,
            useCookieAuth: true,
        });
        window.onbeforeunload = () => {
            collabApi?.leaveRoom();
        };
        checkAndGetAuthentication(collabApi).then(authenticated => {
            setAuthenticated(authenticated);
            setCollabApi(collabApi);
        });
    }, [setInfo, setToken, setPage, setAuthenticated, setCollabApi, addPendingDiff]);
}
