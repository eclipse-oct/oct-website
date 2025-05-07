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

const SERVER_URL = 'http://localhost:8100';

export function App() {
  const [collabApi, setCollabApi] = useState<MonacoCollabApi | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [token, setToken] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomToken, setRoomToken] = useState<string | undefined>();

  const loginPageOpener = async (token: string, authenticationMetadata: AuthMetadata) => {
    setToken(token);
    setShowLogin(true);
    return true;
  }

  useEffect(() => {
    checkAndGetAuthToken().then(authToken => {
      const collabApi = monacoCollab({
        serverUrl: SERVER_URL,
        callbacks: {
          onUserRequestsAccess: (user: User) => {
            console.log('User requests access', user);
            return Promise.resolve(true);
          }
        },
        loginPageOpener,
        userToken: authToken,
      });
      setCollabApi(collabApi);
    });
  }, []);

  useEffect(() => {
    if (collabApi) {
      const task = getSavedTask()
      if(task === 'create') {
        handleCreateRoom();
      } else if(typeof task === 'string') {
        handleJoinToken(task);
      }
    }
  }, [collabApi])

  const handleLogin = useCallback((userName: string, email: string) => {
    console.log('Logged in', userName, email);
    setShowLogin(false);
  }, []);

  const handleCreateRoom = useCallback(() => {
    setTask('create');
    collabApi && collabApi.createRoom().then(roomToken => {
      console.log('Room created');
      setTask()
      setRoomToken(roomToken);
    });
  }, [collabApi]);

  const handleJoinRoom = useCallback(() => {
    setShowJoinInput(true);
  }, []);

  const handleJoinToken = useCallback((token: string) => {
    setTask(token);
    setShowJoinInput(false);
    collabApi && collabApi.joinRoom(token).then(res => {
      if (res) {
        console.log('Joined room');
        setTask()
        setRoomToken(token);
      }
    });
  }, [collabApi]);

  const handleBack = useCallback(() => {
    setShowJoinInput(false);
    setShowLogin(false);
    setShowEditor(false);
  }, []);

  useEffect(() => {
    if (roomToken) {
      setShowEditor(true);
    }
  }, [roomToken]);


  return (
    <div className="flex justify-center items-center h-full font-urbanist grow">
      {
        showLogin && (
          <div className="w-full h-full flex justify-center items-center">
            <Login token={token} serverUrl={SERVER_URL} onLogin={handleLogin} onBack={handleBack} />
          </div>
        )
      }
      {
        showEditor && !!roomToken && !!collabApi && (
          <div className="w-full flex grow min-h-[calc(100vh-110px-56px)] ">
            <MonacoEditorPage roomToken={roomToken} collabApi={collabApi} />
          </div>
        )
      }
      {
        showJoinInput && (
          <div className="w-full h-full flex justify-center items-center grow">
            <RoomTokenInput onToken={handleJoinToken} onBack={handleBack} />
          </div>
        )
      }
      {
        !showLogin && !showEditor && !showJoinInput &&
        (<StartButtons onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />)
      }
    </div>
  );
}

async function checkAndGetAuthToken(): Promise<string | undefined> {
  const token = new URLSearchParams(window.location.search).get('token');
  if (token) {
    window.history.replaceState({}, '', window.location.pathname);
    const res = await fetch(SERVER_URL + `/api/login/poll/${token}`, {
      method: 'POST',
    })
    if (res.ok) {
      const data = await res.json();
      if (data && data.loginToken) {
        return data.loginToken;
      }
    } else {
      console.error('Failed to get auth token', res.statusText);
    }
  }
  return undefined;
}

function getSavedTask(): string | undefined {
  const task = localStorage.getItem('task');
  if (task) {
    return task;
  }
  return undefined;
}

function setTask(task?: string) {
  task ? localStorage.setItem('task', task) : localStorage.removeItem('task');
}
