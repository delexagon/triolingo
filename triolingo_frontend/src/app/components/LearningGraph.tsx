import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface LearningGraphProps {
  config: {
    timeLimit: string;
    experienceLevel: string;
    motivation: string;
  };
}

interface Node {
  id: string;
  label: string;
  description: string;
  level: number;
  position: number;
  color: string;
}

interface Edge {
  from: string;
  to: string;
}

export function LearningGraph({ config }: LearningGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => {
    return generateLearningPath(config);
  }, [config]);

  return (
    <div className="border border-gray-800 rounded-lg bg-gray-900/30 p-8">
      <div className="mb-6">
        <h2 className="mb-2">Your Personalized Learning Path</h2>
        <p className="text-gray-400">
          Optimized for {getTimeLabel(config.timeLimit)} • {getMotivationLabel(config.motivation)}
        </p>
      </div>

      <div className="relative bg-black rounded-lg border border-gray-800">
        <svg className="w-full" height="800" style={{ minHeight: '800px' }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#39ff14" />
            </marker>
          </defs>

          {edges.map((edge, idx) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.level * 250 + 100;
            const y1 = fromNode.position * 120 + 60;
            const x2 = toNode.level * 250 + 100;
            const y2 = toNode.position * 120 + 60;

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#39ff14"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                opacity="0.3"
              />
            );
          })}
        </svg>

        <div className="absolute bottom-4 left-4 text-xs text-gray-500">
          Hover over nodes to see details
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            const x = node.level * 250 + 100;
            const y = node.position * 120 + 60;

            return (
              <div
                key={node.id}
                className="absolute pointer-events-auto transition-all duration-300 ease-out"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isHovered ? 50 : 10,
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {isHovered ? (
                  <div
                    className="bg-black border-2 rounded-lg p-4 shadow-xl min-w-[180px]"
                    style={{ borderColor: node.color }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: node.color }} />
                      <h3 className="font-medium text-sm leading-tight text-white">{node.label}</h3>
                    </div>
                    <p className="text-xs text-gray-400">{node.description}</p>
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
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800">
        <h3 className="font-medium mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#39ff14' }}></div>
            <span className="text-sm text-gray-400">Foundation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white"></div>
            <span className="text-sm text-gray-400">Core Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2ee010' }}></div>
            <span className="text-sm text-gray-400">Advanced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#60ff60' }}></div>
            <span className="text-sm text-gray-400">Specialized</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateLearningPath(config: {
  timeLimit: string;
  experienceLevel: string;
  motivation: string;
}): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const isIntensive = config.timeLimit === '3months';
  const skipBasics = ['intermediate', 'upper-intermediate'].includes(config.experienceLevel);

  if (!skipBasics) {
    nodes.push({
      id: 'alphabet',
      label: 'Alphabet & Pronunciation',
      description: 'Master Spanish sounds and letters',
      level: 0,
      position: 0,
      color: '#39ff14',
    });

    nodes.push({
      id: 'basic-grammar',
      label: 'Basic Grammar',
      description: 'Present tense, articles, gender',
      level: 0,
      position: 1,
      color: '#39ff14',
    });

    edges.push({ from: 'alphabet', to: 'basic-grammar' });
  }

  const startNode = skipBasics ? null : 'basic-grammar';

  nodes.push({
    id: 'vocabulary-foundation',
    label: 'Essential Vocabulary',
    description: 'Common words and phrases',
    level: skipBasics ? 0 : 1,
    position: 0,
    color: '#ffffff',
  });

  if (startNode) {
    edges.push({ from: startNode, to: 'vocabulary-foundation' });
  }

  const motivationSpecific = getMotivationModule(config.motivation);
  nodes.push({
    id: 'motivation-module',
    label: motivationSpecific.label,
    description: motivationSpecific.description,
    level: skipBasics ? 0 : 1,
    position: 1,
    color: '#ffffff',
  });

  if (startNode) {
    edges.push({ from: startNode, to: 'motivation-module' });
  }

  nodes.push({
    id: 'conversation',
    label: 'Conversational Practice',
    description: 'Speaking and listening skills',
    level: skipBasics ? 1 : 2,
    position: 0,
    color: '#2ee010',
  });

  edges.push({ from: 'vocabulary-foundation', to: 'conversation' });
  edges.push({ from: 'motivation-module', to: 'conversation' });

  nodes.push({
    id: 'grammar-advanced',
    label: 'Advanced Grammar',
    description: 'Past tenses, subjunctive mood',
    level: skipBasics ? 1 : 2,
    position: 1,
    color: '#2ee010',
  });

  edges.push({ from: 'vocabulary-foundation', to: 'grammar-advanced' });

  if (!isIntensive) {
    nodes.push({
      id: 'culture',
      label: 'Cultural Immersion',
      description: 'Customs, media, and traditions',
      level: skipBasics ? 1 : 2,
      position: 2,
      color: '#2ee010',
    });

    edges.push({ from: 'motivation-module', to: 'culture' });
  }

  nodes.push({
    id: 'fluency',
    label: 'Fluency Building',
    description: 'Complex conversations',
    level: skipBasics ? 2 : 3,
    position: 0,
    color: '#60ff60',
  });

  edges.push({ from: 'conversation', to: 'fluency' });
  edges.push({ from: 'grammar-advanced', to: 'fluency' });

  const specialization = getSpecializationModule(config.motivation);
  nodes.push({
    id: 'specialization',
    label: specialization.label,
    description: specialization.description,
    level: skipBasics ? 2 : 3,
    position: 1,
    color: '#60ff60',
  });

  edges.push({ from: 'conversation', to: 'specialization' });
  edges.push({ from: 'motivation-module', to: 'specialization' });

  if (!isIntensive) {
    nodes.push({
      id: 'mastery',
      label: 'Native-Level Mastery',
      description: 'Idioms, nuance, regional dialects',
      level: skipBasics ? 3 : 4,
      position: 0,
      color: '#39ff14',
    });

    edges.push({ from: 'fluency', to: 'mastery' });
    edges.push({ from: 'specialization', to: 'mastery' });
  }

  return { nodes, edges };
}

function getMotivationModule(motivation: string) {
  const modules = {
    travel: {
      label: 'Travel Phrases',
      description: 'Hotels, restaurants, directions',
    },
    work: {
      label: 'Business Spanish',
      description: 'Professional vocabulary and emails',
    },
    academic: {
      label: 'Academic Spanish',
      description: 'Research, presentations, writing',
    },
    cultural: {
      label: 'Cultural Context',
      description: 'Literature, art, history',
    },
    family: {
      label: 'Daily Conversations',
      description: 'Family topics and casual talk',
    },
    immigration: {
      label: 'Practical Living',
      description: 'Government, healthcare, shopping',
    },
  };

  return modules[motivation as keyof typeof modules] || modules.travel;
}

function getSpecializationModule(motivation: string) {
  const modules = {
    travel: {
      label: 'Regional Variations',
      description: 'Latin America vs Spain differences',
    },
    work: {
      label: 'Industry Terminology',
      description: 'Field-specific professional language',
    },
    academic: {
      label: 'Academic Writing',
      description: 'Essays, thesis, formal writing',
    },
    cultural: {
      label: 'Media Consumption',
      description: 'Books, films, podcasts in Spanish',
    },
    family: {
      label: 'Deep Connections',
      description: 'Emotional expressions and nuance',
    },
    immigration: {
      label: 'Civic Integration',
      description: 'Legal, cultural, community topics',
    },
  };

  return modules[motivation as keyof typeof modules] || modules.travel;
}

function getTimeLabel(timeLimit: string): string {
  const labels = {
    '3months': '3-month intensive track',
    '6months': '6-month moderate pace',
    '1year': '1-year comfortable pace',
    '2years': '2-year relaxed pace',
  };
  return labels[timeLimit as keyof typeof labels] || timeLimit;
}

function getMotivationLabel(motivation: string): string {
  const labels = {
    travel: 'Travel & Tourism focus',
    work: 'Professional/Business focus',
    academic: 'Academic Studies focus',
    cultural: 'Cultural Exploration focus',
    family: 'Family & Relationships focus',
    immigration: 'Immigration/Relocation focus',
  };
  return labels[motivation as keyof typeof labels] || motivation;
}
