jest.mock('../../controllers/analyze.controller', () => ({
  analyzeText: jest.fn(),
}));

import request from 'supertest';
import express from 'express';
import { analyzeRouter } from '../analyze.routes';
import { analyzeText } from '../../controllers/analyze.controller';

const app = express();
app.use(express.json());
app.use('/api/analyze', analyzeRouter);

describe('POST /api/analyze (route)', () => {
  const mockAnalyzeText = analyzeText as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards request to controller and returns its response', async () => {
    mockAnalyzeText.mockImplementation((_req, res) => {
      res.status(200).json({ ok: true });
    });

    const res = await request(app)
      .post('/api/analyze')
      .send({ text: 'This is a sufficiently long test input text.' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(mockAnalyzeText).toHaveBeenCalledTimes(1);
  });
});