"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Eraser, Loader2, Plus, PlusIcon, Square } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { ChatHeader } from "@/app/parts/chat-header";
import { ChatHeaderBlock } from "@/app/parts/chat-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { AI_NAME, CLEAR_CHAT_TEXT, OWNER_NAME, WELCOME_MESSAGE } from "@/config";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty.")
    .max(2000, "Message must be at most 2000 characters."),
});

const STORAGE_KEY = "chat-sessions";
const MAX_SESSIONS = 5;

type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  messages: UIMessage[];
  durations: Record<string, number>;
};

const getTextFromMessage = (message: UIMessage) => {
  const part = message.parts.find(
    (p): p is { type: "text"; text: string } => p.type === "text",
  );
  return part?.text?.trim() ?? "";
};

const isMeaningfulUserMessage = (message: UIMessage) => {
  if (message.role !== "user") return false;
  const text = getTextFromMessage(message).toLowerCase();
  if (text.length < 8) return false;
  const cleaned = text.replace(/[^a-z0-9\s]/g, "").trim();
  const trivial = [
    "hi",
    "hello",
    "hey",
    "hii",
    "hiii",
    "sup",
    "test",
    "hola",
    "yo",
    "ok",
    "okay",
  ];
  return cleaned.length >= 8 && !trivial.includes(cleaned);
};

const CATEGORY_MAP = [
  { title: "HR Assistance", keywords: ["leave", "policy", "employee", "hr"] },
  { title: "Sales Support", keywords: ["sales", "pipeline", "deal", "client"] },
  { title: "Marketing Strategy", keywords: ["marketing", "campaign", "brand"] },
  {
    title: "Developer Guidance",
    keywords: ["code", "deploy", "bug", "engineer", "api"],
  },
  { title: "Operations Help", keywords: ["sop", "process", "workflow"] },
];

const generateSessionTitle = (messages: UIMessage[], createdAt: number) => {
  const userContent = messages
    .filter((message) => message.role === "user")
    .map((message) => getTextFromMessage(message).toLowerCase())
    .join(" ");

  const matchedCategory =
    CATEGORY_MAP.find((category) =>
      category.keywords.some((keyword) => userContent.includes(keyword)),
    )?.title ?? "General Assistance";

  const dateLabel = new Date(createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return `${matchedCategory} · ${dateLabel}`;
};

const createWelcomeMessage = (): UIMessage => ({
  id: `welcome-${Date.now()}`,
  role: "assistant",
  parts: [
    {
      type: "text",
      text: WELCOME_MESSAGE,
    },
  ],
});

const createSession = (messages: UIMessage[] = []): ChatSession => {
  const createdAt = Date.now();
  return {
    id: `session-${createdAt}`,
    title: generateSessionTitle(messages, createdAt),
    createdAt,
    messages,
    durations: {},
  };
};

const loadSessionsFromStorage = (): ChatSession[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed.sessions)) {
      return parsed.sessions;
    }
    if (parsed.messages) {
      return [
        {
          id: `session-${Date.now()}`,
          title: "General Assistance",
          createdAt: Date.now(),
      messages: parsed.messages || [],
      durations: parsed.durations || {},
        },
      ];
    }
    return [];
  } catch (error) {
    console.error("Failed to load sessions from localStorage:", error);
    return [];
  }
};

const saveSessionsToStorage = (sessions: ChatSession[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions }));
  } catch (error) {
    console.error("Failed to save sessions to localStorage:", error);
  }
};

const isMeaningfulSession = (session: ChatSession) =>
  session.messages.some(isMeaningfulUserMessage);

const enforceSessionLimit = (
  sessions: ChatSession[],
  activeId?: string | null,
) => {
  const sorted = [...sessions].sort((a, b) => b.createdAt - a.createdAt);
  const limited: ChatSession[] = [];
  for (const session of sorted) {
    if (session.id === activeId || isMeaningfulSession(session)) {
      if (
        limited.length < MAX_SESSIONS ||
        session.id === activeId ||
        !isMeaningfulSession(session)
      ) {
        limited.push(session);
      }
    }
    if (
      limited.length >= MAX_SESSIONS &&
      (!activeId || limited.some((s) => s.id === activeId))
    ) {
      break;
    }
  }
  return limited;
};

