import { createElement, useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react';

const experiences = [
  {
    title: 'Software Developer',
    date: 'May 2026 — Sep 2026',
    points: [
      'Developed and maintained education-focused ERP applications across frontend and backend components.',
      'Built responsive React interfaces and REST services with Node.js and Express; worked with PostgreSQL for application data.',
      'Developed features for cross-platform React Native applications and maintained multiple school websites.',
      'Supported deployment and cloud configuration across GCP, Microsoft Azure, Hetzner, and Cloudflare.',
      'Investigated production issues, debugged application problems, and collaborated with developers, testers, and stakeholders.',
    ],
  },
  {
    title: 'Software Developer Trainee',
    date: 'May 2025 — Apr 2026',
    points: [
      'Built practical experience with React.js, Node.js, Express.js, PostgreSQL, and REST APIs.',
      'Assisted with education-sector web applications, frontend components, API integration, database operations, and testing.',
      'Contributed to React Native application features and supported cloud deployment across GCP, Azure, and Hetzner.',
      'Learned software workflows, version control, debugging, and production support in a product-focused team.',
    ],
  },
];

const projects = [
  {
    name: 'Education ERP Platform',
    desc: 'An ERP-based software platform for educational institutions, supporting administrative and academic workflows. Contributed across React frontend features, Node.js and Express functionality, PostgreSQL data operations, REST API integration, and cloud configuration.',
    tags: ['React.js', 'Node.js', 'PostgreSQL', 'GCP', 'Azure', 'Hetzner'],
  },
  {
    name: 'School Websites',
    desc: 'Developed and maintained responsive websites for educational institutions, using reusable frontend components and dynamic content or APIs where required. Work also included debugging, deployment, and maintenance.',
    tags: ['React.js', 'JavaScript', 'HTML', 'CSS', 'Responsive UI'],
  },
  {
    name: 'Cross-Platform Mobile Application',
    desc: 'Developed React Native features and screens for Android and iOS applications, integrating backend APIs and contributing to user workflows, connectivity, authentication-related issues, UI improvements, and builds.',
    tags: ['React Native', 'JavaScript', 'REST APIs', 'Android', 'iOS'],
  },
];

const skillGroups = [
  { label: 'Frontend', items: 'React.js · JavaScript · HTML5 · CSS3 · Responsive web' },
  { label: 'Backend', items: 'Node.js · Express.js · REST APIs' },
  { label: 'Mobile', items: 'React Native · Cross-platform development' },
  { label: 'Data', items: 'PostgreSQL · SQL · Database operations' },
  { label: 'Cloud', items: 'Google Cloud Platform · Microsoft Azure · Hetzner' },
  { label: 'Deployment', items: 'Cloud deployment · Server configuration · Cloudflare · DNS' },
  { label: 'Tools', items: 'Git · GitHub · GitLab · Visual Studio Code' },
  { label: 'Ways of working', items: 'Problem solving · Teamwork · Communication · Ownership' },
];

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    items.forEach((item) => observer.observe(item));
    let frame = 0;
    const portrait = document.querySelector<HTMLElement>('.portrait');
    const onScroll = () => {
      if (!portrait || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const offset = Math.min(window.scrollY * 0.08, 58);
        portrait.style.transform = `translate3d(0, ${5 + offset}px, 0)`;
      });
    };
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}

