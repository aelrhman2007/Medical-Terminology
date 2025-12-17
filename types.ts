export type TermPartType = 'prefix' | 'root' | 'suffix' | 'combining_vowel' | 'combining_form' | 'other';

export interface TermPart {
  text: string;
  type: TermPartType;
  meaning: string;
}

export interface AcademicExplanation {
  definition: string;
  pathophysiology: string;
  clinicalContext: string;
}

export interface UsageExample {
  sentence: string;
  translation: string;
  context: string;
}

export interface MedicalTermResponse {
  englishTerm: string;
  parts: TermPart[];
  arabicTranslation: string;
  translationNote?: string;
  academicExplanation: AcademicExplanation;
  examples: UsageExample[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}