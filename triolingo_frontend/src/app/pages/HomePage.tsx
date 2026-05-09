import { Link } from 'react-router';
import { ArrowRight, Zap, Target, Clock, ScanSearch } from 'lucide-react';
import { SampleGraph } from '../components/SampleGraph';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="mb-2 text-gray-500">Welcome to</div>
        <h1 className="mb-4 text-6xl">
          <span className="text-[#39ff14]">trio</span>lingo
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Your personalized Spanish learning adventure starts here
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/learning-path"
            className="inline-flex items-center gap-2 bg-[#39ff14] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#2ee010] transition-all hover:scale-105"
          >
            Generate Your Path
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-[#39ff14] hover:text-[#39ff14] transition-all"
          >
            <ScanSearch className="w-5 h-5" />
            Test Your Level
          </Link>
        </div>
      </div>

      {/* Sample graph */}
      <div className="mb-16">
        <h2 className="text-center mb-6">Sample Learning Path</h2>
        <SampleGraph />
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-[#39ff14] transition-colors">
          <div className="w-12 h-12 bg-[#39ff14] rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <h3 className="mb-2">Adaptive Learning</h3>
          <p className="text-gray-400">
            Your path evolves with you — skip what you know, focus on what you need
          </p>
        </div>
        <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-[#39ff14] transition-colors">
          <div className="w-12 h-12 bg-[#39ff14] rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-black" />
          </div>
          <h3 className="mb-2">Goal-Oriented</h3>
          <p className="text-gray-400">
            Travel, work, family — your goals shape your journey
          </p>
        </div>
        <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-[#39ff14] transition-colors">
          <div className="w-12 h-12 bg-[#39ff14] rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-black" />
          </div>
          <h3 className="mb-2">Time-Optimized</h3>
          <p className="text-gray-400">
            3-month sprint or 2-year marathon — you choose the pace
          </p>
        </div>
      </div>

      {/* Assessment callout — sits between features and how-it-works */}
      <div className="relative mb-16 border border-gray-800 rounded-xl overflow-hidden">
        {/* Subtle neon glow strip on the left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#39ff14] to-transparent opacity-60" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Text side */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <span className="text-xs font-mono tracking-widest text-[#39ff14] uppercase mb-3">
              Not sure where to start?
            </span>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3 leading-snug">
              Diagnose your level first
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Our AI-powered diagnostic asks you a handful of targeted questions,
              then marks each concept as <span className="text-[#39ff14]">known</span>,{' '}
              <span className="text-amber-400">developing</span>, or{' '}
              <span className="text-red-400">needs work</span> — so your learning
              path starts exactly where you are, not where you think you are.
            </p>
            <Link
              to="/assessment"
              className="self-start inline-flex items-center gap-2 bg-[#39ff14] text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#2ee010] transition-all hover:scale-105"
            >
              <ScanSearch className="w-4 h-4" />
              Start Diagnostic
            </Link>
          </div>

          {/* Visual side */}
          <div className="bg-gray-900/60 border-l border-gray-800 p-8 md:p-10 flex flex-col justify-center gap-4">
            {[
              { label: 'Saying Hello (hola)', status: 'known', pct: 100 },
              { label: 'Present Tense Conjugation', status: 'developing', pct: 55 },
              { label: 'Subjunctive Mood', status: 'needs work', pct: 15 },
            ].map(({ label, status, pct }) => {
              const color =
                status === 'known'
                  ? { bar: 'bg-[#39ff14]', text: 'text-[#39ff14]', track: 'bg-[#39ff14]/10' }
                  : status === 'developing'
                  ? { bar: 'bg-amber-400', text: 'text-amber-400', track: 'bg-amber-400/10' }
                  : { bar: 'bg-red-500', text: 'text-red-400', track: 'bg-red-500/10' };
              return (
                <div key={label}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm text-gray-300">{label}</span>
                    <span className={`text-xs font-mono capitalize ${color.text}`}>{status}</span>
                  </div>
                  <div className={`h-1.5 rounded-full ${color.track}`}>
                    <div
                      className={`h-full rounded-full ${color.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-gray-600 font-mono mt-2">
              ↑ example diagnostic output
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="border border-gray-800 rounded-lg p-12 bg-gray-900/30 text-center">
        <h2 className="mb-4">How triolingo Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          {[
            'Select your timeline',
            'Choose experience level',
            'Define your motivation',
            'Get your custom path',
          ].map((step, i) => (
            <div key={i}>
              <div className="w-12 h-12 bg-[#39ff14] text-black rounded-full flex items-center justify-center font-bold mx-auto mb-3 text-xl">
                {i + 1}
              </div>
              <p className="text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
