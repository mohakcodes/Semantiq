jest.mock('axios');

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    document: {
      create: jest.fn(),
    },
    edge: {
      create: jest.fn(),
    },
    $queryRawUnsafe: jest.fn(),
  },
}));

jest.mock('../../../lib/gemini', () => ({
  generateMetadata: jest.fn(),
  extractNodes: jest.fn(),
}));

import axios from 'axios';
import { analyzeText } from '../analyze.controller';
import { prisma } from '../../../lib/prisma';
import * as gemini from '../../../lib/gemini';

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGemini = gemini as jest.Mocked<typeof gemini>;

describe('analyzeText controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if text is small or missing', async () => {
    const req: any = { body: { text: 'short' } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await analyzeText(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Text too short or missing',
    });
  });

  it('returns document, nodes, edges on successful analysis', async () => {
    const req: any = {
      body: {
        text: 'Artificial intelligence is transforming healthcare systems worldwide.',
      },
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockedGemini.generateMetadata.mockResolvedValue({
      title: 'AI in Healthcare',
      summary: 'AI improves efficiency in healthcare.',
      tags: ['ai', 'healthcare'],
    });

    mockedGemini.extractNodes.mockResolvedValue([
      {
        label: 'Artificial Intelligence',
        summary: 'Machines simulating intelligence.',
        importance: 0.9,
      },
      {
        label: 'Healthcare',
        summary: 'Medical systems and services.',
        importance: 0.85,
      },
    ]);

    mockedAxios.post.mockResolvedValue({
      data: {
        embedding: Array(384).fill(0.1),
      },
    } as any);

    (prisma.document.create as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'AI in Healthcare',
      summary: 'AI improves efficiency in healthcare.',
      tags: ['ai', 'healthcare'],
      createdAt: new Date(),
    });

    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue([
      {
        id: 1,
        label: 'Artificial Intelligence',
        summary: 'Machines simulating intelligence.',
        importance: 0.9,
      },
      {
        id: 2,
        label: 'Healthcare',
        summary: 'Medical systems and services.',
        importance: 0.85,
      },
    ]);

    (prisma.edge.create as jest.Mock).mockResolvedValue({});

    await analyzeText(req, res);

    expect(res.json).toHaveBeenCalled();

    const payload = res.json.mock.calls[0][0];

    expect(payload.document.title).toBe('AI in Healthcare');
    expect(payload.nodes).toHaveLength(2);
    expect(Array.isArray(payload.edges)).toBe(true);
  });
});