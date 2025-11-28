
import { streamText, UIMessage, convertToModelMessages, stepCountIs, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { MODEL } from '@/config';
import { SYSTEM_PROMPT } from '@/prompts';
import { isContentFlagged } from '@/lib/moderation';
import { isSafetyRelated, sendSafetyAlertEmail } from '@/lib/email';
import { webSearch } from './tools/web-search';
import { vectorDatabaseSearch } from './tools/search-vector-database';

export const maxDuration = 30;
export async function POST(req: Request) {
    const body = await req.json();
    const { messages } = body;
    
    // Try to get username from request body, cookies, or use default
    let username = body.username;
    if (!username) {
        // Try to get from cookies as fallback
        const cookies = req.headers.get('cookie');
        if (cookies) {
            const usernameMatch = cookies.match(/username=([^;]+)/);
            username = usernameMatch ? decodeURIComponent(usernameMatch[1]) : 'unknown';
        } else {
            username = 'unknown';
        }
    }

    const latestUserMessage = messages
        .filter((msg: UIMessage) => msg.role === 'user')
        .pop();

    if (latestUserMessage) {
        const textParts = latestUserMessage.parts
            .filter((part: any) => part.type === 'text')
            .map((part: any) => 'text' in part ? part.text : '')
            .join('');

        if (textParts) {
            // Check for safety/hazardous keywords and send email alert
            if (isSafetyRelated(textParts)) {
                // Get username from request body or use a default
                const user = username || 'employee';
                
                // Send email alert asynchronously (don't wait for it)
                sendSafetyAlertEmail(user, textParts).catch(error => {
                    console.error('Failed to send safety alert email:', error);
                });
            }
            
            const moderationResult = await isContentFlagged(textParts);

            if (moderationResult.flagged) {
                const stream = createUIMessageStream({
                    execute({ writer }) {
                        const textId = 'moderation-denial-text';

                        writer.write({
                            type: 'start',
                        });

                        writer.write({
                            type: 'text-start',
                            id: textId,
                        });

                        writer.write({
                            type: 'text-delta',
                            id: textId,
                            delta: moderationResult.denialMessage || "Your message violates our guidelines. I can't answer that.",
                        });

                        writer.write({
                            type: 'text-end',
                            id: textId,
                        });

                        writer.write({
                            type: 'finish',
                        });
                    },
                });

                return createUIMessageStreamResponse({ stream });
            }
        }
    }

    const result = streamText({
        model: MODEL,
        system: SYSTEM_PROMPT,
        messages: convertToModelMessages(messages),
        tools: {
            webSearch,
            vectorDatabaseSearch,
        },
        stopWhen: stepCountIs(10),
        providerOptions: {
            openai: {
                reasoningSummary: 'auto',
                reasoningEffort: 'low',
                parallelToolCalls: false,
            }
        }
    });

    return result.toUIMessageStreamResponse({
        sendReasoning: true,
    });
}