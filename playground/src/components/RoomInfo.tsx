// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCopyToClipboard } from "../hooks/copyToClipboard.js";
import { MonacoCollabApi, OtherUserData } from "open-collaboration-monaco";
import { Peer } from "open-collaboration-monaco";
import { useEffect, useState } from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export type RoomInfoProps = {
    collabApi: MonacoCollabApi;
    roomToken: string;
}

export function RoomInfo(props: RoomInfoProps) {
    const [ownUserData, setOwnUserData] = useState<Peer | undefined>();
    const [connectedUsers, setConnectedUsers] = useState<OtherUserData[]>([]);
    const [copiedText, copy] = useCopyToClipboard();
    const [followedUser, setFollowedUser] = useState<string | undefined>();
    const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

    useEffect(() => {
        props.collabApi.getUserData().then(ud => {
            console.log('Setting User data', ud);
            setOwnUserData(ud?.me);
            setConnectedUsers(ud?.others || []);
        });

        props.collabApi.onUsersChanged(() => {
            props.collabApi.getUserData().then(ud => {
                console.log('Setting Users changed', ud);

                if (ud?.me && ud.me.host) {
                    setFollowedUser(undefined);
                } else if (ud?.me && !ud.me.host) {
                    const host = ud.others.find(u => u.peer.host);
                    if (host) {
                        setFollowedUser(host.peer.id);
                    }
                }

                setOwnUserData(ud?.me);
                setConnectedUsers(ud?.others || []);
            });
        });
    }, []);

    useEffect(() => {
        props.collabApi.followUser(followedUser);
    }, [followedUser]);

    const handleCopyRoomToken = () => {
        const textToCopy = props.roomToken;
        copy(textToCopy).then(success => {
            console.log(`Copied room token to clipboard: ${textToCopy}`);
            setShowCopiedTooltip(true);
            setTimeout(() => setShowCopiedTooltip(false), 2000);
        });
    };

    return <>
        <div className="flex items-center gap-2 font-semibold">
            Room ID
            <FontAwesomeIcon icon={faCopy} title="Copy room ID" className="cursor-pointer" onClick={handleCopyRoomToken} />
        </div>
        <div className="relative text-sm font-light">
            {props.roomToken}
            {showCopiedTooltip && (
                <div className="absolute px-2 py-1 text-xs text-white transform -translate-x-1/2 bg-gray-800 rounded -top-8 left-1/2">
                    Copied
                </div>
            )}
        </div>
        <div className="mt-4 font-semibold">
            Users
        </div>
        <div className="text-sm font-light">
            {
                ownUserData &&
                <div>
                    {ownUserData.name} (You)
                </div>
            }
            {
                connectedUsers.map(
                    userData => ownUserData?.id !== userData.peer.id &&
                        <div className="relative flex items-center group w-36" key={userData.peer.id}>
                            <div className="w-4 h-4 mr-2" style={{ backgroundColor: userData.color }} />
                            <div>
                                {userData.peer.name}
                            </div>
                        </div>
                )
            }
        </div>
    </>
}
