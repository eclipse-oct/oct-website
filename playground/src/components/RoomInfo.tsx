import { useCopyToClipboard } from "../hooks/copyToClipboard.js";
import { MonacoCollabApi, OtherUserData } from "open-collaboration-monaco";
import { Peer } from "open-collaboration-protocol";
import { useEffect, useState } from "react";

export type RoomInfoProps = {
    collabApi: MonacoCollabApi;
    roomToken: string;
}

export function RoomInfo(props: RoomInfoProps) {
    const [ownUserData, setOwnUserData] = useState<Peer | undefined>();
    const [connectedUsers, setConnectedUsers] = useState<OtherUserData[]>([]);
    const [copiedText, copy] = useCopyToClipboard();

    useEffect(() => {
        props.collabApi.getUserData().then(ud => {
            console.log('Setting User data', ud);
            setOwnUserData(ud?.me);
            setConnectedUsers(ud?.others || []);
        });
        
        props.collabApi.onUsersChanged(() => {
            props.collabApi.getUserData().then(ud => {
                console.log('Setting Users changed', ud);
                setOwnUserData(ud?.me);
                setConnectedUsers(ud?.others || []);
            });
        });
    }, []);

    const handleCopyRoomToken = () => {
        const textToCopy = props.roomToken;
        copy(textToCopy).then(success => {
            console.log(`Copied room token to clipboard: ${textToCopy}`);
        });
    };

    return <>
        <div className="font-semibold">
            Room
        </div>
        <div className="font-light text-sm cursor-pointer" onClick={handleCopyRoomToken}>
            {props.roomToken}
        </div>
        <div className="font-semibold">
            Users
        </div>
        <div className="font-light text-sm">
            {
                ownUserData &&
                <div>
                    {ownUserData.name} (You)
                </div>
            }
            {
                connectedUsers.map(
                    userData => ownUserData?.id !== userData.peer.id &&
                        <div className="flex" key={userData.peer.id}>
                            <div className="w-4 h-4" style={{backgroundColor: userData.color}} />
                            <div>
                                {userData.peer.name}
                            </div>
                        </div>
                )
            }
        </div>
    </>
}