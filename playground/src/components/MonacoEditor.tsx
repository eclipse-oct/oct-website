import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { monacoCollab } from "oct-collaboration-monaco";
import { useCallback, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";

export const MonacoEditor = () => {
  // const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | undefined>(undefined);
  const handleOnLoad = useCallback((wrapper: MonacoEditorLanguageClientWrapper) => {
    editor.current = wrapper.getEditor();
    
  }, []);

  return (
      <MonacoEditorReactComp 
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
  )
};
