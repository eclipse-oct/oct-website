// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { MonacoCollabApi } from "open-collaboration-monaco";
import { RoomInfo } from "./RoomInfo.js";
import { FileInfo } from "./FileInfo.js";
import { useCallback, useRef } from "react";
import { useWorkerFactory } from 'monaco-languageclient/workerFactory';
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import '@codingame/monaco-vscode-standalone-languages';
import * as monaco from "monaco-editor";

export type MonacoEditorPageProps = {
    roomToken: string;
    collabApi: MonacoCollabApi;
}

export const MonacoEditorPage = (props: MonacoEditorPageProps) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

    const handleEditorReady = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
        if (!editorRef.current || editorRef.current !== editor) {
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

    return (
        <div className="flex flex-col grow border-t-[2px] border-octoLilac">
            <FileInfo collabApi={props.collabApi} editorRef={editorRef} />
            <div className="flex grow">
                <div className="flex-1 relative border-t-[1px] border-octoLilac">
                    <MonacoEditorReactComp
                        className="absolute inset-0"
                        wrapperConfig={
                            {
                                $type: 'classic',
                                editorAppConfig: {
                                    editorOptions: {
                                        automaticLayout: true,
                                        language: 'plaintext',
                                        value: ''
                                    },
                                    monacoWorkerFactory: () => {
                                        useWorkerFactory({
                                            workerLoaders: {
                                                // the editor worker is pre-bundled with esbuild
                                                TextEditorWorker: () => new Worker('/playground/editor.worker.js', { type: 'module' })
                                            }
                                        });
                                    }
                                }
                            }
                        } onLoad={handleOnLoad} />
                </div>
                <div className="h-full p-4 bg-lightLilac text-richBlack">
                    <RoomInfo collabApi={props.collabApi} roomToken={props.roomToken} />
                </div>
            </div>
        </div>
    )
};
