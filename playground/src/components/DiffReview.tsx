// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

export type ProposedChange = {
    id: string;
    path: string;
    originalText: string;
    modifiedText: string;
    accept: () => void;
    reject: () => void;
};

export type DiffReviewProps = {
    currentDiff: ProposedChange;
    currentIndex: number;
    totalCount: number;
    externallyChanged: boolean;
    onAccept: () => void;
    onReject: () => void;
    onSwitchToEditor: () => void;
    onCloseDiff: () => void;
};

export const DiffReview = ({ currentDiff, currentIndex, totalCount, externallyChanged, onAccept, onReject, onSwitchToEditor, onCloseDiff }: DiffReviewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const diffEditorRef = useRef<monaco.editor.IStandaloneDiffEditor>();

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const originalModel = monaco.editor.createModel(currentDiff.originalText, detectLanguage(currentDiff.path));
        const modifiedModel = monaco.editor.createModel(currentDiff.modifiedText, detectLanguage(currentDiff.path));

        const editor = monaco.editor.createDiffEditor(containerRef.current, {
            readOnly: true,
            originalEditable: false,
            automaticLayout: true,
            renderSideBySide: true
        });

        editor.setModel({ original: originalModel, modified: modifiedModel });
        diffEditorRef.current = editor;

        return () => {
            editor.dispose();
            originalModel.dispose();
            modifiedModel.dispose();
            diffEditorRef.current = undefined;
        };
    }, [currentDiff.id]);

    return (
        <div className="absolute inset-0 z-10 flex flex-col bg-white">
            <div className="flex items-center justify-between px-4 py-2 border-b shrink-0 bg-lightLilac border-octoLilac">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-richBlack">
                        {currentDiff.path}
                    </span>
                    <span className="text-xs text-eminence">
                        Change {currentIndex + 1} of {totalCount}
                    </span>
                </div>
                <div className="flex gap-2">
                    {externallyChanged ? (
                        <>
                            <button
                                onClick={onSwitchToEditor}
                                className="px-4 py-1.5 text-sm font-medium text-white rounded bg-eminence hover:bg-eminence/90 transition-colors"
                            >
                                Switch to editor
                            </button>
                            <button
                                onClick={onCloseDiff}
                                className="px-4 py-1.5 text-sm font-medium rounded border border-octoLilac text-richBlack hover:bg-white transition-colors"
                            >
                                Close diff
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onAccept}
                                className="px-4 py-1.5 text-sm font-medium text-white rounded bg-green-600 hover:bg-green-700 transition-colors"
                            >
                                Accept
                            </button>
                            <button
                                onClick={onReject}
                                className="px-4 py-1.5 text-sm font-medium text-white rounded bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                Reject
                            </button>
                        </>
                    )}
                </div>
            </div>
            {externallyChanged && (
                <div className="px-4 py-2 text-sm border-b shrink-0 bg-amber-50 border-amber-200 text-amber-900">
                    This file was changed in the background (e.g. the change was accepted elsewhere). The diff below may be outdated.
                </div>
            )}
            <div ref={containerRef} className="flex-1 min-h-0" />
        </div>
    );
};

function detectLanguage(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();
    const mapping: Record<string, string> = {
        ts: 'typescript',
        tsx: 'typescriptreact',
        js: 'javascript',
        jsx: 'javascriptreact',
        json: 'json',
        html: 'html',
        css: 'css',
        md: 'markdown',
        py: 'python',
        rs: 'rust',
        go: 'go',
        java: 'java',
        xml: 'xml',
        yaml: 'yaml',
        yml: 'yaml',
        sh: 'shell',
        bash: 'shell',
    };
    return mapping[ext ?? ''] ?? 'plaintext';
}
