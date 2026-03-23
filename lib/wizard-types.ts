// ============================================================================
// Wizard YAML Types — matches the structure in wizard_questions/*.yaml
// ============================================================================

export type WizardMode = "quick" | "hybrid" | "full";
export type QuestionMode = "always" | "configurable";

export type QuestionType =
  | "text_short"
  | "text_long"
  | "single_choice"
  | "tag_input"
  | "mode_selector"
  | "info"
  | "style_picker"
  | "colour_palette"
  | "place_input"
  | "name_list"
  | "card_editor"
  | "property_grid"
  | "category_name_editor"
  | "question_editor";

export interface QuestionOption {
  label: string;
  value: string;
  sublabel?: string;
  description?: string;
  next?: string;
}

export interface GridColumn {
  field: string;
  label: string;
  editable: boolean;
  source?: string;
}

export interface Question {
  id: string;
  mode: QuestionMode;
  type: QuestionType;
  text: string;
  sublabel?: string;
  hint?: string;
  placeholder?: string;
  placeholder_name?: string;
  placeholder_note?: string;
  required: boolean;
  options?: QuestionOption[];
  next?: string | Record<string, string>;
  maps_to: string | null;
  generatable?: boolean;
  generate_prompt?: string;

  // Type-specific fields
  show_other_input_if?: string;
  default?: string;
  min_items?: number;
  max_items?: number;
  max_selections?: number;
  show_hex_input?: boolean;
  allow_freeform?: boolean;
  freeform_label?: string;
  freeform_placeholder?: string;
  count?: number;
  columns?: GridColumn[];
  pre_fill_from?: string;
  pre_fill_strategy?: string;
  generated_from?: string;
  hints?: string[];
  sublabel_digital?: string;
  sublabel_physical?: string;
  skip_warning?: boolean;
}

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  mode?: QuestionMode;
  questions: Question[];
}

export interface PreviewConfig {
  title: string;
  description: string;
  shows: (string | Record<string, number>)[];
  cta_label: string;
  edit_link: boolean;
}

export interface WizardConfig {
  wizard: {
    archetype: string;
    archetype_version: string;
    generate_remaining_enabled: boolean;
    preview_before_payment: boolean;
    estimated_time_quick: string;
    estimated_time_hybrid: string;
    estimated_time_full: string;
  };
  sections: Section[];
  preview: PreviewConfig;
}

// ============================================================================
// Runtime state types
// ============================================================================

export type Edition = "digital" | "physical";

export interface WizardState {
  edition: Edition;
  mode: WizardMode;
  currentSectionIndex: number;
  currentQuestionId: string | null;
  answers: Record<string, unknown>;
  isPreview: boolean;
  isComplete: boolean;
  returnToSummary?: boolean;
  editSectionId?: string;
}

export interface PlaceEntry {
  name: string;
  note?: string;
}

export interface CardEntry {
  id: string;
  text: string;
  effect?: string;
}

export interface TriviaQuestion {
  id: string;
  category: string;
  text: string;
  options: string[];
  correct_answer: number;
  difficulty: string;
  fun_fact?: string;
}
