import headshot from "../assets/hsr_headshot_blue_bg.png";

function Home() {
  return (
    <section className="section page-section home-page">
        <section className="home-hero">

          <div className="hero-content">

            <p className="eyebrow">
              Independent Software Engineer
            </p>

            <h1>
              Keeping Your Business Software Running
            </h1>

            <h2>
              Practical Solutions for Existing Business Systems
            </h2>

            <p className="hero-text">
              I help businesses repair, improve, and modernize the software they
              already depend on. Whether you need a website repaired, a database
              optimized, a mobile application maintained, or a legacy system
              modernized, I provide practical solutions that keep your business
              running.
            </p>

            <div className="hero-buttons">

              <a
                href="mailto:homer4sm@gmail.com"
                className="primary-button"
              >
                Let's Discuss Your Project
              </a>

              <a
                href="/resume.pdf"
                className="secondary-button"
              >
                View Resume
              </a>

            </div>

          </div>

          <div className="hero-image">
            <div className="hero-profile-card">

              <div className="profile-banner"></div>

              <img
                src={headshot}
                alt="Homer Reynolds"
                className="profile-photo"
              />

              <div className="profile-info">

                <h3>Homer Reynolds</h3>

                <p>Independent Software Engineer</p>

                <span>
                  Software Repair • Legacy Support • Automation
                </span>

              </div>

            </div>
          </div>

        </section>

        <section className="trust-bar">

          <div>
            <h3>35+</h3>
            <p>Years of Experience</p>
          </div>

          <div>
            <h3>Government</h3>
            <p>Healthcare & Federal Systems</p>
          </div>

          <div>
            <h3>Legacy</h3>
            <p>Modernization Specialist</p>
          </div>

          <div>
            <h3>Independent</h3>
            <p>Freelance Consultant</p>
          </div>

        </section>  

        <section className="intro-section">

            <h2>
                Why Businesses Work With Me
            </h2>

            <p>
                Many businesses don't need another full-time employee—they need an
                experienced software engineer who can quickly understand an existing
                system, solve difficult technical problems, and keep critical software
                running.
            </p>

        </section>    
      </section>
  );
}

export default Home;