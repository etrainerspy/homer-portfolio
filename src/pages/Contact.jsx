import { useState } from "react";

function Contact() {
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  function validate(data) {
    const newErrors = {};

    const nameRegex = /^[A-Za-z]{1,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^(\d{10}|\d{3}-\d{3}-\d{4})$/;
    const htmlRegex = /<[^>]*>/g;
    const linkRegex = /(https?:\/\/|www\.)/gi;

    if (!nameRegex.test(data.firstName)) {
      newErrors.firstName = "First name must be 1-50 letters only.";
    }

    if (!nameRegex.test(data.lastName)) {
      newErrors.lastName = "Last name must be 1-50 letters only.";
    }

    if (!emailRegex.test(data.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (data.phone && !phoneRegex.test(data.phone)) {
      newErrors.phone = "Use 10 digits or format 555-555-5555.";
    }

    if (data.otherPhone && !phoneRegex.test(data.otherPhone)) {
      newErrors.otherPhone = "Use 10 digits or format 555-555-5555.";
    }

    if (!data.service) {
      newErrors.service = "Please select a service.";
    }

    if (data.message.length < 20 || data.message.length > 2000) {
      newErrors.message = "Message must be 20-2000 characters.";
    }

    if (htmlRegex.test(data.message)) {
      newErrors.message = "HTML tags are not allowed.";
    }

    const linkCount = (data.message.match(linkRegex) || []).length;
    if (linkCount > 2) {
      newErrors.message = "Please include no more than 2 links.";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;

    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      otherPhone: form.otherPhone.value.trim(),
      service: form.service.value,
      message: form.message.value.trim(),
      website: form.website.value.trim(),
    };

    if (data.website) {
      setStatus("Thank you. Your message has been sent.");
      form.reset();
      return;
    }

    const validationErrors = validate(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("Please fix the highlighted fields.");
      return;
    }

    setStatus("Sending...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Message failed");
      }

      setStatus("Thank you. Your message has been sent.");
      setErrors({});
      form.reset();
    } catch {
      setStatus("Sorry, your message could not be sent.");
    }

//    } catch (err) {
//      console.error("Frontend contact error:", err);
//      setStatus("Sorry, your message could not be sent. Check server terminal.");
//    }    
  }

  return (
    <section className="section page-section contact-page">
      <h1>Contact Me</h1>

      <div className="contact-placeholder" />

      <p className="section-intro">
        I am available for short-term freelance projects, troubleshooting,
        software repair, legacy system support, automation, training, and
        independent contractor work.
      </p>

      <p className="section-intro">
        Tell me briefly what problem you need solved. I will review your message
        and respond as soon as possible.
      </p>

      <div className="contact-container">
        <form className="contact-form contact-form-box" onSubmit={handleSubmit} noValidate>
          <div className="form-row two-columns">
            <label>
              First Name
              <input type="text" name="firstName" required maxLength="50" />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </label>

            <label>
              Last Name
              <input type="text" name="lastName" required minLength="2" maxLength="50" />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </label>
          </div>

          <label>
            Email
            <input type="email" name="email" required maxLength="120" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <div className="form-row two-columns">
            <label>
              Phone
              <input type="tel" name="phone" maxLength="12" required placeholder="555-555-5555" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>

            <label>
              Other Phone
              <input type="tel" name="otherPhone" maxLength="12" placeholder="555-555-5555" />
              {errors.otherPhone && <span className="field-error">{errors.otherPhone}</span>}
            </label>
          </div>

          <label>
            What do you need help with?
            <select name="service" required>
              <option value="">Select one</option>
              <option>Software repair</option>
              <option>Website or application problem</option>
              <option>Database or reporting problem</option>
              <option>Legacy system support</option>
              <option>Automation</option>
              <option>Computer training</option>
              <option>Other</option>
            </select>
            {errors.service && <span className="field-error">{errors.service}</span>}
          </label>

          <label>
            Message
            <textarea name="message" required maxLength="2000" rows="7"></textarea>
            {errors.message && <span className="field-error">{errors.message}</span>}
          </label>

          <input
            type="text"
            name="website"
            className="hidden-field"
            tabIndex="-1"
            autoComplete="off"
          />

          <button type="submit" className="primary-button contact-submit">
            Send Message
          </button>

          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </section>
  );
}

export default Contact;