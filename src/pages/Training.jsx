function Training() {
  return (
    <section className="section page-section">
      <h1>Computer Training Courses</h1>

      <p className="section-intro">
        Practical training for individuals, small businesses, and teams who want
        to improve their computer, software, and technical problem-solving skills.
      </p>

    <div className="technology-training">
        <img
            src="/images/technology-training.png"
            alt="Technology Training"
            className="technology-training-image"
        />
    </div>

      <div className="service-grid">
        <div className="service-card">
          <h3>Programming Fundamentals</h3>
          <p>Learn how programming works and how to build confidence solving problems with code.</p>
        </div>

        <div className="service-card">
          <h3>Web Development Training</h3>
          <p>Learn how websites and web applications are built, maintained, and connected to business systems.</p>
        </div>

        <div className="service-card">
          <h3>Database & Reporting Training</h3>
          <p>Learn how to work with data, create useful reports, and understand database structure.</p>
        </div>

        <div className="service-card">
          <h3>Computer & Developer Tools</h3>
          <p>Learn practical computer skills, command-line basics, file management, and troubleshooting.</p>
        </div>
      </div>
    </section>
  );
}

export default Training;