export interface SkillCategory {
  cat: string
  color: string
  skills: { name: string; pct: number }[]
}

export const skillCategories: SkillCategory[] = [
  {
    cat: '// PROGRAMMING',
    color: '#4488ff',
    skills: [
      { name: 'Java', pct: 88 },
      { name: 'Python', pct: 78 },
      { name: 'HTML/CSS/JS', pct: 82 },
      { name: 'C', pct: 72 },
    ],
  },
  {
    cat: '// BACKEND & FRAMEWORKS',
    color: '#00cc44',
    skills: [
      { name: 'Spring Boot', pct: 86 },
      { name: 'Node.js / Express', pct: 80 },
      { name: 'JPA / Hibernate', pct: 84 },
      { name: 'Jakarta EE / JSP', pct: 80 },
      { name: 'REST APIs', pct: 86 },
    ],
  },
  {
    cat: '// FRONTEND & FULL STACKS',
    color: '#4488ff',
    skills: [
      { name: 'React', pct: 84 },
      { name: 'MERN Stack', pct: 82 },
      { name: 'PERN Stack', pct: 84 },
    ],
  },
  {
    cat: '// DATABASES & TOOLS',
    color: '#ffcc00',
    skills: [
      { name: 'PostgreSQL', pct: 85 },
      { name: 'MySQL / JDBC', pct: 84 },
      { name: 'Git / Maven', pct: 82 },
      { name: 'Docker / Tomcat', pct: 78 },
    ],
  },
  {
    cat: '// AI, ML & PATTERNS',
    color: '#cc88ff',
    skills: [
      { name: 'TensorFlow / CNN', pct: 76 },
      { name: 'Prompt Engineering', pct: 80 },
      { name: 'MVC / DAO / DTO', pct: 84 },
    ],
  },
  {
    cat: '// DESIGN & UX',
    color: '#ff88cc',
    skills: [
      { name: 'Google UX Design', pct: 72 },
      { name: 'Figma (basic)', pct: 62 },
    ],
  },
]

export const radarSkills = [
  { label: 'Backend Dev', pct: 86, color: '#00cc44' },
  { label: 'Database', pct: 85, color: '#00ffff' },
  { label: 'Frontend / React', pct: 84, color: '#4488ff' },
  { label: 'Node.js', pct: 80, color: '#88ff44' },
  { label: 'Architecture', pct: 84, color: '#44ffaa' },
  { label: 'AI / ML', pct: 76, color: '#cc88ff' },
  { label: 'DevOps / Docker', pct: 74, color: '#ffcc00' },
  { label: 'Prompt Eng / AI Tools', pct: 80, color: '#ff88cc' },
]

export const radarStatus = [
  { label: 'JAVA', val: 'EXPERT', on: true },
  { label: 'SPRING', val: 'PROFICIENT', on: true },
  { label: 'REACT', val: 'PROFICIENT', on: true },
  { label: 'NODE', val: 'PROFICIENT', on: true },
  { label: 'MERN/PERN', val: 'ACTIVE', on: true },
  { label: 'AI/ML', val: 'LOADED', on: true },
  { label: 'DEPLOY', val: 'READY', on: false },
]