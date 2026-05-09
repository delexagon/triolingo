export interface GraphNode {
  id: string;
  label: string;
  type: string;
  difficulty: number;
  tags: string[];
  status: 'known' | 'weak' | 'unknown';
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AssessmentQuestion {
  id: string;
  node_id: string;
  question: string;
  expected_answer: string;
}

export interface GradeResult {
  status: 'known' | 'weak' | 'unknown';
  feedback: string;
}