function MouseStudy() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hasModel, setHasModel] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/mouse.glb', { method: 'HEAD' }).then((response) => setHasModel(response.ok)).catch(() => setHasModel(false));
  }, []);

  useEffect(() => {
    if (!hasModel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const stage = stageRef.current;
    const viewer = stage?.querySelector<HTMLElement>('model-viewer');
    if (!stage || !viewer) return;

    let frame = 0;
    const updateFromScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const bounds = stage.getBoundingClientRect();
        const progress = Math.min(
          1,
          Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)),
        );
        const yaw = -30 + progress * 250;
        const pitch = 58 + Math.sin(progress * Math.PI * 2) * 7;

        viewer.setAttribute('camera-orbit', `${yaw.toFixed(1)}deg ${pitch.toFixed(1)}deg auto`);
        stage.style.setProperty('--mouse-parallax-y', `${((progress - 0.5) * -34).toFixed(1)}px`);
      });
    };

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    updateFromScroll();

    return () => {
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [hasModel]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientY - bounds.top) / bounds.height - 0.5) * -18;
    const y = ((event.clientX - bounds.left) / bounds.width - 0.5) * 22;
    setTilt({ x, y });

    const stage = stageRef.current;
    const viewer = stage?.querySelector<HTMLElement>('model-viewer');
    if (viewer && stage) {
      const stageBounds = stage.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - stageBounds.top) / (window.innerHeight + stageBounds.height)),
      );
      const yaw = -30 + progress * 250 + y;
      const pitch = 58 + Math.sin(progress * Math.PI * 2) * 7 + x;
      viewer.setAttribute('camera-orbit', `${yaw.toFixed(1)}deg ${pitch.toFixed(1)}deg auto`);
    }
  };

  return (
    <div
      className="mouse-area"
      onPointerMove={move}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      aria-label="Interactive computer mouse study"
    >
      <span className="mouse-label mono">A small study in interaction</span>
      <div className="mouse-stage" ref={stageRef}>
        {hasModel && (
          <img
            className={`mouse-poster ${modelReady ? 'is-hidden' : ''}`}
            src="/mouse-poster.png"
            alt=""
            aria-hidden="true"
          />
        )}
        {hasModel ? createElement('model-viewer', {
          src: '/mouse.glb',
          poster: '/mouse-poster.png',
          alt: 'A low-poly computer mouse, responsive to pointer movement',
          'camera-controls': true,
          'shadow-intensity': '0.7',
          exposure: '0.9',
          'aria-label': 'Interactive 3D computer mouse',
          onLoad: () => setModelReady(true),
          onError: () => setHasModel(false),
        }) : (
          <div
            className="mouse-fallback"
            style={{ transform: `rotateX(${57 + tilt.x}deg) rotateZ(${-30 + tilt.y}deg)` }}
            aria-hidden="true"
          />
        )}
      </div>
      <span className="mono" style={{ position: 'absolute', bottom: 18, right: 22, fontSize: 8, color: '#858680' }}>
        {hasModel ? 'Scroll to explore · drag to turn' : 'Move your pointer'}
      </span>
    </div>
  );
}

