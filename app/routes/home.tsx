import Navbar from "~/component/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/component/ResumeCard";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer" },
    { name: "description", content: "Get Your Dream Job with AI Analyzer" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setIsLoading(true);

      const resumes = (await kv.list('resume:*',true)) as KVItem[];

      const passedResumes: Resume[] = resumes?.map((resume) => (JSON.parse(resume.value) as Resume));
      setResumes(passedResumes || []);
      setIsLoading(false);
    }

    loadResumes();
  },[]);
  return (
    <div className="bg-[url('/images/bg-main.svg')] bg-cover body-content">
      <Navbar />
      <main className="main-section">
        <div className="page-heading py-5">
          <h1>Ai Resume Analyzer Application</h1>
          {isLoading && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submission and check AI powered Feedback</h2>
          )}
        </div>
        {isLoading && (
      <div className="flex flex-col items-center justify-center">
        <img src="images/resume-scan-2.gif" alt="" className="w-[200px]" />
        <p role="alert" className="sr-only">Loading resumes...</p>
      </div>)} 
        {!isLoading && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resumeData={resume} />
            ))}
          </div>
        )}
        {!isLoading && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 mt-10">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
