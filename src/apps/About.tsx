import { WinBody, WinStatusbar, StatusPanel, StatusDot, promptLine } from '../ui/Window'

const tags = [
  ['g', 'Java'], ['g', 'Spring Boot'], ['b', 'Jakarta EE'], ['b', 'JPA/Hibernate'], ['c', 'PostgreSQL'],
  ['a', 'MySQL'], ['c', 'REST APIs'], ['', 'Docker'], ['p', 'TensorFlow'], ['', 'Git/Maven'], ['a', 'Figma'], ['', 'AI Tools'],
]

const ascii = `:::::::::::::::::::::::::::::::-
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::-*#%%=::::::::::::::
::::::::::+%%##%%%%%::::::::::::
::::::::::#%%%##%%%%-::::::::::::
::::::::::+%+##=##*#::::::::::::
:::::::::::*==+*##**::::::::::::
:::::::::::**#**#*#-::::::::::::
:::::::.::::-#%%%#+:::::::::::::
::::::::::...=++**+:::::::::::::
:::::::.....:..=++:::.....::::::
:::::............::........:::::
::::.......................:::::
::::....................:...::::
::::....:..:...:.......:::..::::
::::......:::::.......::=:..::::`;

export default function About() {
  return (
    <>
      <WinBody>
        {promptLine('cat about.txt')}
        <div className="about-layout">
          <pre className="about-ascii">{ascii}</pre>
          <div>
            <div className="about-name">Shreenidhi M</div>
            <div className="about-role">&gt; Java Full Stack Developer · Bengaluru, India</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#ffcc00', marginTop: 4 }}>▶ Open to Full-Time Opportunities</div>
          </div>
        </div>
        <div className="about-bio">
          Computer Science graduate from GITAM University (2025) with hands-on experience in Java, Spring Boot, PostgreSQL, REST APIs, Docker, and Full Stack Development.
          <br />
          <br />
          Built production-style applications across e-commerce (Spring Boot + PostgreSQL + Docker), food delivery (Jakarta EE + MySQL), AI crop detection (TensorFlow + CNN + Raspberry Pi), AI music studio (Folio Instrumenta), and AI travel planning (RoamAI).
          <br />
          <br />
          Strong understanding of OOP, DBMS, Microservices, and Agile development practices. Holds Google UX Design Professional, IBM SQL, and FacePrep C certifications.
        </div>
        <div style={{ marginTop: 10 }}>
          {tags.map(([cls, name]) => (
            <span key={name} className={'tag' + (cls ? ' ' + cls : '')}>{name}</span>
          ))}
        </div>
      </WinBody>
      <WinStatusbar>
        <StatusPanel><StatusDot /> ONLINE</StatusPanel>
        <StatusPanel>📍 Bengaluru</StatusPanel>
        <StatusPanel>🎓 GITAM 2025</StatusPanel>
        <StatusPanel>5 Projects</StatusPanel>
      </WinStatusbar>
    </>
  )
}