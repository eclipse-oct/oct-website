// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { useEffect, useState } from 'react';
import { MonacoCollabApi } from "open-collaboration-monaco";

export type FileInfoProps = {
  collabApi: MonacoCollabApi;
  onFileNameChange: (fileName: string) => void;
}

export const FileInfo = ({collabApi, onFileNameChange}: FileInfoProps) => {
  const [fileName, setFileName] = useState(collabApi.getFileName() ?? 'playground.txt');
  const [isHost, setIsHost] = useState<boolean | undefined>();
  const [isDirty, setIsDirty] = useState(false);
  const [originalFileName, setOriginalFileName] = useState(collabApi.getFileName() ?? 'playground.txt');
  const [roomName, setRoomName] = useState<string>(collabApi.getRoomName() ?? '');

  useEffect(() => {
    collabApi.getUserData().then(ud => {
        setIsHost(ud?.me.host);
    })
    collabApi.onFileNameChange(fileName => {
      setFileName(fileName);
      setOriginalFileName(fileName);
      setIsDirty(false);
      onFileNameChange(fileName);
    });

  }, [collabApi]);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFileName(newValue);
    setIsDirty(newValue !== originalFileName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isFileNameValid && isDirty) {
      handleSave();
    }
  };

  const handleSave = () => {
    console.log('Saving file name:', fileName);
    collabApi.setFileName(fileName);
    setOriginalFileName(fileName);
    setIsDirty(false);
    onFileNameChange(fileName);
  };

  const isFileNameValid = fileName.trim().length > 0;

  return (
    <div className="flex items-center gap-2">
      {isHost ? (
        <>
          <div className="relative flex-1">
            <div className="mb-1 text-sm text-gray-500">{roomName}</div>
            <div className="flex items-center gap-2">
                <input
                type="text"
                value={fileName}
                onChange={handleFileNameChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter a file name"
                className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-eminence focus:border-transparent w-full ${
                    !isFileNameValid
                    ? 'border-red-500'
                    : isDirty
                        ? 'border-yellow-500'
                        : 'border-gray-300'
                }`}
                />
                <button
                    onClick={handleSave}
                    disabled={!isFileNameValid || !isDirty}
                    className={`px-4 py-2 rounded ${
                    isFileNameValid && isDirty
                        ? 'bg-eminence text-white hover:bg-eminence-dark'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Save
                </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          <div className="text-sm text-gray-500">{roomName}</div>
          <div className="px-3 py-2 border border-gray-300 rounded">
            {fileName}
          </div>
        </div>
      )}
    </div>
  );
};