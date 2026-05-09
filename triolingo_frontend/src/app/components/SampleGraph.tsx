import { useState } from 'react';

interface Node {
  id: string;
  label: string;
  description: string;
  lessons: string[];
  x: number;
  y: number;
  color: string;
}

interface Edge {
  from: string;
  to: string;
}

const sampleNodes: Node[] = [
  {
    id: 'start',
    label: 'Alphabet',
    description: 'Master Spanish pronunciation',
    lessons: ['Learn letter sounds', 'Practice accent marks', 'Master diphthongs', 'Read out loud'],
    x: 100,
    y: 150,
    color: '#39ff14',
  },
  {
    id: 'greetings',
    label: 'Greetings',
    description: 'Say hello like a local',
    lessons: ['Hola & Adiós', 'Mucho gusto', '¿Cómo estás?', 'Casual responses'],
    x: 250,
    y: 80,
    color: '#e868e8',
  },
  {
    id: 'numbers',
    label: 'Numbers',
    description: 'Count in Spanish',
    lessons: ['Numbers 1-20', 'Count to 100', 'Ordinal numbers', 'Tell time'],
    x: 250,
    y: 220,
    color: '#ffffff',
  },
  {
    id: 'grammar',
    label: 'Basic Grammar',
    description: 'Build sentences',
    lessons: ['Yo, tú, él, ella...', 'Conjugate verbs', 'El & La', 'Plural magic'],
    x: 400,
    y: 100,
    color: '#E8687F',
  },
  {
    id: 'vocab',
    label: 'Daily Vocabulary',
    description: 'Words you\'ll use daily',
    lessons: ['Food & bebidas', 'Mi familia', 'Colors & shapes', 'Weather talk'],
    x: 400,
    y: 200,
    color: '#e4e868',
  },
  {
    id: 'conversation1',
    label: 'Conversations for Traveling',
    description: 'Time to chat!',
    lessons: ['Order at restaurants', 'Shop like a pro'],
    x: 550,
    y: 150,
    color: '#00d5ff',
  },
  {
    id: 'conversation2',
    label: 'Conversations for fun',
    description: 'Time to chat!',
    lessons: ['Social Networking', 'Making weekends plans', 'Chilling with a friend'],
    x: 600,
    y: 280,
    color: '#60ff60',
  },
  {
  id: 'emotions',
  label: 'Emotions',
  description: 'Express how you feel',
  lessons: ['Happy & Sad', 'Angry & Calm', 'Surprised & Scared', 'Describe your mood'],
  x: 700,
  y: 80,
  color: '#ff6b6b',
},
{
  id: 'directions',
  label: 'Getting Around',
  description: 'Navigate like a local',
  lessons: ['Left, right, straight', 'Landmarks & places', 'Ask for help', 'Read a map'],
  x: 700,
  y: 220,
  color: '#ffd93d',
},
{
  id: 'pastTense',
  label: 'Past Tense',
  description: 'Talk about what happened',
  lessons: ['Preterite basics', 'Irregular verbs', 'Telling stories', 'Yesterday vs. before'],
  x: 850,
  y: 150,
  color: '#c77dff',
},
{
  id: 'foodCulture',
  label: 'Food & Culture',
  description: 'Eat and drink like a native',
  lessons: ['Popular dishes', 'Ordering drinks', 'Table manners', 'Regional foods'],
  x: 850,
  y: 300,
  color: '#ff9f43',
},
{
  id: 'slang',
  label: 'Slang & Idioms',
  description: 'Sound naturally fluent',
  lessons: ['Common slang words', 'Regional expressions', 'Filler words', 'Text speak'],
  x: 1000,
  y: 150,
  color: '#00d2ff',
}
];

const sampleEdges: Edge[] = [
  { from: 'start', to: 'greetings' },
  { from: 'start', to: 'numbers' },
  { from: 'greetings', to: 'grammar' },
  { from: 'numbers', to: 'vocab' },
  { from: 'grammar', to: 'conversation1' },
  { from: 'vocab', to: 'conversation1' },
  { from: 'vocab', to: 'greetings'},
  { from: 'vocab', to: 'conversation2'},
  { from: 'conversation1', to: 'conversation2'},
  { from: 'conversation2', to: 'slang'},
  { from: 'conversation1', to: 'directions'},
  { from: 'grammar', to: 'pastTense'},
  { from: 'greetings', to: 'emotions'},
  { from: 'numbers', to: 'emotions'},
  { from: 'slang', to: 'foodCulture'},
  
  
  
];

export function SampleGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[400px] bg-black border border-gray-800 rounded-lg overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <marker
            id="arrow-sample"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#39ff14" opacity="0.4" />
          </marker>
        </defs>

        {sampleEdges.map((edge, idx) => {
          const fromNode = sampleNodes.find((n) => n.id === edge.from);
          const toNode = sampleNodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={idx}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#39ff14"
              strokeWidth="2"
              opacity="0.3"
              markerEnd="url(#arrow-sample)"
            />
          );
        })}
      </svg>

      <div className="absolute inset-0">
        {sampleNodes.map((node) => {
          const isHovered = hoveredNode === node.id;

          return (
            <div
              key={node.id}
              className="absolute transition-all duration-300 ease-out"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: isHovered ? 50 : 10,
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {isHovered ? (
                <div
                  className="bg-black border-2 rounded-lg p-4 shadow-xl min-w-[200px]"
                  style={{ borderColor: node.color }}
                >
                  <h3 className="text-white mb-1">{node.label}</h3>
                  <p className="text-gray-400 text-sm mb-3">{node.description}</p>
                  <div className="space-y-1">
                    {node.lessons.map((lesson, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-300 flex items-center gap-2"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: node.color }}
                        ></div>
                        {lesson}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-110 animate-pulse"
                  style={{
                    borderColor: node.color,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    boxShadow: `0 0 20px ${node.color}40`,
                    animationDuration: '3s',
                  }}
                >
                  <div
                    className="w-full h-full rounded-full opacity-20"
                    style={{ backgroundColor: node.color }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        Hover over nodes to explore lessons
      </div>
    </div>
  );
}
