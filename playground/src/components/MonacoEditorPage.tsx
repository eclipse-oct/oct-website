// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { MonacoCollabApi } from "open-collaboration-monaco";
import { MonacoEditor } from "./MonacoEditor.js";
import { RoomInfo } from "./RoomInfo.js";

export type MonacoEditorPageProps = {
  roomToken: string;
  collabApi: MonacoCollabApi;
}

export const MonacoEditorPage = (props: MonacoEditorPageProps) => {
  return (
    <div className="flex grow">
      <div className="flex-1 overflow-auto grow">
        <MonacoEditor collabApi={props.collabApi} />
      </div>
      <div className="w-60 h-full bg-columbiaBlue p-4">
        <RoomInfo collabApi={props.collabApi} roomToken={props.roomToken} />
      </div>
    </div>
  )
};
