import type { QuizResult } from '../pages/AssessmentPage';

interface Props {
  results: QuizResult[];
  onRestart: () => void;
}

const statusConfig = {
  known: {
    label: 'Known',
    color: 'text-emerald-400',
    border: 'border-emerald-800',
    bg: 'bg-emerald-900/15',
    dot: 'bg-emerald-400',
    barColor: 'bg-emerald-500',
  },
  weak: {
    label: 'Developing',
    color: 'text-amber-400',
    border: 'border-amber-800',
    bg: 'bg-amber-900/15',
    dot: 'bg-amber-400',
    barColor: 'bg-amber-500',
  },
  unknown: {
    label: 'Needs Work',
    color: 'text-red-400',
    border: 'border-red-900',
    bg: 'bg-red-900/10',
    dot: 'bg-red-400',
    barColor: 'bg-red-500',
  },
};

export function AssessmentResults({ results, onRestart }: Props) {
  const total = results.length;
  const known = results.filter((r) => r.grade.status === 'known').length;
  const weak = results.filter((r) => r.grade.status === 'weak').length;
  const unknown = results.filter((r) => r.grade.status === 'unknown').length;

  const score = Math.round(((known + weak * 0.5) / total) * 100);

  const summary =
    score >= 80
      ? "Excellent grasp of this region — you're ready to advance."
      : score >= 50
      ? "Solid foundation with a few gaps to shore up."
      : "This region needs focused practice before moving on.";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Score hero */}
      <div className="border border-gray-800 rounded-xl bg-gray-900/40 p-8 text-center">
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">
          Assessment Complete
        </p>

        <div className="relative inline-flex items-center justify-center mb-6">
          {/* Circular progress ring */}
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#1f2937"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 327} 327`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-100">{score}%</span>
            <span className="text-xs text-gray-500 font-mono">score</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm max-w-xs mx-auto leading-relaxed">
          {summary}
        </p>

        {/* Breakdown pills */}
        <div className="flex justify-center gap-4 mt-6">
          {[
            { count: known, label: 'Known', ...statusConfig.known },
            { count: weak, label: 'Developing', ...statusConfig.weak },
            { count: unknown, label: 'Needs Work', ...statusConfig.unknown },
          ].map(({ count, label, color, dot }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <span className={`text-sm font-mono ${color}`}>{count}</span>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart summary */}
      <div className="border border-gray-800 rounded-xl bg-gray-900/30 p-6 space-y-3">
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
          Breakdown
        </p>
        {(['known', 'weak', 'unknown'] as const).map((status) => {
          const count = results.filter((r) => r.grade.status === status).length;
          const pct = total > 0 ? (count / total) * 100 : 0;
          const cfg = statusConfig[status];
          return (
            <div key={status} className="flex items-center gap-4">
              <span className={`text-xs font-mono w-20 flex-shrink-0 ${cfg.color}`}>
                {cfg.label}
              </span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${cfg.barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-gray-500 w-6 text-right">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Per-question details */}
      <div className="border border-gray-800 rounded-xl bg-gray-900/20 divide-y divide-gray-800/50">
        <p className="px-6 py-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
          Question Details
        </p>
        {results.map((r, i) => {
          const cfg = statusConfig[r.grade.status];
          return (
            <div key={r.questionId} className={`px-6 py-5 ${cfg.bg}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-gray-600 mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-200 mb-1">{r.question}</p>
                    <p className="text-xs text-gray-500">
                      Your answer:{' '}
                      <span className="text-gray-400 italic">"{r.answer}"</span>
                    </p>
                    {r.grade.feedback && (
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                        {r.grade.feedback}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 flex-shrink-0 ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span className="text-xs font-mono">{cfg.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pb-4">
        <button
          onClick={onRestart}
          className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-gray-500 hover:text-gray-100 transition-all duration-200"
        >
          ← Retake Assessment
        </button>
        <button className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition-all duration-200">
          Update My Learning Path →
        </button>
      </div>
    </div>
  );
}
