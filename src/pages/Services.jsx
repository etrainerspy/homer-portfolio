function Services() {
  return (
    <section className="section page-section">
      <h1>Services</h1>

      <p className="section-intro">
        I help businesses fix, improve, and support the software they already
        depend on — without turning every problem into a large, expensive
        project.
      </p>

    <div className="service-banner">
    <img
        src="/images/technology-services.png"
        alt="Software Consulting Services"
        className="service-banner-image"
    />
    </div>

      <div className="service-grid">
        <div className="service-card">
          <h3>Fix Broken Software</h3>
          <p>
            Websites, forms, reports, scripts, and applications can stop working
            at the worst time. I help diagnose the problem and get the system
            working again.
          </p>
        </div>

        <div className="service-card">
          <h3>Improve Existing Applications</h3>
          <p>
            If your current software is slow, confusing, outdated, or missing
            important features, I can help improve it without starting over.
          </p>
        </div>

        <div className="service-card">
          <h3>Automate Manual Work</h3>
          <p>
            I help replace repetitive spreadsheet, reporting, data entry, and
            file-handling tasks with practical automation that saves time.
          </p>
        </div>

        <div className="service-card">
          <h3>Fix Database & Reporting Problems</h3>
          <p>
            I help clean up data, repair reporting problems, improve slow
            queries, and make business information easier to find and use.
          </p>
        </div>

        <div className="service-card">
          <h3>Support Older Business Systems</h3>
          <p>
            If your business depends on older software that still matters, I can
            help maintain it, understand it, reduce risk, and plan improvements.
          </p>
        </div>

        <div className="service-card">
          <h3>Connect Systems Together</h3>
          <p>
            I help websites, databases, mobile apps, cloud tools, and older
            systems share information and work together more smoothly.
          </p>
        </div>

        <div className="service-card">
          <h3>Mobile App Support</h3>
          <p>
            I can help troubleshoot, maintain, improve, or connect mobile apps
            with websites, databases, and other business systems.
          </p>
        </div>

        <div className="service-card">
          <h3>Short-Term Technical Help</h3>
          <p>
            Need an experienced software engineer for a short project, urgent
            repair, second opinion, or technical cleanup? I can help without a
            long-term commitment.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Services;