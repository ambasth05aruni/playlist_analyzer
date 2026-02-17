"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    component?: React.ReactNode;
}

interface ChatPanelProps {
    onSendMessage: (message: string) => Promise<{ text: string; component?: React.ReactNode }>;
}

export default function ChatPanel({ onSendMessage }: ChatPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content:
                "Hi! I'm your Playlist AI Assistant. Try asking me:\n• \"Summarize this playlist\"\n• \"Make me a study plan for 2 hours/day\"\n• \"I want to learn Python in 4 weeks\"\n• \"Compare these playlists\"",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await onSendMessage(userMessage.content);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.text,
                component: response.component,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating chat button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/25 hover:scale-110 transition-transform duration-200"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Chat panel */}
            <div
                className={`fixed bottom-24 right-6 z-40 w-96 max-h-[600px] transition-all duration-300 ${isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/30 via-pink-500/30 to-purple-500/30 rounded-2xl blur" />
                    <div className="relative bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[600px]">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">Playlist AI</h3>
                                    <p className="text-white/40 text-xs">Powered by AI</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[440px] custom-scrollbar">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Bot className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] ${msg.role === "user"
                                                ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/20"
                                                : "bg-white/5 border border-white/10"
                                            } rounded-xl px-3 py-2`}
                                    >
                                        <p className="text-white/80 text-sm whitespace-pre-wrap">{msg.content}</p>
                                        {msg.component && <div className="mt-3">{msg.component}</div>}
                                    </div>
                                    {msg.role === "user" && (
                                        <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <User className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 justify-start">
                                    <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-md flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                                        <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-3 border-t border-white/10 bg-white/5"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about playlists..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="w-9 h-9 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity"
                                >
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
