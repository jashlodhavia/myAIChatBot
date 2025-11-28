import { UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";

type MessageWallProps = {
  messages: UIMessage[];
  status?: string;
  durations?: Record<string, number>;
  onDurationChange?: (key: string, duration: number) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
};

export function MessageWall({
  messages,
  status,
  durations,
  onDurationChange,
  scrollContainerRef,
}: MessageWallProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isStreamingRef = useRef(false);

  const smoothScrollToBottom = () => {
    const container = scrollContainerRef?.current;
    if (container) {
      const targetScroll = container.scrollHeight - container.clientHeight;
      const currentScroll = container.scrollTop;
      const distance = targetScroll - currentScroll;
      
      // Smooth easing - scroll faster when further away
      if (Math.abs(distance) > 1) {
        container.scrollTop = currentScroll + distance * 0.3;
      } else {
        container.scrollTop = targetScroll;
      }
    } else {
      // Fallback to window scroll
      const targetScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const distance = targetScroll - currentScroll;
      
      if (Math.abs(distance) > 1) {
        window.scrollTo(0, currentScroll + distance * 0.3);
      } else {
        window.scrollTo(0, targetScroll);
      }
    }
  };

  const startSmoothScrolling = () => {
    const scroll = () => {
      if (isStreamingRef.current) {
        smoothScrollToBottom();
        animationFrameRef.current = requestAnimationFrame(scroll);
      }
    };
    animationFrameRef.current = requestAnimationFrame(scroll);
  };

  const stopSmoothScrolling = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Continuous smooth scrolling during streaming
  useEffect(() => {
    if (status === "streaming") {
      isStreamingRef.current = true;
      startSmoothScrolling();
    } else {
      isStreamingRef.current = false;
      stopSmoothScrolling();
      // Final smooth scroll when done
      smoothScrollToBottom();
    }

    return () => {
      isStreamingRef.current = false;
      stopSmoothScrolling();
    };
  }, [status, scrollContainerRef]);

  // Ensure we always land at the bottom once the final content renders
  useEffect(() => {
    if (status !== "streaming") {
      const timeout = setTimeout(() => {
        smoothScrollToBottom();
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [messages, status, scrollContainerRef]);

  return (
    <div className="relative w-full max-w-3xl">
      <div className="relative flex flex-col gap-4">
        {messages.map((message, messageIndex) => {
          const isLastMessage = messageIndex === messages.length - 1;
          return (
            <div key={message.id} className="w-full">
              {message.role === "user" ? (
                <UserMessage message={message} />
              ) : (
                <AssistantMessage
                  message={message}
                  status={status}
                  isLastMessage={isLastMessage}
                  durations={durations}
                  onDurationChange={onDurationChange}
                />
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
