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
