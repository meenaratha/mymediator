export default function DeletePage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0eff5",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4b5d8' fill-opacity='0.18'%3E%3Ctext x='5' y='30' font-size='22' font-family='monospace'%3E01%3C/text%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "40px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 960,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}
        className="grid-responsive"
      >

        {/* LEFT CARD */}
        <div style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}>
          {/* Label */}
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#7c3aed",
            marginBottom: 12,
          }}>
            User Account Delete
          </p>

          {/* Title */}
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#0f0f1a",
            margin: "0 0 14px",
            lineHeight: 1.2,
          }}>
            Request Account Deletion
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 15,
            color: "#6b7280",
            lineHeight: 1.65,
            margin: "0 0 32px",
          }}>
            Follow the steps below to delete your MyMediator account or request
            help if you cannot access the app.
          </p>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                n: 1,
                title: "Step",
                desc: "Users can delete their MyMediator account directly from within the app under Settings → Account → Delete Account.",
              },
              {
                n: 2,
                title: "Help",
                desc: (
                  <>
                    If you are unable to log in, you may request account deletion by emailing{" "}
                    <a href="mailto:mymediator20@gmail.com" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 500 }}>
                      mymediator20@gmail.com
                    </a>{" "}
                    from your registered email address.
                  </>
                ),
              },
              {
                n: 3,
                title: "Start Removal",
                desc: "We notify you once the account deletion request begins.",
              },
            ].map((step) => (
              <div key={step.n} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: "18px 20px",
                borderRadius: 14,
                border: "1px solid #ede9f8",
                background: "#faf9ff",
              }}>
                {/* Number badge */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#7c3aed",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  {step.n}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "#0f0f1a", margin: "0 0 5px" }}>
                    {step.title}
                  </p>
                  <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div style={{
          background: "#1a1333",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
        }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 24px",
          }}>
            Before You Delete
          </h2>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Back up any important data before deletion.",
              "Ensure your registered email is accessible.",
              "Deletion is permanent and cannot be undone.",
            ].map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#a78bfa", flexShrink: 0, marginTop: 7,
                }} />
                <span style={{ fontSize: 15, color: "#e5e7eb", lineHeight: 1.55 }}>{item}</span>
              </li>
            ))}
          </ul>

          {/* Info box */}
          <div style={{
            background: "#2d2350",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 32,
          }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", margin: 0 }}>
              Processing time is usually 2 to 5 business days.
            </p>
          </div>

          {/* Contact block */}
          <div style={{ borderTop: "1px solid #2d2350", paddingTop: 28 }}>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px", lineHeight: 1.6 }}>
              Need immediate help or can't access the app? Reach out to our support team directly.
            </p>
            <a
              href="mailto:mymediator20@gmail.com"
              style={{
                display: "block",
                textAlign: "center",
                padding: "13px 20px",
                borderRadius: 10,
                background: "#7c3aed",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                letterSpacing: "0.01em",
                marginBottom: 12,
              }}
            >
              Email Support
            </a>
            <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", margin: 0 }}>
              mymediator20@gmail.com
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 680px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}