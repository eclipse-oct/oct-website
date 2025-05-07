// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { AuthMetadata, monacoCollab, MonacoCollabApi } from "open-collaboration-monaco";
import { User } from "open-collaboration-monaco";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { Login } from "./Login.js";
import { StartButtons } from "./StartButtons.js";
import { RoomTokenInput } from "./RoomTokenInput.js";
import { MonacoEditorPage } from "./MonacoEditorPage.js";

const SERVER_URL = 'https://api.open-collab.tools';

type pages = 'login' | 'editor' | 'startButtons' | 'joinInput' | 'loading';

export function App() {
  const [collabApi, setCollabApi] = useState<MonacoCollabApi | null>(null);
  const [page, setPage] = useState<pages>('startButtons');
  const [token, setToken] = useState('');
  const [roomToken, setRoomToken] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const loginPageOpener = async (token: string, authenticationMetadata: AuthMetadata) => {
    setToken(token);
    setPage('login');
    return true;
  }

  useEffect(() => {
    const collabApi = monacoCollab({
      serverUrl: SERVER_URL,
      callbacks: {
        onUserRequestsAccess: (user: User) => {
          console.log('User requests access', user);
          return Promise.resolve(true);
        }
      },
      loginPageOpener
    });
    setCollabApi(collabApi);
  }, []);

  useEffect(() => {
    const setInitialPage = () => {
      if(collabApi) {
        const search = new URLSearchParams(window.location.search)
        if(search.has('room')) {
          handleJoinToken(search.get('room')!);
        } else {
          // TODO fire leave room event if connected
          setPage('startButtons');
        }
      }
  }
  setInitialPage();
  window.addEventListener('popstate', (event) => {
    setInitialPage();
  });
  }, [collabApi]);


  // join room when initial url has room token
  useEffect(() => {
    if(collabApi) {
      const search = new URLSearchParams(window.location.search)
      if(search.has('room')) {
        handleJoinToken(search.get('room')!);
      }
    }
  }, [collabApi]);

  const handleLogin = useCallback((userName: string, email: string) => {
    setPage('loading');
    console.log('Logged in', userName, email);
  }, []);

  const handleCreateRoom = useCallback(() => {
    setError(undefined);
    setPage('loading');
    collabApi && collabApi.createRoom().then(roomToken => {
      if(roomToken) {
        console.log('Room created');
        setRoomToken(roomToken);
      } else {
        setError('Error creating room');
        setPage('startButtons');
      }
    });
  }, [collabApi]);

  const handleJoinRoom = useCallback(() => {
    setError(undefined);
    setPage('joinInput');
  }, []);

  const handleJoinToken = useCallback((token: string) => {
    setPage('loading');
      collabApi && collabApi.joinRoom(token).then(res => {
        if (res) {
          console.log('Joined room');
          setRoomToken(token);
          setPage('editor');
        } else {
          history.pushState({}, '', location.pathname);
          setError('Error joining room, please check the token');
          setPage('startButtons');
        }
      })
  }, [collabApi]);

  const handleBack = useCallback(() => {
    setPage('startButtons');
  }, []);

  useEffect(() => {
    if (roomToken) {
      history.pushState({}, '', `${location.pathname}?room=${roomToken}`);
      setPage('editor')
    }
  }, [roomToken]);

  const renderCurrentPage = () => {
    switch (page) {
      case 'loading':
        return <Spinner />;
      case 'login':
        return <div className="flex items-center justify-center w-full h-full">
          <Login token={token} serverUrl={SERVER_URL} onLogin={handleLogin} onBack={handleBack} />
        </div>
      case 'editor':
        return <div className="flex w-full grow">
          <MonacoEditorPage roomToken={roomToken!} collabApi={collabApi!} />
        </div>;
      case 'joinInput':
        return <div className="flex items-center justify-center w-full h-full grow">
        <RoomTokenInput onToken={handleJoinToken} onBack={handleBack} />
      </div>;
      default:
        return <StartButtons onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
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
      <div className="flex flex-col items-center justify-center h-full font-urbanist grow">
        {content()}
      </div>
    )
  }

  return (
    page === 'editor' ? content() : container()
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-[64px] w-[64px] border-4 border-b-transparent border-eminence border-solid"></div>
    </div>  );
}