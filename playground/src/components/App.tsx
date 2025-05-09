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

  const handleLogin = useCallback((userName: string, email: string) => {
    setPage('loading');
    console.log('Logged in', userName, email);
  }, []);

  const handleCreateRoom = useCallback(() => {
    setPage('loading');
    collabApi && collabApi.createRoom().then(roomToken => {
      console.log('Room created');
      setRoomToken(roomToken);
    });
  }, [collabApi]);

  const handleJoinRoom = useCallback(() => {
    setPage('joinInput');
  }, []);

  const handleJoinToken = useCallback((token: string) => {
    setPage('loading');
    collabApi && collabApi.joinRoom(token).then(res => {
      if (res) {
        console.log('Joined room');
        setRoomToken(token);
        setPage('editor');
      }
    });
  }, [collabApi]);

  const handleBack = useCallback(() => {
    setPage('startButtons');
  }, []);

  useEffect(() => {
    if (roomToken) {
      setPage('editor')
    }
  }, [roomToken]);

  const renderCurrentPage = () => {
    switch (page) {
      case 'loading':
        return <Spinner />;
      case 'login':
        return <div className="w-full h-full flex justify-center items-center">
          <Login token={token} serverUrl={SERVER_URL} onLogin={handleLogin} onBack={handleBack} />
        </div>
      case 'editor':
        return <div className="w-full flex grow min-h-[calc(100vh-110px-56px)] ">
          <MonacoEditorPage roomToken={roomToken!} collabApi={collabApi!} />
        </div>;
      case 'joinInput':
        return <div className="w-full h-full flex justify-center items-center grow">
        <RoomTokenInput onToken={handleJoinToken} onBack={handleBack} />
      </div>;
      default:
        return <StartButtons onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
    }
  }


  return (
    <div className="flex justify-center items-center h-full font-urbanist grow">
      {renderCurrentPage()}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-[64px] w-[64px] border-4 border-b-transparent border-eminence border-solid"></div>
    </div>  );
}