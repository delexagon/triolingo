import { Link } from 'react-router';
import { ArrowRight, Zap, Target, Clock } from 'lucide-react';
import { SampleGraph } from '../components/SampleGraph';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="mb-2 text-gray-500">Welcome to</div>
        <h1 className="mb-4 text-6xl">
          <span className="text-[#39ff14]">trio</span>lingo
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Your personalized Spanish learning adventure starts here
        </p>
        <Link
          to="/learning-path"
          className="inline-flex items-center gap-2 bg-[#39ff14] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#2ee010] transition-all hover:scale-105"
        >
          Generate Your Path
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="mb-16">
        <h2 className="text-center mb-6">
          Sample Learning Path
        </h2>
        <SampleGraph />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-[#39ff14] transition-colors">
          <div className="w-12 h-12 bg-[#39ff14] rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <h3 className="mb-2">Adaptive Learning</h3>
          <p className="text-gray-400">
            Your path evolves with you - skip what you know, focus on what you need
          </p>
        </div>

        <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-[#39ff14] transition-colors">
          <div className="w-12 h-12 bg-[#39ff14] rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-black" />
          </div>
          <h3 className="mb-2">Goal-Oriented</h3>
          <p className="text-gray-400">
            Travel, work, family - your goals shape your journey
          </p>
        </div>

        <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-[#39ff14] transition-colors">
          <div className="w-12 h-12 bg-[#39ff14] rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-black" />
          </div>
          <h3 className="mb-2">Time-Optimized</h3>
          <p className="text-gray-400">
            3 months sprint or 2 year marathon - you choose the pace
          </p>
        </div>
      </div>

      <div className="border border-gray-800 rounded-lg p-12 bg-gray-900/30 text-center">
        <h2 className="mb-4">How triolingo Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          <div>
            <div className="w-12 h-12 bg-[#39ff14] text-black rounded-full flex items-center justify-center font-bold mx-auto mb-3 text-xl">
              1
            </div>
            <p className="text-gray-300">Select your timeline</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-[#39ff14] text-black rounded-full flex items-center justify-center font-bold mx-auto mb-3 text-xl">
              2
            </div>
            <p className="text-gray-300">Choose experience level</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-[#39ff14] text-black rounded-full flex items-center justify-center font-bold mx-auto mb-3 text-xl">
              3
            </div>
            <p className="text-gray-300">Define your motivation</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-[#39ff14] text-black rounded-full flex items-center justify-center font-bold mx-auto mb-3 text-xl">
              4
            </div>
            <p className="text-gray-300">Get your custom path</p>
          </div>
        </div>
      </div>
    </div>
  );
}
