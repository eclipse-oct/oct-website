import { MonacoCollabApi } from "open-collaboration-monaco";
import { useEffect, useState } from "react";
import { Peer } from "open-collaboration-protocol";
import { MonacoEditor } from "./MonacoEditor.js";
import { RoomInfo } from "./RoomInfo.js";

export type MonacoEditorPageProps = {
  roomToken: string;
  collabApi: MonacoCollabApi;
}

export const MonacoEditorPage = (props: MonacoEditorPageProps) => {
  return (
    <div className="flex h-full w-full">
      <div className="flex-1 overflow-auto">
        <MonacoEditor collabApi={props.collabApi} />
      </div>
      <div className="w-60 h-full bg-gray-800">
        <RoomInfo collabApi={props.collabApi} roomToken={props.roomToken} />
      </div>
    </div>
  )
};
