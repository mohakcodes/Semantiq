import { jest } from '@jest/globals';

process.env.GEMINI_API_KEY = 'test-key';
process.env.HF_EMBED_URL = 'http://mock-embed';

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});