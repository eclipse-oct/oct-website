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
  const [page, setPage] = useState<pages>('loading');
  const [token, setToken] = useState('');
  const [roomToken, setRoomToken] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [authenticated, setAuthenticated] = useState(false);
  const [currentAction, setCurrentAction] = useState<'create' | string | undefined>();
  const [info, setInfo] = useState<string | undefined>();

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
        },
        statusReporter: info => {
          setInfo(info.message);
        }
      },
      loginPageOpener,
      useCookieAuth: true,
    });
    window.onbeforeunload = () => {
        collabApi?.leaveRoom();
    }
    checkAndGetAuthentication(collabApi).then(authenticated => {
      setAuthenticated(authenticated);
      setCollabApi(collabApi);
    });
  }, []);

  useEffect(() => {
    const setInitialPage = () => {
        const search = new URLSearchParams(window.location.search)
        if(!collabApi) {
            setPage('loading');
        } else if(search.has('room')) {
            handleJoinToken(search.get('room')!);
        } else if(search.has('create')) {
            handleCreateRoom();
        } else {
            setPage('startButtons');
            collabApi.leaveRoom()
        }
    }
    setInitialPage();
    window.addEventListener('popstate', (event) => {
        setInitialPage();
    });
  }, [collabApi]);

  const handleLogin = useCallback((userName: string, email: string) => {
    setPage('loading');
    console.log('Logged in', userName, email);
  }, []);

  const handleCreateRoom = useCallback(() => {
    setCurrentAction('create');
    setError(undefined);
    setPage('loading');
    collabApi && collabApi.createRoom().then(roomToken => {
      if(roomToken) {
        console.log('Room created');
        collabApi?.setWorkspaceName('OCT Playground');
        setRoomToken(roomToken);
      } else {
        setError('Error creating room');
        setPage('startButtons');
      }
    }).catch(err => {
        console.error('Error creating room', err);
        setError(err.message || 'Error creating room');
        setPage('startButtons');
    });
  }, [collabApi]);

  const handleJoinRoom = useCallback(() => {
    setError(undefined);
    setPage('joinInput');
  }, []);

  const handleLogout = useCallback(() => {
    collabApi?.logout().then(() => {
      setAuthenticated(false);
    });
  }, [collabApi, setAuthenticated]);

  const handleJoinToken = useCallback((token: string) => {
    setCurrentAction(token);
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
    }).catch(err => {
        console.error('Error joining room', err);
        setError(err.message || 'Error joining room, please check the token');
        setPage('startButtons');
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
        return <Spinner info={info} />;
      case 'login':
        return <div className="flex justify-center items-center w-full h-full">
          <Login token={token} serverUrl={SERVER_URL} onLogin={handleLogin} onBack={handleBack} currentAction={currentAction}/>
        </div>
      case 'editor':
        return <div className="flex w-full h-full grow font-urbanist">
          <MonacoEditorPage roomToken={roomToken!} collabApi={collabApi!} />
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

export function Spinner({info}: {info?: string}) {
  return (
    <div className="flex flex-col justify-center items-center h-full">
        <div className="mb-2 w-16 h-16 rounded-full border-4 border-solid animate-spin border-b-transparent border-eminence"></div>
        {info && <div className="mt-2 text-base text-center text-gray-500">{info}</div>}
    </div>  );
}

async function checkAndGetAuthentication(collabApi: MonacoCollabApi): Promise<boolean> {
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

