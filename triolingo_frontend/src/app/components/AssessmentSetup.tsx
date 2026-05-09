import { useState } from 'react';
import type { KnowledgeGraph, AssessmentQuestion, GraphNode, GraphEdge } from '../types/assessment';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// Preset knowledge graphs users can choose from
const PRESET_REGIONS = [
  { id: 'basics', label: 'Basics', tags: ['basics'], color: 'emerald' },
  { id: 'verbs', label: 'Verbs', tags: ['verbs'], color: 'sky' },
  { id: 'vocabulary', label: 'Vocabulary', tags: ['vocabulary'], color: 'violet' },
  { id: 'grammar', label: 'Grammar', tags: ['grammar'], color: 'amber' },
];

const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'];

/** Build a sample knowledge graph for the selected region/level */
function buildSampleGraph(region: string, level: string): KnowledgeGraph {
  const difficultyMap: Record<string, number> = {
    beginner: 1,
    intermediate: 3,
    advanced: 5,
  };
  const base = difficultyMap[level] ?? 1;

  const nodeTemplates: Record<string, { id: string; label: string; type: string }[]> = {
    basics: [
      { id: 'greet_hello', label: 'Saying Hello (hola)', type: 'phrase' },
      { id: 'greet_bye', label: 'Saying Goodbye (adiós)', type: 'phrase' },
      { id: 'numbers_1_10', label: 'Numbers 1–10', type: 'vocabulary' },
      { id: 'colors_basic', label: 'Basic Colors', type: 'vocabulary' },
      { id: 'days_week', label: 'Days of the Week', type: 'vocabulary' },
    ],
    verbs: [
      { id: 'verb_ser', label: 'ser (to be – permanent)', type: 'verb' },
      { id: 'verb_estar', label: 'estar (to be – temporary)', type: 'verb' },
      { id: 'verb_tener', label: 'tener (to have)', type: 'verb' },
      { id: 'verb_ir', label: 'ir (to go)', type: 'verb' },
      { id: 'verb_hacer', label: 'hacer (to do/make)', type: 'verb' },
    ],
    vocabulary: [
      { id: 'food_common', label: 'Common Foods', type: 'vocabulary' },
      { id: 'family_members', label: 'Family Members', type: 'vocabulary' },
      { id: 'body_parts', label: 'Body Parts', type: 'vocabulary' },
      { id: 'weather_words', label: 'Weather Expressions', type: 'vocabulary' },
      { id: 'time_expressions', label: 'Time Expressions', type: 'vocabulary' },
    ],
    grammar: [
      { id: 'noun_gender', label: 'Noun Gender (el/la)', type: 'grammar' },
      { id: 'adj_agreement', label: 'Adjective Agreement', type: 'grammar' },
      { id: 'present_tense', label: 'Present Tense Conjugation', type: 'grammar' },
      { id: 'question_form', label: 'Forming Questions', type: 'grammar' },
      { id: 'negation', label: 'Negation (no, nunca…)', type: 'grammar' },
    ],
  };

  const templates = nodeTemplates[region] ?? nodeTemplates['basics'];

  const nodes: GraphNode[] = templates.map((t) => ({
    ...t,
    difficulty: base,
    tags: [region],
    status: 'unknown',
  }));

  const edges: GraphEdge[] = nodes.slice(0, -1).map((n, i) => ({
    source: n.id,
    target: nodes[i + 1].id,
    relationship: 'leads_to',
  }));

  return { nodes, edges };
}

interface Props {
  userId: string;
  onComplete: (questions: AssessmentQuestion[], graph: KnowledgeGraph) => void;
}

export function AssessmentSetup({ userId, onComplete }: Props) {
  const [region, setRegion] = useState('basics');
  const [level, setLevel] = useState('beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);

    const graph = buildSampleGraph(region, level);

    try {
      const res = await fetch(`${API_BASE}/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          graph,
          region,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Server error ${res.status}: ${body}`);
      }

      const data = await res.json();
      const questions: AssessmentQuestion[] = data.questions ?? [];

      if (questions.length === 0) {
        throw new Error('No questions were returned. Try a different region or level.');
      }

      onComplete(questions, graph);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Config panel */}
      <div className="border border-gray-800 rounded-lg bg-gray-900/40 p-8 space-y-8">
        <div>
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">
            Topic Region
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {PRESET_REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRegion(r.id)}
                className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                  region === r.id
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-gray-800 bg-gray-900/20 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                <span className="block text-sm font-semibold">{r.label}</span>
                <span className="block text-xs text-gray-500 mt-1">
                  {r.tags.join(', ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">
            Experience Level
          </h2>
          <div className="flex gap-3">
            {EXPERIENCE_LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex-1 py-3 rounded-lg border text-sm font-mono capitalize transition-all duration-200 ${
                  level === l
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="border border-red-800 bg-red-900/20 rounded-lg p-4 text-sm text-red-400 font-mono">
            {error}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold tracking-wide transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Generating Questions…
            </span>
          ) : (
            'Start Assessment →'
          )}
        </button>
      </div>

      {/* Info panel */}
      <div className="border border-gray-800 rounded-lg bg-gray-900/20 p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-100 mb-2">How it works</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              The diagnostic selects up to 5 concepts from your chosen region and
              generates targeted questions. Your answers are graded and used to mark
              each concept as <span className="text-emerald-400">known</span>,{' '}
              <span className="text-amber-400">weak</span>, or{' '}
              <span className="text-red-400">unknown</span> — calibrating your
              learning path automatically.
            </p>
          </div>

          <div className="space-y-3">
            {[
              ['~5 questions', 'One per concept node'],
              ['Instant grading', 'AI-powered feedback per answer'],
              ['Path calibration', 'Results feed directly into your graph'],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <div>
                  <span className="text-sm text-gray-200 font-medium">{title}</span>
                  <span className="text-gray-500 text-sm"> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-600 font-mono">
            API: <span className="text-gray-500">{API_BASE}/assess</span>
          </p>
        </div>
      </div>
    </div>
  );
}
