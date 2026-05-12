import Navbar from "~/component/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/component/ResumeCard";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer" },
    { name: "description", content: "Get Your Dream Job with AI Analyzer" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  return (
    <div className="bg-[url('/images/bg-main.svg')] bg-cover body-content">
      <Navbar />
      <main className="main-section">
        <div className="page-heading py-5">
          <h1>Ai Resume Analyzer Application</h1>
          <h2>Review your submission and check AI powered Feedback</h2>
        </div>
        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resumeData={resume} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
