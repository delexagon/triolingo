import { BookOpen, Headphones, Video, FileText, ExternalLink } from 'lucide-react';

export function ResourcesPage() {
  const resources = [
    {
      category: 'Books',
      icon: BookOpen,
      items: [
        { name: 'Practice Makes Perfect: Spanish Verb Tenses', type: 'Grammar' },
        { name: 'Easy Spanish Step-by-Step', type: 'Comprehensive' },
        { name: 'Spanish Short Stories for Beginners', type: 'Reading' },
      ],
    },
    {
      category: 'Podcasts',
      icon: Headphones,
      items: [
        { name: 'Coffee Break Spanish', type: 'Learning' },
        { name: 'Notes in Spanish', type: 'Conversation' },
        { name: 'SpanishPod101', type: 'Lessons' },
      ],
    },
    {
      category: 'Videos',
      icon: Video,
      items: [
        { name: 'Butterfly Spanish', type: 'YouTube' },
        { name: 'Dreaming Spanish', type: 'Comprehensible Input' },
        { name: 'Easy Spanish', type: 'Street Interviews' },
      ],
    },
    {
      category: 'Practice',
      icon: FileText,
      items: [
        { name: 'Conversation Exchange', type: 'Language Partners' },
        { name: 'HelloTalk', type: 'Mobile App' },
        { name: 'Tandem', type: 'Language Exchange' },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Learning Resources</h1>
        <p className="text-gray-400">Curated materials to support your journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.category}
              className="border border-gray-800 rounded-lg bg-gray-900/30 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#39ff14] rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-black" />
                </div>
                <h2>{category.category}</h2>
              </div>

              <div className="space-y-3">
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors cursor-pointer group"
                  >
                    <div>
                      <p className="font-medium group-hover:text-[#39ff14] transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">{item.type}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-[#39ff14] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 border border-gray-800 rounded-lg bg-gray-900/30 p-8 text-center">
        <h2 className="mb-3">Need More Resources?</h2>
        <p className="text-gray-400 mb-6">
          We continuously update our library with the best Spanish learning materials
        </p>
        <button className="bg-[#39ff14] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#2ee010] transition-colors">
          Suggest a Resource
        </button>
      </div>
    </div>
  );
}
