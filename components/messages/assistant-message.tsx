import { UIMessage, ToolCallPart, ToolResultPart } from "ai";
import { Response } from "@/components/ai-elements/response";
import { ReasoningPart } from "./reasoning-part";
import { ToolCall, ToolResult } from "./tool-call";
import { AnswerCard } from "@/components/ai-elements/answer-card";

export function AssistantMessage({ message, status, isLastMessage, durations, onDurationChange }: { message: UIMessage; status?: string; isLastMessage?: boolean; durations?: Record<string, number>; onDurationChange?: (key: string, duration: number) => void }) {
    return (
        <div className="w-full">
            <div className="text-sm flex flex-col gap-4">
                {message.parts.map((part, i) => {
                    const isStreaming = status === "streaming" && isLastMessage && i === message.parts.length - 1;
                    const durationKey = `${message.id}-${i}`;
                    const duration = durations?.[durationKey];

                    if (part.type === "text") {
                        return (
                            <AnswerCard key={`${message.id}-${i}`} isStreaming={isStreaming}>
                                <Response
                                    className="prose prose-neutral mx-auto max-w-none text-base leading-relaxed text-[#3D0C12] sm:text-lg prose-headings:text-[#7A141C] prose-headings:font-bold prose-strong:text-[#A2131A] prose-strong:font-semibold prose-li:leading-relaxed [&_ol>li]:font-medium [&_ol>li::marker]:font-bold [&_ul>li::marker]:text-[#C7222A] [&_p:first-child]:font-semibold [&_p:first-child]:text-[#2C060A] [&_p:not(:first-child)]:mt-2 [&_h3]:text-lg [&_h4]:text-base text-left"
                                >
                                    {part.text}
                                </Response>
                            </AnswerCard>
                        );
                    } else if (part.type === "reasoning") {
                        return (
                            <ReasoningPart
                                key={`${message.id}-${i}`}
                                part={part}
                                isStreaming={isStreaming}
                                duration={duration}
                                onDurationChange={onDurationChange ? (d) => onDurationChange(durationKey, d) : undefined}
                            />
                        );
                    } else if (
                        part.type.startsWith("tool-") || part.type === "dynamic-tool"
                    ) {
                        if ('state' in part && part.state === "output-available") {
                            return (
                                <ToolResult
                                    key={`${message.id}-${i}`}
                                    part={part as unknown as ToolResultPart}
                                />
                            );
                        } else {
                            return (
                                <ToolCall
                                    key={`${message.id}-${i}`}
                                    part={part as unknown as ToolCallPart}
                                />
                            );
                        }
                    }
                    return null;
                })}
            </div>
        </div>
    )
}