const getSessionPreview = (session: ChatSession) => {
  const lastAssistant = [...session.messages]
    .reverse()
    .find((message) => message.role === "assistant");
  const fallbackUser = session.messages.find((message) => message.role === "user");
  const text =
    getTextFromMessage(lastAssistant ?? fallbackUser ?? createWelcomeMessage()) ||
    "Conversation";
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
};

export default function Chat() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const handleChatError = (error: Error) => {
    const lowerMessage = error.message.toLowerCase();
    if (lowerMessage.includes("rate_limit")) {
      toast.error(
        "We’re getting a lot of traffic right now. Please retry in a few seconds.",
      );
      return;
    }
    toast.error("Something went wrong. Please try again.");
  };

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: [] as UIMessage[],
    onError: handleChatError,
  });

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authStatus = sessionStorage.getItem("isAuthenticated");
      if (authStatus === "true") {
        setIsAuthenticated(true);
        const storedSessions = loadSessionsFromStorage();
        if (storedSessions.length > 0) {
          const nextSessions = enforceSessionLimit(storedSessions);
          const initialSession = nextSessions[0];
          setSessions(nextSessions);
          setActiveSessionId(initialSession.id);
          setDurations(initialSession.durations || {});
          setMessages(initialSession.messages || []);
        } else {
          const welcomeSession = createSession([createWelcomeMessage()]);
          setSessions([welcomeSession]);
          setActiveSessionId(welcomeSession.id);
          setDurations({});
          setMessages(welcomeSession.messages);
          saveSessionsToStorage([welcomeSession]);
        }
        setIsClient(true);
      } else {
        router.replace("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isClient || !activeSessionId) return;
    setSessions((prevSessions) => {
      const nextSessions = prevSessions.map((session) => {
        if (session.id !== activeSessionId) return session;
        const updatedSession = {
          ...session,
          messages,
          durations,
        };
        const nextTitle = generateSessionTitle(messages, session.createdAt);
        if (nextTitle !== session.title) {
          updatedSession.title = nextTitle;
        }
        return updatedSession;
      });
      const limited = enforceSessionLimit(nextSessions, activeSessionId);
      saveSessionsToStorage(limited);
      return limited;
    });
  }, [messages, durations, isClient, activeSessionId]);

  const handleDurationChange = (key: string, duration: number) => {
    setDurations((prevDurations) => {
      const newDurations = { ...prevDurations };
      newDurations[key] = duration;
      return newDurations;
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    sendMessage({ text: data.message });
    form.reset();
    setAttachedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const startNewSession = () => {
    const welcomeMessages = [createWelcomeMessage()];
    const newSession = createSession(welcomeMessages);
    setActiveSessionId(newSession.id);
    setDurations({});
    setMessages(welcomeMessages);
    setSessions((prevSessions) => {
      const nextSessions = [newSession, ...prevSessions];
      const limited = enforceSessionLimit(nextSessions, newSession.id);
      saveSessionsToStorage(limited);
      return limited;
    });
    toast.success("Started a new chat");
  };

  function clearChat() {
    startNewSession();
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setAttachedFiles(Array.from(files));
    // TODO: hook upload endpoint here and include uploaded URLs in chat payload.
  };

  const handleSessionSelect = (sessionId: string) => {
    if (sessionId === activeSessionId) return;
    const selectedSession = sessions.find(
      (session) => session.id === sessionId,
    );
    if (!selectedSession) return;
    setActiveSessionId(selectedSession.id);
    setDurations(selectedSession.durations || {});
    setMessages(selectedSession.messages || []);
  };

  const displayedSessions = [...sessions]
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter((session) => session.id === activeSessionId || isMeaningfulSession(session))
    .slice(0, MAX_SESSIONS);

  // Show loading state while checking authentication
  if (!isAuthenticated || !isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-screen items-stretch font-sans dark:bg-black">
      {/* Left sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r bg-gradient-to-b from-[#FFF6F6] via-[#FFE5E5] to-[#FFCFCF] text-[#5B0A0E] px-6 py-6 gap-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-foreground">
            Chat History
          </p>
          <div className="mt-3 space-y-2 text-sm">
            {isClient && displayedSessions.length > 0 ? (
              displayedSessions.map((session) => (
            <button
                  type="button"
                  onClick={() => handleSessionSelect(session.id)}
                  key={session.id}
                  className={`w-full rounded-2xl border px-4 py-3 text-left shadow-[0_12px_30px_rgba(199,34,42,0.12)] transition ${
                    session.id === activeSessionId
                      ? "border-[#C7222A] bg-gradient-to-br from-[#FFE0E0] to-[#FFC5C5] text-[#5B0A0E]"
                      : "border-[#f7b6b4] bg-gradient-to-br from-[#FFEAEA] to-[#FFD1D1] text-[#7A141C] hover:border-[#C7222A]"
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-wide text-[#7A141C]/70">
                    {session.title}
                  </p>
                  <p className="truncate text-sm text-[#5B0A0E]">
                    {getSessionPreview(session)}
                  </p>
            </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#f5b3b3]/60 bg-white/60 px-4 py-6 text-center text-xs text-[#7a141c]">
                Start chatting to build your history. Messages automatically
                stay here thanks to local storage.
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto text-[11px] font-semibold text-[#5B0A0E]">
          Tailored assistance for Air India sales, marketing, developers &amp; HR.
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 dark:bg-black h-screen relative">
        <div className="fixed top-0 left-0 right-0 md:left-72 z-50 bg-linear-to-b from-background via-background/50 to-transparent dark:bg-black overflow-visible pb-16">
          <div className="relative overflow-visible">
            <ChatHeader>
              <ChatHeaderBlock />
              <ChatHeaderBlock className="justify-center items-center">
                <Avatar
                  className="size-8 ring-1 ring-primary"
                >
                  <AvatarImage src="/air-india-logo.png" />
                  <AvatarFallback>
                    <Image src="/air-india-logo.png" alt="Logo" width={36} height={36} />
                  </AvatarFallback>
                </Avatar>
                <p className="tracking-tight">Chat with {AI_NAME}</p>
              </ChatHeaderBlock>
              <ChatHeaderBlock className="justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={clearChat}
                >
                  <Plus className="size-4" />
                  {CLEAR_CHAT_TEXT}
                </Button>
              </ChatHeaderBlock>
            </ChatHeader>
          </div>
        </div>
        <div className="h-screen overflow-y-auto px-5 py-4 w-full pt-[88px] pb-[150px]">
          <div className="flex flex-col items-center justify-end min-h-full">
            {isClient ? (
              <>
                <div className="w-full flex justify-center mb-4">
                  <div className="max-w-3xl w-full">
                    <h2 className="pl-11 text-xl font-semibold tracking-tight">
                      Conversation
                    </h2>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <div className="max-w-3xl w-full pl-11">
                    <MessageWall
                      messages={messages}
                      status={status}
                      durations={durations}
                      onDurationChange={handleDurationChange}
                    />
                    {status === "submitted" && (
                      <div className="flex justify-start w-full">
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center max-w-2xl w-full">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-linear-to-t from-background via-background/50 to-transparent dark:bg-black overflow-visible pt-13">
          <div className="w-full px-5 pt-5 pb-1 items-center flex justify-center relative overflow-visible">
            <div className="message-fade-overlay" />
            <div className="max-w-3xl w-full">
              <form id="chat-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="chat-form-message" className="sr-only">
                          Message
                        </FieldLabel>
                        <div className="relative h-13 flex items-center">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="absolute left-2 top-2 z-10 rounded-full bg-card border-input"
                            onClick={handleFileButtonClick}
                          >
                            <PlusIcon className="size-4" />
                          </Button>
                          <Input
                            {...field}
                            id="chat-form-message"
                            className="h-15 pr-15 pl-11 rounded-[20px] border-2 border-[#C7222A] bg-card focus:border-[#A91B20]"
                            placeholder="Type your message here..."
                            disabled={status === "streaming"}
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                          />
                          {(status == "ready" || status == "error") && (
                            <Button
                              className="absolute right-3 top-3 rounded-full"
                              type="submit"
                              disabled={!field.value.trim()}
                              size="icon"
                            >
                              <ArrowUp className="size-4" />
                            </Button>
                          )}
                          {(status == "streaming" || status == "submitted") && (
                            <Button
                              className="absolute right-2 top-2 rounded-full"
                              size="icon"
                              onClick={() => {
                                stop();
                              }}
                            >
                              <Square className="size-4" />
                            </Button>
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </div>
          </div>
          <div className="w-full px-5 py-3 items-center flex justify-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {OWNER_NAME}&nbsp;<Link href="/terms" className="underline">Terms of Use</Link>&nbsp;Powered by&nbsp;<Link href="https://ringel.ai/" className="underline">Ringel.AI</Link>
          </div>
        </div>
      </main>
    </div >
  );
}
