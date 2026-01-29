import { describe, expect, it, beforeEach, jest } from "@jest/globals";

jest.mock('@google/genai', () => {
    return {
        GoogleGenAI: jest.fn().mockImplementation(() => ({
            models: {
                generateContent: jest.fn(),
            }
        }))
    }
})

import { GoogleGenAI } from '@google/genai';
import { generateMetadata, extractNodes } from '../gemini';

type GeminiResponse = {text?: string}
const mockGenerateContent = jest.fn<() => Promise<GeminiResponse>>();

beforeEach(() => {
    jest.clearAllMocks();
    (GoogleGenAI as unknown as jest.Mock).mockImplementation(() => ({
        models: {
            generateContent: mockGenerateContent,
        }
    }))
})

describe('../../lib/gemini', () => {
    describe('generateMetadata()', () => {
        it('returns parsed title, summary, and tags from valid JSON', async() => {
            mockGenerateContent.mockResolvedValueOnce({
                text: `
                    {
                        "title": "AI in Healthcare",
                        "summary": "AI improves diagnostics and efficiency. It enables data-driven care.",
                        "tags": ["AI", "Healthcare", "Diagnostics"]
                    }
                `
            })

            const result = await generateMetadata('some text');

            expect(result).toEqual({
                title: 'AI in Healthcare',
                summary: 'AI improves diagnostics and efficiency. It enables data-driven care.',
                tags: ['ai', 'healthcare', 'diagnostics'],
            })
        })

        it('falls back to default on invalide JSON', async() => {
            mockGenerateContent.mockResolvedValueOnce({
                text: 'this is not JSON'
            })

            const result = await generateMetadata('some text');

            expect(result).toEqual({
                title: 'Untitled Document',
                summary: '',
                tags: [],
            })
        })
    })

    describe('extractNodes()', () => {
        it('returns nodes from valid JSON array', async() => {
            mockGenerateContent.mockResolvedValueOnce({
                text: `[
                    {
                        "label": "Artificial Intelligence",
                        "summary": "Simulates intelligent behavior in machines. Used across domains.",
                        "importance": 0.95
                    },
                    {
                        "label": "Machine Learning",
                        "summary": "Subset of AI focused on learning from data. Enables predictions.",
                        "importance": 0.9
                    }
                ]`,
            })

            const result = await extractNodes('some text');
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                label: 'Artificial Intelligence',
                summary: expect.any(String),
                importance: 0.95
            })
        })

        it('returns empty array on non JSON', async() => {
            mockGenerateContent.mockResolvedValueOnce({
                text: 'broken response'
            })

            const result = await extractNodes('some text');
            expect(result).toEqual([]);
        })
    })
})