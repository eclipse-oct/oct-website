// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { MonacoCollabApi } from "open-collaboration-monaco";
import { RoomInfo } from "./RoomInfo.js";
import { FileInfo } from "./FileInfo.js";
import { useCallback, useRef, useState } from "react";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import '@codingame/monaco-vscode-standalone-languages';
import * as monaco from "monaco-editor";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type MonacoEditorPageProps = {
    roomToken: string;
    collabApi: MonacoCollabApi;
}

export const MonacoEditorPage = (props: MonacoEditorPageProps) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

    const handleEditorReady = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
        if (!editorRef.current) {
            editorRef.current = editor;
        }
    }, []);

    const handleOnLoad = useCallback((wrapper: MonacoEditorLanguageClientWrapper) => {
        const monacoEditor = wrapper.getEditor();
        if (monacoEditor) {
            props.collabApi.setEditor(monacoEditor as any);
            handleEditorReady(monacoEditor);
        }
    }, [props.collabApi]);

    const handleLeaveRoom = useCallback(() => {
        props.collabApi.leaveRoom();
        window.location.href = '/';
    }, [props.collabApi]);

    const handleFileNameChange = useCallback((fileName: string) => {
        const langs = monaco.languages.getLanguages();
        // extract file extension from fileName
        const fileExtension = fileName.split('.').pop();
        if (fileExtension) {
          const language = langs.find(l => l.extensions?.includes('.' + fileExtension));
          if (language) {
            const model = editorRef.current?.getModel();
            if (model) {
              monaco.editor.setModelLanguage(model, language.id);
            } else {
              console.log('Model not found');
            }
          }
        }
    }, []);

    return (
        <div className="flex flex-col grow">
            <div className="flex items-center justify-between p-4 bg-darkBlue">
                <FileInfo collabApi={props.collabApi} onFileNameChange={handleFileNameChange} />
                <FontAwesomeIcon icon={faArrowRightFromBracket} className="cursor-pointer size-6" color="white" onClick={handleLeaveRoom} title="Leave session" />
            </div>
            <div className="flex grow">
                <div className="flex-1 overflow-auto grow">
                    <MonacoEditorReactComp
                        className="w-full h-full grow"
                        wrapperConfig={
                            {
                                $type: 'classic',
                                editorAppConfig: {
                                    editorOptions: {
                                        language: 'plaintext',
                                        value: ''
                                    }
                                }
                            }
                        } onLoad={handleOnLoad} />
                </div>
                <div className="h-full p-4 w-60 bg-columbiaBlue">
                    <RoomInfo collabApi={props.collabApi} roomToken={props.roomToken} />
                </div>
            </div>
        </div>
    )
};
