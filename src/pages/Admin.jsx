import { useState } from "react";

function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem("adminToken") || "");
  const [search, setSearch] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");

  async function loadSubmissions(e) {
    if (e) e.preventDefault();

    sessionStorage.setItem("adminToken", token);
    setStatus("Loading...");

    try {
      const response = await fetch(
        `/api/admin/contact-submissions?search=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      setSubmissions(data.submissions);
      setSelected(null);
      setStatus("");
    } catch {
      setStatus("Unable to load submissions.");
    }
  }

  async function viewSubmission(id) {
    try {
      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setSelected(data.submission);
    } catch {
      setStatus("Unable to load message.");
    }
  }

  return (
    <section className="section page-section">
      <h1>Contact Requests</h1>

      <form className="admin-controls" onSubmit={loadSubmissions}>
        <input
          type="password"
          placeholder="Admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search name, email, or service"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="primary-button" type="submit">
          Load Requests
        </button>
      </form>

      {status && <p className="form-status">{status}</p>}

      <div className="admin-layout">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Received</th>
              <th>Name</th>
              <th>Email</th>
              <th>Service</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((item) => (
              <tr key={item.id} onClick={() => viewSubmission(item.id)}>
                <td>{item.id}</td>
                <td>{item.created_at}</td>
                <td>{item.first_name} {item.last_name}</td>
                <td>{item.email}</td>
                <td>{item.service}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {selected && (
          <div className="admin-detail">
            <h2>{selected.first_name} {selected.last_name}</h2>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Phone:</strong> {selected.phone}</p>
            <p><strong>Other Phone:</strong> {selected.other_phone}</p>
            <p><strong>Service:</strong> {selected.service}</p>
            <p><strong>Received:</strong> {selected.created_at}</p>

            <h3>Message</h3>
            <p>{selected.message}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Admin;