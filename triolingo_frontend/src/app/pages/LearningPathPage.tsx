import { useState } from 'react';
import { LearningPathForm } from '../components/LearningPathForm';
import { LearningGraph } from '../components/LearningGraph';
import { personalizeGraph } from '../api';
import type { KnowledgeGraph } from '../api';

export function LearningPathPage() {
  const [graph, setGraph] = useState<KnowledgeGraph | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState('');

  const handleSubmit = async (config: { timeLimit: string; experienceLevel: string; motivation: string }) => {
    setLoading(true);
    setError(null);
    setGraph(null);

    try {
      const result = await personalizeGraph({
        language: 'spanish',
        motivation: config.motivation,
        timeLimit: config.timeLimit,
        experienceLevel: config.experienceLevel,
      });
      setGraph(result.graph);
      setUserId(result.user_id);
      setSubtitle(`${getTimeLabel(config.timeLimit)} · ${getMotivationLabel(config.motivation)}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Personalization failed: ${msg}. Make sure the backend is running and HF_TOKEN is set.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Generate Your Path</h1>
        <p className="text-gray-400">Configure your personalized Spanish learning journey with triolingo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <LearningPathForm onSubmit={handleSubmit} />
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="border border-gray-800 rounded-lg bg-gray-900/30 p-12 flex flex-col items-center justify-center min-h-[600px] gap-4">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Personalizing your learning path...</p>
            </div>
          ) : error ? (
            <div className="border border-red-800 rounded-lg bg-red-900/20 p-12 flex items-center justify-center min-h-[600px]">
              <p className="text-red-400 text-center text-sm">{error}</p>
            </div>
          ) : graph ? (
            <LearningGraph graph={graph} subtitle={subtitle} />
          ) : (
            <div className="border border-gray-800 rounded-lg bg-gray-900/30 p-12 flex items-center justify-center min-h-[600px]">
              <p className="text-gray-500 text-center">
                Fill out the form to generate your personalized learning path
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeLabel(timeLimit: string): string {
  const labels: Record<string, string> = {
    '3months': '3-month intensive track',
    '6months': '6-month moderate pace',
    '1year': '1-year comfortable pace',
    '2years': '2-year relaxed pace',
  };
  return labels[timeLimit] ?? timeLimit;
}

function getMotivationLabel(motivation: string): string {
  const labels: Record<string, string> = {
    travel: 'Travel & Tourism focus',
    work: 'Professional/Business focus',
    academic: 'Academic Studies focus',
    cultural: 'Cultural Exploration focus',
    family: 'Family & Relationships focus',
    immigration: 'Immigration/Relocation focus',
  };
  return labels[motivation] ?? motivation;
}
