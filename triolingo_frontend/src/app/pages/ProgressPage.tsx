import { CheckCircle2, Circle, Clock } from 'lucide-react';

export function ProgressPage() {
  const modules = [
    { name: 'Alphabet & Pronunciation', completed: true, progress: 100 },
    { name: 'Basic Grammar', completed: true, progress: 100 },
    { name: 'Essential Vocabulary', completed: false, progress: 65 },
    { name: 'Travel Phrases', completed: false, progress: 40 },
    { name: 'Conversational Practice', completed: false, progress: 20 },
    { name: 'Advanced Grammar', completed: false, progress: 0 },
    { name: 'Cultural Immersion', completed: false, progress: 0 },
    { name: 'Fluency Building', completed: false, progress: 0 },
  ];

  const overallProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progress, 0) / modules.length
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Your Progress</h1>
        <p className="text-gray-400">Track your Spanish learning journey</p>
      </div>

      <div className="border border-gray-800 rounded-lg bg-gray-900/30 p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2>Overall Progress</h2>
          <span className="text-3xl text-[#39ff14]">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4">
          <div
            className="bg-[#39ff14] h-4 rounded-full transition-all"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((module, idx) => (
          <div
            key={idx}
            className="border border-gray-800 rounded-lg bg-gray-900/30 p-6"
          >
            <div className="flex items-start gap-4">
              {module.completed ? (
                <CheckCircle2 className="w-6 h-6 text-[#39ff14] flex-shrink-0 mt-1" />
              ) : module.progress > 0 ? (
                <Clock className="w-6 h-6 text-[#39ff14] flex-shrink-0 mt-1" />
              ) : (
                <Circle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              )}

              <div className="flex-1">
                <h3 className="mb-2">{module.name}</h3>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      module.completed ? 'bg-[#39ff14]' : 'bg-[#39ff14]/70'
                    }`}
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{module.progress}% complete</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
