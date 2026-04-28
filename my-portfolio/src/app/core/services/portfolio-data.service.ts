import { Injectable } from '@angular/core';
import {
  EducationEntry,
  NavLink,
  Project,
  ServiceItem,
  SkillCategory,
  Stat,
  QuickTemplate,
} from '../../shared/models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  readonly navLinks: NavLink[] = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  readonly stats: Stat[] = [
    { value: '1+', label: 'Year Experience' },
    { value: '5+', label: 'Projects Delivered' },
    { value: '10+', label: 'Tech Skills' },
  ];

  readonly skillCategories: SkillCategory[] = [
    {
      title: 'Frontend',
      skills: [
        { name: 'Angular', icon: 'devicon-angular-plain' },
        { name: 'HTML', icon: 'devicon-html5-plain' },
        { name: 'CSS', icon: 'devicon-css3-plain' },
        { name: 'TypeScript', icon: 'devicon-typescript-plain' },
        { name: 'JavaScript', icon: 'devicon-javascript-plain' },
      ],
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Java', icon: 'devicon-java-plain' },
        { name: 'Spring Boot', icon: 'devicon-spring-plain' },
        { name: 'REST APIs', icon: 'devicon-fastapi-plain' },
      ],
    },
    {
      title: 'Database',
      skills: [{ name: 'MySQL', icon: 'devicon-mysql-plain' }],
    },
    {
      title: 'Tools',
      skills: [
        { name: 'Git', icon: 'devicon-git-plain' },
        { name: 'VS Code', icon: 'devicon-vscode-plain' },
        { name: 'IntelliJ', icon: 'devicon-intellij-plain' },
        { name: 'Postman', icon: 'devicon-postman-plain' },
      ],
    },
    {
      title: 'AI / ML',
      skills: [
        { name: 'Generative AI', icon: 'fa-solid fa-wand-magic-sparkles' },
        { name: 'Prompt Engineering', icon: 'fa-solid fa-comments' },
        { name: 'Agentic AI', icon: 'fa-solid fa-robot' },
        { name: 'Context Engineering', icon: 'fa-solid fa-diagram-project' },
        { name: 'OpenAI / Claude API', icon: 'fa-solid fa-brain' },
        { name: 'Claude Code', icon: 'fa-solid fa-terminal' },
        { name: 'Google Antigravity', icon: 'fa-brands fa-google' },
      ],
    },
  ];

  readonly projects: Project[] = [
    {
      title: 'MediTrust',
      description:
        'A full-stack healthcare management application with patient records, appointment scheduling, and medicine inventory. Features CRUD operations, search functionality, and server-side pagination.',
      tech: ['Spring Boot', 'Angular', 'MySQL', 'REST API'],
      github: 'https://github.com/mirfaizanali/MediTrust',
      live: '#',
    },
    {
      title: 'Library Management System',
      description:
        'A role-based library platform with admin and user dashboards. Admins manage books and members while users browse, search, and request books. Includes JWT authentication and protected routes.',
      tech: ['Spring Boot', 'Angular', 'MySQL', 'JWT Auth'],
      github: '#',
      live: '#',
    },
    {
      title: 'Personal Portfolio',
      description:
        'A modern single-page portfolio built with Angular 20 standalone components. Features dark theme, typing animations, scroll-triggered transitions, and SSR — deployed on Vercel.',
      tech: ['Angular 20', 'TypeScript', 'SCSS', 'Vercel'],
      github: '#',
      live: '#',
    },
  ];

  readonly educationEntries: EducationEntry[] = [
    {
      type: 'degree',
      title: 'B.E. in Computer Science & Engineering',
      place: 'Lords Institute of Engineering & Technology',
      period: '2021 — 2025',
      detail: 'Relevant coursework: Data Structures, Algorithms, DBMS, Operating Systems, Web Technologies.',
      score: 'CGPA: 8.66 / 10',
    },
    {
      type: 'school',
      title: 'Higher Secondary (XII)',
      place: "St Joseph's Junior College",
      period: '2019 — 2021',
      detail: '',
      score: '',
    },
    {
      type: 'school',
      title: 'Secondary (X)',
      place: 'Kakatiya Vidhya Niketan High School',
      period: '2018 — 2019',
      detail: '',
      score: '',
    },
  ];

  readonly serviceItems: ServiceItem[] = [
    {
      icon: 'fa-solid fa-server',
      title: 'Backend Development',
      description:
        'Building robust RESTful APIs and microservices with Java and Spring Boot — designed for scalability, security, and performance.',
    },
    {
      icon: 'fa-solid fa-code',
      title: 'Frontend Development',
      description:
        'Crafting responsive, interactive user interfaces with Angular and TypeScript — focused on clean UX and component-driven architecture.',
    },
    {
      icon: 'fa-solid fa-database',
      title: 'Database Design',
      description:
        'Designing efficient database schemas and writing optimized queries with MySQL — ensuring data integrity and fast retrieval.',
    },
  ];

  readonly quickTemplates: QuickTemplate[] = [
    {
      label: 'Hiring Inquiry',
      subject: 'Job Opportunity',
      message:
        "Hi Faizan,\n\nI came across your portfolio and I'm impressed by your work. We have an exciting role that I think would be a great fit for your skills. I'd love to discuss this opportunity with you.\n\nLooking forward to connecting!",
    },
    {
      label: 'Freelance Project',
      subject: 'Freelance Project Inquiry',
      message:
        "Hi Faizan,\n\nI have a project that I believe aligns well with your expertise. I'd like to discuss the scope, timeline, and how we can work together to bring it to life.\n\nPlease let me know your availability for a quick chat.",
    },
    {
      label: 'Collaboration',
      subject: 'Collaboration Proposal',
      message:
        "Hi Faizan,\n\nI'm working on something interesting and I think your skills would complement the project perfectly. I'd love to explore the possibility of collaborating together.\n\nWould you be open to a conversation?",
    },
    {
      label: 'Just Saying Hi',
      subject: 'Hello!',
      message:
        "Hi Faizan,\n\nI really enjoyed browsing your portfolio — great work! Just wanted to reach out and say hello.\n\nKeep up the awesome work!",
    },
  ];
}
