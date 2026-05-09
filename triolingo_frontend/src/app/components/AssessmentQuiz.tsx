import { useState, useRef, useEffect } from 'react';
import type { AssessmentQuestion, KnowledgeGraph, GradeResult } from '../types/assessment';
import type { QuizResult } from '../pages/AssessmentPage';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

interface Props {
  userId: string;
  questions: AssessmentQuestion[];
  graph: KnowledgeGraph;
  onComplete: (results: QuizResult[]) => void;
}

type AnswerState = 'idle' | 'grading' | 'graded';

export function AssessmentQuiz({ userId, questions, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [currentGrade, setCurrentGrade] = useState<GradeResult | null>(null);
  const [collectedResults, setCollectedResults] = useState<QuizResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const question = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  useEffect(() => {
    if (answerState === 'idle') {
      inputRef.current?.focus();
    }
  }, [answerState, currentIdx]);

  const handleSubmit = async () => {
    if (!answer.trim() || answerState !== 'idle') return;
    setAnswerState('grading');
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/assess/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          question_id: question.id,
          answer: answer.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Server error ${res.status}: ${body}`);
      }

      const grade: GradeResult = await res.json();
      setCurrentGrade(grade);
      setAnswerState('graded');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAnswerState('idle');
    }
  };

  const handleNext = () => {
    if (!currentGrade) return;

    const newResult: QuizResult = {
      questionId: question.id,
      nodeId: question.node_id,
      question: question.question,
      answer: answer.trim(),
      grade: currentGrade,
    };

    const updatedResults = [...collectedResults, newResult];
    setCollectedResults(updatedResults);

    if (currentIdx + 1 >= questions.length) {
      onComplete(updatedResults);
    } else {
      setCurrentIdx((i) => i + 1);
      setAnswer('');
      setCurrentGrade(null);
      setAnswerState('idle');
    }
  };

  const statusConfig = {
    known: {
      label: 'Known',
      color: 'text-emerald-400',
      border: 'border-emerald-700',
      bg: 'bg-emerald-900/20',
      dot: 'bg-emerald-400',
    },
    weak: {
      label: 'Developing',
      color: 'text-amber-400',
      border: 'border-amber-700',
      bg: 'bg-amber-900/20',
      dot: 'bg-amber-400',
    },
    unknown: {
      label: 'Not Yet Known',
      color: 'text-red-400',
      border: 'border-red-800',
      bg: 'bg-red-900/20',
      dot: 'bg-red-400',
    },
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-gray-500">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Dot indicators */}
        <div className="flex gap-2 pt-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < currentIdx
                  ? 'bg-emerald-600'
                  : i === currentIdx
                  ? 'bg-emerald-400'
                  : 'bg-gray-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="border border-gray-800 rounded-xl bg-gray-900/40 overflow-hidden">
        {/* Card header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-800/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">
              Concept
            </span>
            <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
              {question.node_id}
            </span>
          </div>
          <p className="text-xl text-gray-100 leading-relaxed font-light">
            {question.question}
          </p>
        </div>

        {/* Answer area */}
        <div className="px-8 py-6 space-y-4">
          <textarea
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && answerState === 'idle') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={answerState !== 'idle'}
            placeholder="Type your answer… (Enter to submit)"
            rows={3}
            className="w-full bg-gray-950/60 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />

          {error && (
            <div className="border border-red-800 bg-red-900/20 rounded-lg px-4 py-3 text-sm text-red-400 font-mono">
              {error}
            </div>
          )}

          {/* Grade feedback */}
          {answerState === 'graded' && currentGrade && (
            <div
              className={`border rounded-lg px-5 py-4 space-y-2 transition-all duration-300 ${statusConfig[currentGrade.status].border} ${statusConfig[currentGrade.status].bg}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${statusConfig[currentGrade.status].dot}`}
                />
                <span
                  className={`text-sm font-semibold font-mono uppercase tracking-wider ${statusConfig[currentGrade.status].color}`}
                >
                  {statusConfig[currentGrade.status].label}
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {currentGrade.feedback}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            {answerState === 'idle' && (
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-semibold transition-all duration-200"
              >
                Submit Answer
              </button>
            )}

            {answerState === 'grading' && (
              <button disabled className="px-6 py-2.5 rounded-lg bg-gray-800 text-gray-400 text-sm font-mono flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-gray-600 border-t-emerald-400 rounded-full animate-spin" />
                Grading…
              </button>
            )}

            {answerState === 'graded' && (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition-all duration-200"
              >
                {currentIdx + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prior questions mini-log */}
      {collectedResults.length > 0 && (
        <div className="border border-gray-800 rounded-lg bg-gray-900/20 p-4 space-y-2">
          <p className="text-xs font-mono text-gray-600 uppercase tracking-wider mb-3">
            Answered
          </p>
          {collectedResults.map((r) => (
            <div key={r.questionId} className="flex items-center justify-between text-sm">
              <span className="text-gray-500 truncate max-w-sm">{r.question}</span>
              <span
                className={`text-xs font-mono ml-4 flex-shrink-0 ${statusConfig[r.grade.status].color}`}
              >
                {statusConfig[r.grade.status].label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
