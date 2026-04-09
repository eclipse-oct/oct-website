// ******************************************************************************
// Copyright 2025 TypeFox GmbH
// This program and the accompanying materials are made available under the
// terms of the MIT License, which is available in the project root.
// ******************************************************************************

import { MonacoCollabApi } from "open-collaboration-monaco";
import { useCallback, useEffect, useRef, useState } from "react";

export type SessionChatProps = {
    collabApi: MonacoCollabApi;
};

type ChatLine = {
    id: string;
    at: string;
    originId: string;
    author: string;
    text: string;
    isDirect: boolean;
};

function shortPeerId(id: string): string {
    return id.length > 10 ? `…${id.slice(-6)}` : id;
}

export function SessionChat(props: SessionChatProps) {
    const { collabApi } = props;
    const [messages, setMessages] = useState<ChatLine[]>([]);
    const [input, setInput] = useState("");
    const [chatAvailable, setChatAvailable] = useState<boolean | undefined>();
    const [typingHint, setTypingHint] = useState<string | undefined>();

    const peerNamesRef = useRef<Record<string, string>>({});
    const ownIdRef = useRef<string | undefined>();
    const lastSentRef = useRef<{ text: string; at: number } | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const typingClearRef = useRef<ReturnType<typeof setTimeout>>();
    const isWritingDebounceRef = useRef<ReturnType<typeof setTimeout>>();

    const refreshPeerDirectory = useCallback(async () => {
        const ud = await collabApi.getUserData();
        if (!ud) {
            peerNamesRef.current = {};
            ownIdRef.current = undefined;
            return;
        }
        ownIdRef.current = ud.me.id;
        const next: Record<string, string> = { [ud.me.id]: ud.me.name };
        for (const o of ud.others) {
            next[o.peer.id] = o.peer.name;
        }
        peerNamesRef.current = next;
    }, [collabApi]);

    useEffect(() => {
        void refreshPeerDirectory();
        collabApi.onUsersChanged(() => {
            void refreshPeerDirectory();
        });
    }, [collabApi, refreshPeerDirectory]);

    useEffect(() => {
        const conn = collabApi.getCurrentConnection();
        if (!conn) {
            setChatAvailable(undefined);
            return;
        }
        if (!conn.chat) {
            setChatAvailable(false);
            return;
        }
        setChatAvailable(true);
        void refreshPeerDirectory();

        conn.chat.onMessage((origin, message, isDirect) => {
            const names = peerNamesRef.current;
            const ownId = ownIdRef.current;
            const lastSent = lastSentRef.current;
            if (
                ownId &&
                origin === ownId &&
                lastSent &&
                message === lastSent.text &&
                Date.now() - lastSent.at < 2000
            ) {
                return;
            }
            const author =
                origin === ownId
                    ? "You"
                    : (names[origin] ?? `Unknown (${shortPeerId(origin)})`);
            const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const at = new Date().toISOString();
            setMessages(prev => [...prev, { id, at, originId: origin, author, text: message, isDirect }]);
        });

        conn.chat.onIsWriting(origin => {
            if (origin === ownIdRef.current) {
                return;
            }
            const names = peerNamesRef.current;
            const label = names[origin] ?? shortPeerId(origin);
            setTypingHint(`${label} is typing…`);
            if (typingClearRef.current) {
                clearTimeout(typingClearRef.current);
            }
            typingClearRef.current = setTimeout(() => setTypingHint(undefined), 2500);
        });

        return () => {
            if (typingClearRef.current) {
                clearTimeout(typingClearRef.current);
            }
            if (isWritingDebounceRef.current) {
                clearTimeout(isWritingDebounceRef.current);
            }
        };
    }, [collabApi, refreshPeerDirectory]);

    useEffect(() => {
        const el = listRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    const scheduleIsWriting = () => {
        const conn = collabApi.getCurrentConnection();
        if (!conn?.chat) {
            return;
        }
        if (isWritingDebounceRef.current) {
            clearTimeout(isWritingDebounceRef.current);
        }
        isWritingDebounceRef.current = setTimeout(() => {
            isWritingDebounceRef.current = undefined;
            void conn.chat!.isWriting();
        }, 400);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        scheduleIsWriting();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) {
            return;
        }
        const conn = collabApi.getCurrentConnection();
        if (!conn?.chat) {
            return;
        }
        if (!ownIdRef.current) {
            await refreshPeerDirectory();
        }
        let originId = ownIdRef.current;
        if (!originId) {
            const ud = await collabApi.getUserData();
            originId = ud?.me.id ?? "";
        }
        setInput("");
        await conn.chat.sendMessage(text);
        const now = Date.now();
        lastSentRef.current = { text, at: now };
        const at = new Date(now).toISOString();
        const id = `${now}-${Math.random().toString(16).slice(2)}`;
        setMessages(prev => [...prev, { id, at, originId, author: "You", text, isDirect: false }]);
    };

    if (chatAvailable === false) {
        return (
            <div className="text-sm font-light text-richBlack/80 px-1">
                Session chat needs a matching OCT client and server (chat protocol).
            </div>
        );
    }

    if (chatAvailable === undefined) {
        return (
            <div className="text-sm font-light text-richBlack/60 px-1">
                Connecting…
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-2">
            <div className="text-sm font-semibold shrink-0">Session chat</div>
            <div
                ref={listRef}
                className="flex-1 min-h-0 overflow-y-auto text-sm font-light space-y-2 pr-1"
            >
                {messages.length === 0 ? (
                    <div className="text-richBlack/50">No messages yet.</div>
                ) : (
                    messages.map(m => (
                        <div key={m.id} className="border-b border-octoLilac/40 pb-2 last:border-0">
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-richBlack/60">
                                <span className="font-medium text-richBlack">{m.author}</span>
                                <time dateTime={m.at}>{new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                                {m.isDirect && (
                                    <span className="text-octoLilac">Direct</span>
                                )}
                            </div>
                            <div className="mt-1 whitespace-pre-wrap break-words text-richBlack">{m.text}</div>
                        </div>
                    ))
                )}
            </div>
            {typingHint && (
                <div className="text-xs italic text-richBlack/55 shrink-0">{typingHint}</div>
            )}
            <form onSubmit={e => void handleSubmit(e)} className="flex gap-2 shrink-0 pt-1">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Message the room…"
                    className="flex-1 min-w-0 px-2 py-1.5 text-sm bg-white/80 border border-octoLilac rounded text-richBlack placeholder:text-richBlack/40"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="px-3 py-1.5 text-sm font-medium rounded bg-eminence text-white hover:opacity-90 disabled:opacity-50"
                    disabled={!input.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
