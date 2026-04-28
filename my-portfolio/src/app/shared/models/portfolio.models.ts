export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
}

export interface EducationEntry {
  type: 'degree' | 'school';
  title: string;
  place: string;
  period: string;
  detail: string;
  score: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface QuickTemplate {
  label: string;
  subject: string;
  message: string;
}
