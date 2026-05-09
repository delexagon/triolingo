import { useState } from 'react';
import { Clock, GraduationCap, Target } from 'lucide-react';

interface LearningPathFormProps {
  onSubmit: (config: {
    timeLimit: string;
    experienceLevel: string;
    motivation: string;
  }) => void;
  isSubmitting?: boolean;
}

export function LearningPathForm({ onSubmit, isSubmitting = false }: LearningPathFormProps) {
  const [timeLimit, setTimeLimit] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [motivation, setMotivation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLimit && experienceLevel && motivation) {
      onSubmit({ timeLimit, experienceLevel, motivation });
    }
  };

  return (
    <div className="border border-gray-800 rounded-lg bg-gray-900/30 p-6">
      <h2 className="mb-6">Configure Your Path</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 mb-2 font-medium text-white">
            <Clock className="w-5 h-5 text-[#39ff14]" />
            Time Limit
          </label>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39ff14]"
            required
          >
            <option value="">Select timeline...</option>
            <option value="3months">3 Months - Intensive</option>
            <option value="6months">6 Months - Moderate</option>
            <option value="1year">1 Year - Comfortable</option>
            <option value="2years">2 Years - Relaxed</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-2 font-medium text-white">
            <GraduationCap className="w-5 h-5 text-[#39ff14]" />
            Experience Level
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39ff14]"
            required
          >
            <option value="">Select level...</option>
            <option value="absolute-beginner">Absolute Beginner</option>
            <option value="beginner">Beginner (A1)</option>
            <option value="elementary">Elementary (A2)</option>
            <option value="intermediate">Intermediate (B1)</option>
            <option value="upper-intermediate">Upper Intermediate (B2)</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-2 font-medium text-white">
            <Target className="w-5 h-5 text-[#39ff14]" />
            Learning Motivation
          </label>
          <select
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39ff14]"
            required
          >
            <option value="">Select scenario...</option>
            <option value="travel">Travel & Tourism</option>
            <option value="work">Professional/Business</option>
            <option value="academic">Academic Studies</option>
            <option value="cultural">Cultural Exploration</option>
            <option value="family">Family & Relationships</option>
            <option value="immigration">Immigration/Relocation</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#39ff14] hover:bg-[#2ee010] disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Generating...' : 'Generate Learning Path'}
        </button>
      </form>
    </div>
  );
}
