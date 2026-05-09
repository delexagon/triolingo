import { useState } from 'react';
import { LearningPathForm } from '../components/LearningPathForm';
import { LearningGraph } from '../components/LearningGraph';

export function LearningPathPage() {
  const [pathConfig, setPathConfig] = useState<{
    timeLimit: string;
    experienceLevel: string;
    motivation: string;
  } | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Generate Your Path</h1>
        <p className="text-gray-400">Configure your personalized Spanish learning journey with triolingo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <LearningPathForm onSubmit={setPathConfig} />
        </div>

        <div className="lg:col-span-2">
          {pathConfig ? (
            <LearningGraph config={pathConfig} />
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
