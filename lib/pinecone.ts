import { Pinecone } from '@pinecone-database/pinecone';
import { PINECONE_TOP_K, PINECONE_INDEX_NAME, CAN_ACCESS_AIR_INDIA_FINANCIALS, FINANCIALS_ACCESS_DENIAL_MESSAGE } from '@/config';
import { searchResultsToChunks, getSourcesFromChunks, getContextFromSources } from '@/lib/sources';

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set');
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

export async function searchPinecone(
    query: string,
): Promise<string> {
    const results = await pineconeIndex.namespace('default').searchRecords({
        query: {
            inputs: {
                text: query,
            },
            topK: PINECONE_TOP_K,
        },
        fields: ['text', 'pre_context', 'post_context', 'source_url', 'source_description', 'source_type', 'order'],
    });

    const chunks = searchResultsToChunks(results);
    const sources = getSourcesFromChunks(chunks);

    // Global access control for Air India financials.
    const hasFinancialsSource = sources.some(
        (source) => source.source_name === 'air-india-financials',
    );

    if (!CAN_ACCESS_AIR_INDIA_FINANCIALS && hasFinancialsSource) {
        return FINANCIALS_ACCESS_DENIAL_MESSAGE;
    }

    const context = getContextFromSources(sources);
    return `< results > ${context} </results>`;
}