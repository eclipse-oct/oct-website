// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { MonacoCollabApi } from "open-collaboration-monaco";
import { RoomInfo } from "./RoomInfo.js";
import { SessionChat } from "./SessionChat.js";
import { FileInfo } from "./FileInfo.js";
import { DiffReview, ProposedChange } from "./DiffReview.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWorkerFactory } from 'monaco-languageclient/workerFactory';
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import '@codingame/monaco-vscode-standalone-languages';
import '@codingame/monaco-vscode-standalone-css-language-features';
import '@codingame/monaco-vscode-standalone-html-language-features';
import '@codingame/monaco-vscode-standalone-json-language-features';
import '@codingame/monaco-vscode-standalone-typescript-language-features';
import * as monaco from "monaco-editor";

export type MonacoEditorPageProps = {
    roomToken: string;
    collabApi: MonacoCollabApi;
    pendingDiffs: ProposedChange[];
    onAcceptDiff: () => void;
    onRejectDiff: () => void;
    onDismissDiff: () => void;
}

export const MonacoEditorPage = (props: MonacoEditorPageProps) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
    const [externallyChanged, setExternallyChanged] = useState(false);
    const currentDiff = props.pendingDiffs[0];

    useEffect(() => {
        setExternallyChanged(false);
        const editor = editorRef.current;
        if (!editor || !currentDiff) {
            return;
        }
        const model = editor.getModel();
        if (!model) {
            return;
        }
        const checkChanged = () => {
            if (model.getValue() !== currentDiff.originalText) {
                setExternallyChanged(true);
            }
        };
        // A yjs change may have already landed before this effect ran.
        checkChanged();
        const subscription = editor.onDidChangeModelContent(checkChanged);
        return () => subscription.dispose();
    }, [currentDiff?.id]);

    const handleEditorReady = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
        if (!editorRef.current || editorRef.current !== editor) {
            editorRef.current = editor;
        }
    }, []);

    const handleOnLoad = useCallback((wrapper: MonacoEditorLanguageClientWrapper) => {
        const monacoEditor = wrapper.getEditor();
        if (monacoEditor) {
            props.collabApi.setEditor(monacoEditor as any);
            handleEditorReady(monacoEditor as unknown as monaco.editor.IStandaloneCodeEditor);
        }

        const tsDefaults = monaco.languages.typescript.typescriptDefaults;
        const jsDefaults = monaco.languages.typescript.javascriptDefaults;
        const jsxEmit = monaco.languages.typescript.JsxEmit.ReactJSX;

        // TS-only syntax reported as JS diagnostics when a model is classified
        // as JS script kind (e.g. because its URI has no .ts/.tsx extension).
        // Example: "'interface' declarations can only be used in TypeScript files."
        const tsOnlyInJsCodes = [8002, 8003, 8004, 8005, 8006, 8008, 8009, 8010, 8011, 8012, 8013];

        tsDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
            noSuggestionDiagnostics: true,
            diagnosticCodesToIgnore: tsOnlyInJsCodes,
        });
        tsDefaults.setCompilerOptions({
            ...tsDefaults.getCompilerOptions(),
            jsx: jsxEmit,
            allowJs: true,
        });

        jsDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
            noSuggestionDiagnostics: true,
            diagnosticCodesToIgnore: tsOnlyInJsCodes,
        });
        jsDefaults.setCompilerOptions({
            ...jsDefaults.getCompilerOptions(),
            jsx: jsxEmit,
            allowJs: true,
        });
    }, [props.collabApi, handleEditorReady]);

    const wrapperConfig = useMemo(() => ({
        $type: 'classic' as const,
        editorAppConfig: {
            editorOptions: {
                automaticLayout: true,
                language: 'plaintext',
                value: ''
            },
            monacoWorkerFactory: () => {
                useWorkerFactory({
                    workerLoaders: {
                        TextEditorWorker: () => new Worker('/playground/editor.worker.js', { type: 'module' }),
                        css: () => new Worker('/playground/css.worker.js', { type: 'module' }),
                        html: () => new Worker('/playground/html.worker.js', { type: 'module' }),
                        json: () => new Worker('/playground/json.worker.js', { type: 'module' }),
                        javascript: () => new Worker('/playground/ts.worker.js', { type: 'module' }),
                        typescript: () => new Worker('/playground/ts.worker.js', { type: 'module' })
                    }
                });
            }
        }
    }), []);

    return (
        <div className="flex flex-col grow min-h-0 border-t-[2px] border-octoLilac">
            <FileInfo collabApi={props.collabApi} editorRef={editorRef} />
            <div className="flex grow min-h-0">
                <div className="flex-1 relative border-t-[1px] border-octoLilac">
                    <MonacoEditorReactComp
                        className="absolute inset-0"
                        wrapperConfig={wrapperConfig}
                        onLoad={handleOnLoad} />
                    {currentDiff && (
                        <DiffReview
                            currentDiff={currentDiff}
                            currentIndex={0}
                            totalCount={props.pendingDiffs.length}
                            externallyChanged={externallyChanged}
                            onAccept={props.onAcceptDiff}
                            onReject={props.onRejectDiff}
                            onCloseDiff={props.onDismissDiff}
                        />
                    )}
                </div>
                <div className="flex flex-col p-4 w-80 min-h-0 border-t border-l shrink-0 bg-lightLilac text-richBlack border-octoLilac">
                    <div className="shrink-0">
                        <RoomInfo collabApi={props.collabApi} roomToken={props.roomToken} />
                    </div>
                    <div className="flex flex-col flex-1 pt-4 mt-4 min-h-0 border-t border-octoLilac">
                        <SessionChat collabApi={props.collabApi} />
                    </div>
                </div>
            </div>
        </div>
    )
};
