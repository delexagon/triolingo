import { useState } from 'react';
import { AssessmentSetup } from '../components/AssessmentSetup';
import { AssessmentQuiz } from '../components/AssessmentQuiz';
import { AssessmentResults } from '../components/AssessmentResults';
import type { KnowledgeGraph, AssessmentQuestion, GradeResult } from '../types/assessment';

type Phase = 'setup' | 'quiz' | 'results';

export interface QuizResult {
  questionId: string;
  nodeId: string;
  question: string;
  answer: string;
  grade: GradeResult;
}

export function AssessmentPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [userId] = useState(() => `user_${Math.random().toString(36).slice(2, 9)}`);
  const [graph, setGraph] = useState<KnowledgeGraph | null>(null);

  const handleSetupComplete = (fetchedQuestions: AssessmentQuestion[], kg: KnowledgeGraph) => {
    setQuestions(fetchedQuestions);
    setGraph(kg);
    setPhase('quiz');
  };

  const handleQuizComplete = (quizResults: QuizResult[]) => {
    setResults(quizResults);
    setPhase('results');
  };

  const handleRestart = () => {
    setQuestions([]);
    setResults([]);
    setGraph(null);
    setPhase('setup');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
            Diagnostic Assessment
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-emerald-800 to-transparent" />
        </div>
        <h1 className="mb-2">Knowledge Assessment</h1>
        <p className="text-gray-400">
          Pinpoint your current level and calibrate your triolingo learning path
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {(['setup', 'quiz', 'results'] as Phase[]).map((p, i) => (
          <div key={p} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border transition-all duration-500 ${
                phase === p
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10'
                  : results.length > 0 && i < ['setup', 'quiz', 'results'].indexOf(phase)
                  ? 'border-emerald-700 text-emerald-700 bg-emerald-900/20'
                  : 'border-gray-700 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs font-mono uppercase tracking-wider ${
                phase === p ? 'text-gray-200' : 'text-gray-600'
              }`}
            >
              {p}
            </span>
            {i < 2 && <span className="mx-2 text-gray-700">—</span>}
          </div>
        ))}
      </div>

      {phase === 'setup' && (
        <AssessmentSetup userId={userId} onComplete={handleSetupComplete} />
      )}
      {phase === 'quiz' && graph && (
        <AssessmentQuiz
          userId={userId}
          questions={questions}
          graph={graph}
          onComplete={handleQuizComplete}
        />
      )}
      {phase === 'results' && (
        <AssessmentResults results={results} onRestart={handleRestart} />
      )}
    </div>
  );
}
