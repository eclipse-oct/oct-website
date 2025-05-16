// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { MonacoCollabApi } from "open-collaboration-monaco";
import { MonacoEditor } from "./MonacoEditor.js";
import { RoomInfo } from "./RoomInfo.js";
import { FileInfo } from "./FileInfo.js";
import { useState } from "react";
export type MonacoEditorPageProps = {
  roomToken: string;
  collabApi: MonacoCollabApi;
}

export const MonacoEditorPage = (props: MonacoEditorPageProps) => {
  return (
    <div className="flex flex-col grow">
      <div className="flex items-center p-4 bg-columbiaBlue">
        <FileInfo collabApi={props.collabApi} />
      </div>
      <div className="flex grow">
        <div className="flex-1 overflow-auto grow">
          <MonacoEditor collabApi={props.collabApi} />
        </div>
        <div className="h-full p-4 w-60 bg-columbiaBlue">
          <RoomInfo collabApi={props.collabApi} roomToken={props.roomToken} />
        </div>
      </div>
    </div>
  )
};
