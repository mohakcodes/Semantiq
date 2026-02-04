import type { AnalyzeResponse } from '@/types/analyze';

export const MOCK_ANALYZE_RESPONSE: AnalyzeResponse = {
  document: {
    id: 20,
    title: 'Distance, Silence, and Inner Peace',
    summary:
      'Distance and silence are crucial for personal growth by providing space from overwhelming stimuli, enabling mental rest and clarity. This intentional detachment fosters inner peace, perspective, and strengthened purpose, representing a proactive act of self-care.',
    tags: [
      'personal growth',
      'mental well-being',
      'self-care',
      'inner peace',
      'mindfulness',
    ],
    createdAt: '2026-02-03T16:09:34.691Z',
  },

  nodes: [
    {
      id: 92,
      label: 'personal growth',
      summary:
        "An ongoing process of self-improvement and self-discovery that aims to enhance one's potential and well-being.",
      importance: 0.85,
    },
    {
      id: 93,
      label: 'mental well-being',
      summary:
        "A state of psychological health and emotional balance that enables a person to cope with life's stresses.",
      importance: 0.88,
    },
    {
      id: 94,
      label: 'distance',
      summary:
        'Creating physical or mental separation from external pressures to regain clarity and perspective.',
      importance: 0.9,
    },
    {
      id: 95,
      label: 'silence',
      summary:
        'A state of quietude that allows the mind to rest, recover clarity, and access inner wisdom.',
      importance: 0.92,
    },
    {
      id: 96,
      label: 'peace',
      summary:
        'A state of inner calm and strengthened purpose emerging from reflection and detachment.',
      importance: 0.95,
    },
    {
      id: 97,
      label: 'self-care',
      summary:
        "An intentional practice of tending to one’s health and happiness through proactive actions.",
      importance: 0.8,
    },
    {
      id: 98,
      label: 'self-respect',
      summary:
        "A deep regard for one’s dignity and worth, expressed through protective and value-aligned choices.",
      importance: 0.82,
    },
  ],

  edges: [
    { from: 'silence', to: 'peace', relation: 'similar', strength: 0.817 },
    { from: 'mental well-being', to: 'self-care', relation: 'similar', strength: 0.74 },
    { from: 'self-care', to: 'self-respect', relation: 'similar', strength: 0.73 },
    { from: 'personal growth', to: 'self-care', relation: 'similar', strength: 0.705 },
    { from: 'mental well-being', to: 'peace', relation: 'similar', strength: 0.685 },
    { from: 'personal growth', to: 'mental well-being', relation: 'similar', strength: 0.681 },
    { from: 'distance', to: 'peace', relation: 'similar', strength: 0.651 },
    { from: 'peace', to: 'self-care', relation: 'similar', strength: 0.65 },
    { from: 'peace', to: 'self-respect', relation: 'similar', strength: 0.645 },
    { from: 'mental well-being', to: 'silence', relation: 'similar', strength: 0.636 },
  ],
};