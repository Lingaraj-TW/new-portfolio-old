import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function Home() {
  return (
    <Layout title="Home" description="Linga Raj M — Technical Writer">
      <header className={clsx('hero', styles.hero)}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <h1>✍️ Linga Raj M — Senior Associate, Technical Writer</h1>
              <p className="hero__subtitle">7+ Years of Driving User Documentation Excellence. Building scalable Docs-as-Code workflows for APIs, Cloud Services and Enterprise Software.</p>
              <p className="meta">Location: Chennai, India | Open to Remote Roles</p>
              <p>
                <a className="button button--primary" href="mailto:lingaraj501@gmail.com?subject=Opportunity">Say hello</a>
                <Link className="button button--secondary" to="/docs/intro" style={{marginLeft:12}}>View portfolio</Link>
              </p>
            </div>

            <div className={styles.heroStats}>
              <img src="/img/headshot.jpg" alt="Headshot" className={styles.headshot} />
              <ul className={styles.stats}>
                <li><strong>7+</strong> Years</li>
                <li><strong>40+</strong> Projects</li>
                <li>Docs-as-Code, OpenAPI, Redocly</li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="container padding--lg">
          <h2>About</h2>
          <p>I specialize in building scalable, user-centric documentation ecosystems for complex technical products. My focus is improving developer experience, discoverability and reducing support burden.</p>
        </section>

        <section className="container padding--lg">
          <h2>Core Proficiencies & Toolkit</h2>
          <ul>
            <li>Information Architecture, Diátaxis, Content Strategy</li>
            <li>OpenAPI/Swagger, Redocly, Vale, Markdown, Git</li>
            <li>Static Site Generators: Docusaurus, Hugo; CI/CD with GitHub Actions</li>
          </ul>
        </section>
      </main>
    </Layout>
  );
}
