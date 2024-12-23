import { CollaborationInstance, monacoCollab, MonacoCollabApi } from "open-collaboration-monaco";
import { User } from "open-collaboration-protocol";
import { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { Login } from "./Login.js";
import { StartButtons } from "./StartButtons.js";
import { RoomTokenInput } from "./RoomTokenInput.js";
import { MonacoEditorPage } from "./MonacoEditorPage.js";

const SERVER_URL = 'http://0.0.0.0:8100';

export function App() {
  const [collabApi, setCollabApi] = useState<MonacoCollabApi | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [token, setToken] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomToken, setRoomToken] = useState<string | undefined>();

  const loginPageOpener = (_url: string, token: string) => {
    setToken(token);
    setShowLogin(true);
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
    console.log('Logged in', userName, email);
    setShowLogin(false);
  }, []);

  const handleCreateRoom = useCallback(() => {
    collabApi && collabApi.createRoom().then(roomToken => {
      console.log('Room created');
      setRoomToken(roomToken);
    });
  }, [collabApi]);

  const handleJoinRoom = useCallback(() => {
    setShowJoinInput(true);
  }, []);

  const handleJoinToken = useCallback((token: string) => {
    setShowJoinInput(false);
    collabApi && collabApi.joinRoom(token).then(res => {
      if (res) {
        console.log('Joined room');
        setRoomToken(token);
      }
    });
  }, [collabApi]);

  useEffect(() => {
    if (roomToken) {
      setShowEditor(true);
    }
  }, [roomToken]);

  
  return (
      <div className="flex justify-center items-center h-full font-urbanist">
          {
            showLogin && (
              <div className="w-full h-full bg-white flex justify-center items-center">
                  <Login token={token} serverUrl={SERVER_URL} onLogin={handleLogin} />
              </div>
            )
          }
          {
            showEditor && !!roomToken && !!collabApi && (
              <div className="w-full h-full bg-white flex justify-center items-center">
                  <MonacoEditorPage roomToken={roomToken} collabApi={collabApi} />
              </div>
            )
          }
          {
            showJoinInput && (
              <div className="absolute top-0 left-0 w-full h-full bg-white flex justify-center items-center">
                  <RoomTokenInput onToken={handleJoinToken} />
              </div>
            )
          }
          {
            !showLogin && !showEditor && 
            (<StartButtons onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />)
          }
      </div>
  ); 
}