import { BookOpen, Headphones, Video, FileText, ExternalLink } from 'lucide-react';

export function ResourcesPage() {
  const resources = [
    {
      category: 'Books',
      icon: BookOpen,
      items: [
        { name: 'Practice Makes Perfect: Spanish Verb Tenses', type: 'Grammar', link: 'https://www.amazon.com/Practice-Makes-Perfect-Spanish-Tenses/dp/0071639306' },
        { name: 'Easy Spanish Step-by-Step', type: 'Comprehensive', link: 'https://www.amazon.com/Easy-Spanish-Step-Step/dp/0071463380' },
        { name: 'Spanish Short Stories for Beginners', type: 'Reading', link: 'https://www.amazon.com/Spanish-Short-Stories-Beginners-Improve/dp/1721084185' },
      ],
    },
    {
      category: 'Podcasts',
      icon: Headphones,
      items: [
        { name: 'Immersive Spanish', type: 'Learning', link: 'https://open.spotify.com/show/6LRjQWo23lxCgtpP0Ett57?si=30560436da9544a4' },
        { name: 'Spanish for Beginners', type: 'Conversation', link: 'https://open.spotify.com/show/6cMQaESpHzk7APjxmOVtCN?si=b444449a0e054b7e' },
        { name: 'Dreaming Spanish', type: 'Lessons', link: 'https://open.spotify.com/show/5up150GvfRWVlNHNCLqtyW?si=daef9f4bf7974e8f' },
      ],
    },
    {
      category: 'Videos',
      icon: Video,
      items: [
        { name: 'Butterfly Spanish', type: 'YouTube', link: 'https://www.youtube.com/@ButterflySpanish' },
        { name: 'Dreaming Spanish', type: 'Comprehensible Input', link: 'https://www.youtube.com/@DreamingSpanish' },
        { name: 'Easy Spanish', type: 'Street Interviews', link: 'https://www.youtube.com/@EasySpanish' },
      ],
    },
    {
      category: 'Practice',
      icon: FileText,
      items: [
        { name: 'Conversation Exchange', type: 'Language Partners', link: 'https://www.conversationexchange.com' },
        { name: 'HelloTalk', type: 'Mobile App', link: 'https://www.hellotalk.com' },
        { name: 'Tandem', type: 'Language Exchange', link: 'https://www.tandem.net' },
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
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors cursor-pointer group no-underline"
                  >
                    <div>
                      <p className="font-medium group-hover:text-[#39ff14] transition-colors text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">{item.type}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-[#39ff14] transition-colors flex-shrink-0" />
                  </a>
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
