// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { useEffect, useState } from 'react';
import { MonacoCollabApi } from "open-collaboration-monaco";

export type FileInfoProps = {
  collabApi: MonacoCollabApi;
}

export const FileInfo = ({collabApi}: FileInfoProps) => {
  const [fileName, setFileName] = useState('playground.txt');
  const [isHost, setIsHost] = useState<boolean | undefined>();
  const [isDirty, setIsDirty] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('playground.txt');

  useEffect(() => {
    collabApi.getUserData().then(ud => {
        setIsHost(ud?.me.host);
    })
  }, [collabApi]);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFileName(newValue);
    setIsDirty(newValue !== originalFileName);
  };

  const handleSave = () => {
    // Dummy function for now
    console.log('Saving file name:', fileName);
    setOriginalFileName(fileName);
    setIsDirty(false);
  };

  const isFileNameValid = fileName.trim().length > 0;

  return (
    <div className="flex items-center gap-2">
      {isHost ? (
        <>
          <div className="relative flex-1">
            <input
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="Enter a file name"
              className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-eminence focus:border-transparent w-full ${
                !isFileNameValid 
                  ? 'border-red-500' 
                  : isDirty 
                    ? 'border-yellow-500' 
                    : 'border-gray-300'
              }`}
            />
            {isDirty && (
              <div className="absolute w-2 h-2 bg-yellow-500 rounded-full -top-1 -right-1" />
            )}
          </div>
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
        </>
      ) : (
        <div className="px-3 py-2 border border-gray-300 rounded">
          {fileName}
        </div>
      )}
    </div>
  );
};
