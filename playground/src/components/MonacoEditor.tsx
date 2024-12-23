import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { MonacoCollabApi } from "open-collaboration-monaco";
import { useCallback } from "react";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";

export type MonacoEditorProps = {
    collabApi: MonacoCollabApi;
}

export function MonacoEditor(props: MonacoEditorProps) {
    const handleOnLoad = useCallback((wrapper: MonacoEditorLanguageClientWrapper) => {
        const editor = wrapper.getEditor();
        if (editor) {
            console.log('Setting wrapper', editor.getId());
            props.collabApi.setEditor(editor as any);
        }
    }, [props.collabApi]);

    return <MonacoEditorReactComp
        className="h-full w-full"
        wrapperConfig={
            {
                $type: 'classic',
                editorAppConfig: {
                    editorOptions: {
                        language: 'javascript',
                        value: ''
                    }
                }
            }
        } onLoad={handleOnLoad} />
}