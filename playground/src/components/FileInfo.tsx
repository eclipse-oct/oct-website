// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { useEffect, useState, useRef, useCallback } from 'react';
import { MonacoCollabApi } from "open-collaboration-monaco";
import { faArrowRightFromBracket, faFolderOpen, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as monaco from "monaco-editor";

export type FileInfoProps = {
    collabApi: MonacoCollabApi;
    editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | undefined>;
}

export const FileInfo = ({ collabApi, editorRef }: FileInfoProps) => {
    const [isHost, setIsHost] = useState<boolean | undefined>();
    const [isDirty, setIsDirty] = useState(false);
    const [fileName, setFileName] = useState<string>(collabApi.getFileName() ?? 'playground.txt');
    const [originalFileName, setOriginalFileName] = useState(fileName);
    const [workspaceName, setWorkspaceName] = useState<string>('OCT Playground');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        collabApi.getUserData().then(ud => {
            setIsHost(ud?.me.host);
        })
        collabApi.onUsersChanged(() => {
            setWorkspaceName(collabApi.getWorkspaceName() ?? '');
        });
        collabApi.onFileNameChange(newFileName => {
            setFileName(newFileName);
            setOriginalFileName(newFileName);
            setIsDirty(false);
            updateModelLanguage(newFileName);
        });
    }, [collabApi]);

    // The text in the file name input field has been changed by the user
    const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setFileName(newValue);
        setIsDirty(newValue !== originalFileName);
    };

    // The user has pressed the Enter key in the file name input field
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && isFileNameValid && isDirty) {
            applyNewFileName(fileName);
        }
    };

    // The user has clicked the "Apply" button
    const handleApply = () => {
        applyNewFileName(fileName);
    };

    const applyNewFileName = (fileName: string) => {
        setOriginalFileName(fileName);
        setIsDirty(false);
        collabApi.setFileName(fileName);
        updateModelLanguage(fileName);
    };

    // Update language support and highlighting based on file extension
    const updateModelLanguage = (fileName: string) => {
        const fileExtension = fileName.split('.').pop();
        if (fileExtension) {
            const langs = monaco.languages.getLanguages();
            const language = langs.find(l => l.extensions?.includes('.' + fileExtension));
            if (language) {
                const model = editorRef.current?.getModel();
                if (model) {
                    monaco.editor.setModelLanguage(model, language.id);
                } else {
                    console.log('Model not ready for language change');
                }
            }
        }
    };

    // The user has clicked the "Leave Session" button
    const handleLeaveRoom = useCallback(() => {
        collabApi.leaveRoom();
        window.location.href = '/playground/';
    }, [collabApi]);

    // The user has clicked the "Open File" button
    const handleOpenFile = useCallback(async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker();

            const file = await fileHandle.getFile();
            const content = await file.text();
            const model = editorRef.current?.getModel();
            if (model) {
                model.setValue(content);

                const newFileName = file.name;
                setFileName(newFileName);
                applyNewFileName(newFileName);
            } else {
                console.error('Cannot open file: editor not ready');
            }
        } catch (error) {
            console.error('File picker cancelled or error occurred:', error);
        }
    }, [collabApi, editorRef]);

    // Fallback for browsers that do not support the File System Access API
    const handleOpenFileFallback = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileInputChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const content = await file.text();
            const model = editorRef.current?.getModel();
            if (model) {
                model.setValue(content);

                const newFileName = file.name;
                setFileName(newFileName);
                applyNewFileName(newFileName);
            } else {
                console.error('Cannot open file: editor not ready');
            }
        } catch (error) {
            console.error('Error reading file:', error);
        }

        // Reset the input value so the same file can be selected again
        event.target.value = '';
    }, [editorRef]);

    // The user has clicked the "Save File" button
    const handleSaveFile = useCallback(async () => {
        try {
            const model = editorRef.current?.getModel();
            if (!model) return;

            const content = model.getValue();
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: fileName
            });

            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
        } catch (error) {
            console.error('Save file picker cancelled or error occurred:', error);
        }
    }, [fileName, editorRef]);

    // Fallback for browsers that do not support the File System Access API
    const handleSaveFileFallback = useCallback(() => {
        const model = editorRef.current?.getModel();
        if (!model) return;

        const content = model.getValue();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object to prevent memory leaks
        URL.revokeObjectURL(url);
    }, [fileName, editorRef]);

    const isFileNameValid = fileName.trim().length > 0;

    if (isHost) {
        return (
            <div className="flex items-center justify-between px-6 py-3 bg-lightLilac">
                <div className="flex gap-2 items-center">
                    <div className="flex text-sm font-light text-darkBlue">
                        <span className='min-w-max'>{workspaceName}</span><span className='pl-2'>&#8227;</span>
                    </div>
                    <input
                        type="text"
                        name="fileName"
                        value={fileName}
                        onChange={handleFileNameChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a file name"
                        className={`px-2 py-0.5 border rounded focus:outline-none focus:ring-2 focus:ring-octoLilac focus:border-transparent w-full ${!isFileNameValid
                                ? 'border-red-500'
                                : isDirty
                                    ? 'border-yellow-500'
                                    : 'border-gray-300'
                            }`}
                    />
                    <button
                        title="Apply new file name"
                        onClick={handleApply}
                        disabled={!isFileNameValid || !isDirty}
                        className={`px-4 py-0.5 rounded ${isFileNameValid && isDirty
                                ? 'bg-darkBlue text-white hover:bg-gray-500'
                                : 'bg-darkBlue text-white opacity-30 cursor-not-allowed'
                            }`}
                    >
                        Apply
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    {typeof window.showOpenFilePicker === 'function' ? (
                        <FontAwesomeIcon icon={faFolderOpen} className="cursor-pointer size-6" color="darkBlue" onClick={handleOpenFile} title="Open File" />
                    ) : <>
                        <FontAwesomeIcon icon={faFolderOpen} className="cursor-pointer size-6" color="darkBlue" onClick={handleOpenFileFallback} title="Open File" />
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileInputChange}
                            style={{ display: 'none' }}
                        />
                    </>}
                    {typeof window.showSaveFilePicker === 'function' ? (
                        <FontAwesomeIcon icon={faSave} className="cursor-pointer size-6" color="darkBlue" onClick={handleSaveFile} title="Save File" />
                    ) : (
                        <FontAwesomeIcon icon={faSave} className="cursor-pointer size-6" color="darkBlue" onClick={handleSaveFileFallback} title="Save File" />
                    )}
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="cursor-pointer size-6" color="darkBlue" onClick={handleLeaveRoom} title="Leave Session" />
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex items-center justify-between px-6 py-3 bg-lightLilac">
                <div className="text-sm font-light text-darkBlue py-[5px]">
                    <span>{workspaceName}</span>
                    {fileName.split('/').flatMap(p => [<span key={`${p}/separator`} className='px-2'>&#8227;</span>, <span key={p}>{p}</span>])}
                </div>
                <FontAwesomeIcon icon={faArrowRightFromBracket} className="cursor-pointer size-6" color="darkBlue" onClick={handleLeaveRoom} title="Leave Session" />
            </div>
        );
    }
};

// TypeScript declarations for File System Access API
declare global {
    interface Window {
        showOpenFilePicker(options?: {
            types?: Array<{
                description: string;
                accept: Record<string, string[]>;
            }>;
        }): Promise<FileSystemFileHandle[]>;
        showSaveFilePicker(options?: {
            suggestedName?: string;
            types?: Array<{
                description: string;
                accept: Record<string, string[]>;
            }>;
        }): Promise<FileSystemFileHandle>;
    }
}
