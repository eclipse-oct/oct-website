import { monacoCollab, MonacoCollabApi } from "open-collaboration-monaco";
import { User } from "open-collaboration-protocol";
import { useEffect, useRef } from "react";

import { useCallback } from "react";

export function App() {
  const collabApi = useRef<MonacoCollabApi | null>(null);
  
  const loginPageOpener = () => {
    window.open('./login', '_self');
  }

  useEffect(() => {
      collabApi.current = monacoCollab({
        serverUrl: 'http://0.0.0.0:8100',
        callbacks: {
            onUserRequestsAccess: (user: User) => {
                console.log('User requests access', user);
                return Promise.resolve(true);
            },
            onUsersChanged: () => {
                console.log('Users changed');
            }
        }
      });
  }, []);

  const handleCreateRoom = useCallback(() => {
    // collabApi.current?.createRoom();
    loginPageOpener();
  }, []);

  const handleJoinRoom = useCallback(() => {
    // collabApi.current?.joinRoom();
    loginPageOpener();
  }, []);

  
  return (
      <div className="flex justify-center items-center h-full">
          <div className="flex flex-col space-y-4">
              <button 
                className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded" 
                onClick={() => {
                  handleCreateRoom();
                }}
              >
                  Create Room
              </button>
              <button 
                className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded" 
                onClick={() => {
                  handleJoinRoom();
                }}
              >
                  Join Room
              </button>
          </div>
      </div>
  ); 
}