function App() {
  useReveal();
  return (
    <>
      <div className="page-grain" aria-hidden="true" />
      <header className="topbar">
        <nav className="nav-inner" aria-label="Main navigation">
          <a href="#home" className="brand">SREEJITH S<span style={{ color: '#8d8e88' }}>.</span></a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="availability"><span className="status-dot" />Kerala, India</div>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="shell hero-grid">
            <div className="hero-content">
              <div className="eyebrow mono reveal">Software developer · Kerala, India</div>
              <h1 className="display reveal delay-1"><span>Sreejith</span><span><em>S.</em></span></h1>
              <p className="hero-copy reveal delay-2">
                I build thoughtful web and mobile experiences for education — from the interface to the APIs, data, and deployment behind it.
              </p>
              <div className="hero-actions reveal delay-3">
                <a className="pill-link" href="#projects">Explore my work <ArrowDown size={14} strokeWidth={1.5} /></a>
                <a className="text-link" href="#contact">Get in touch <ArrowUpRight size={12} style={{ marginLeft: 4 }} /></a>
              </div>
            </div>
            <div className="portrait-wrap" aria-label="Portrait of Sreejith S">
              <div className="portrait-halo" />
              <img className="portrait" src="/sreejith.png" alt="Sreejith S" fetchPriority="high" />
              <span className="portrait-caption mono">Building for people, one detail at a time</span>
            </div>
          </div>
          <div className="hero-index mono">
            <span>Portfolio / 2026</span>
            <span className="scroll-cue">Scroll to explore <span className="scroll-line" /></span>
            <span>01 — 06</span>
          </div>
        </section>

        <section className="section intro" id="about">
          <div className="shell">
            <div className="section-head reveal">
              <div><div className="section-kicker mono">01 / A little about me</div><h2 className="section-title display">Purpose in<br />the details.</h2></div>
              <p className="section-note">A hands-on developer working across the product lifecycle — and happiest where thoughtful engineering meets a real human need.</p>
            </div>
            <div className="intro-grid">
              <p className="intro-statement display reveal">
                Technology should make everyday work feel <em>clearer, calmer, and more capable.</em>
              </p>
              <div className="reveal delay-1">
                <p className="intro-detail">
                  I have 1.5 years of professional experience building full-stack web and mobile applications. My work has focused on ERP software and digital tools for educational institutions — shaping interfaces, integrating APIs, working with data, and helping applications reach production.
                </p>
                <p className="intro-detail">
                  I enjoy moving between frontend and backend, learning the shape of a problem, and working closely with a team to make a reliable solution.
                </p>
                <div className="facts">
                  <div><div className="fact-label mono">Based in</div><div className="fact-value">Kerala, India</div></div>
                  <div><div className="fact-label mono">Focus</div><div className="fact-value">Web · Mobile · Cloud</div></div>
                  <div><div className="fact-label mono">Experience</div><div className="fact-value">1.5 years</div></div>
                  <div><div className="fact-label mono">Languages</div><div className="fact-value">English · Hindi · Malayalam · Tamil</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section work" id="experience">
          <div className="shell">
            <div className="section-head reveal">
              <div><div className="section-kicker mono">02 / Experience</div><h2 className="section-title display">The work<br />behind it.</h2></div>
              <p className="section-note">Growing through real product work in the education technology space, from trainee foundations to software development.</p>
            </div>
            <div className="timeline">
              {experiences.map((role, index) => (
                <article className={`role reveal ${index ? 'delay-1' : ''}`} key={role.title}>
                  <div className="role-date mono">{role.date}<br />Kerala, India</div>
                  <div>
                    <h3>{role.title}</h3><div className="role-company">Aionpixel Technologies</div>
                    <ul>{role.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  </div>
                  <div className="role-location mono">0{index + 1} / 02</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section projects" id="projects">
          <div className="shell">
            <div className="section-head reveal">
              <div><div className="section-kicker mono">03 / Selected work</div><h2 className="section-title display">Built to<br />be useful.</h2></div>
              <p className="section-note">A selection of the product areas I have contributed to. Described by the work itself, without borrowed outcomes.</p>
            </div>
            <div className="project-list">
              {projects.map((project, index) => (
                <article className={`project reveal ${index === 1 ? 'delay-1' : ''}`} key={project.name}>
                  <div className="project-index">0{index + 1}</div>
                  <div><h3 className="display">{project.name}</h3><p className="project-desc">{project.desc}</p><div className="tags">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>
                  <span className="project-mark" aria-hidden="true"><MoveUpRight size={14} strokeWidth={1.3} /></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="skills">
          <div className="shell">
            <div className="section-head reveal">
              <div><div className="section-kicker mono">04 / Toolkit</div><h2 className="section-title display">A broad<br />foundation.</h2></div>
              <p className="section-note">Comfortable working across the stack, with a practical understanding of how code moves from development to production.</p>
            </div>
            <div className="skills-grid reveal">
              {skillGroups.map((group) => <div className="skill-group" key={group.label}><h3>{group.label}</h3><p>{group.items}</p></div>)}
            </div>
            <div className="skills-bottom reveal">
              <div className="mono" style={{ color: '#777872', fontSize: 10 }}>Beyond the stack</div>
              <p>Leadership and task coordination, clear technical communication, teamwork, debugging, analytical thinking, and the patience to troubleshoot the difficult edge cases.</p>
            </div>
          </div>
        </section>

        <section className="section education" id="education">
          <div className="shell">
            <div className="section-head reveal">
              <div><div className="section-kicker mono">05 / Education & curiosity</div><h2 className="section-title display">Learning<br />by doing.</h2></div>
              <p className="section-note">A computer science foundation, strengthened by hands-on experience across web, mobile, backend, databases, and cloud.</p>
            </div>
            <div className="edu-grid">
              <div className="edu-list reveal">
                <article className="edu-item"><div><h3>Bachelor of Technology, Computer Science</h3><p>Toms College of Engineering and Polytechnic</p></div><div className="edu-meta">2021 — 2025<br />CGPA 7.4 / 10</div></article>
                <article className="edu-item"><div><h3>Higher Secondary Education (12th)</h3><p>N.G.P.M.H.S.S Venchempu</p></div><div className="edu-meta">2019 — 2021<br />86%</div></article>
                <article className="edu-item"><div><h3>Secondary School Education (10th)</h3><p>N.G.P.M.H.S.S Venchempu</p></div><div className="edu-meta">2019<br />98%</div></article>
              </div>
              <div className="reveal delay-1"><MouseStudy /></div>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="shell">
            <div className="section-kicker mono reveal">06 / Start a conversation</div>
            <h2 className="contact-title display reveal delay-1">Good work<br /><em>starts here.</em></h2>
            <div className="contact-grid reveal delay-2">
              <div>
                <div className="section-kicker mono" style={{ marginBottom: 15 }}>Email</div>
                <a className="contact-email" href="mailto:sreejiths0009@gmail.com">sreejiths0009@gmail.com <ArrowUpRight size={18} strokeWidth={1.2} /></a>
              </div>
              <div className="contact-meta">
                <a href="tel:+917902862337">+91 7902862337</a>
                <span>Kerala, India</span>
                <span className="social-links">
                  <a href="https://www.linkedin.com/in/sreejith-s-943120239" target="_blank" rel="noreferrer">LinkedIn</a>
                  <a href="https://github.com/sreejithsajai01" target="_blank" rel="noreferrer">GitHub</a>
                </span>
              </div>
            </div>
            <footer className="footer">
              <span>Sreejith S · Software Developer</span>
              <span>Made with care, in Kerala</span>
              <a href="#home">Back to top ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
