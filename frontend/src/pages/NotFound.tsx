import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
        <p className="gradient-text" style={{ fontSize: "clamp(5rem, 15vw, 9rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.05em", fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>404</p>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: 400, marginBottom: 32, fontSize: 15 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <button className="btn-primary" onClick={() => navigate("/home")} style={{ padding: "12px 32px" }}>
          Back to Home
        </button>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
