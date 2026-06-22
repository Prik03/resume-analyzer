import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { resumes } from "../../constants";

const ResumeCard = ({
  resumeData: { id, companyName, jobTitle, imagePath, resumePath, feedback },
}: {
  resumeData: Resume;
}) => {  const [resumeUrl, setResumeUrl] = useState("");
    const { fs, kv } = usePuterStore();

  useEffect(() => {
  const  loadResume = async () => {
  const blob = await fs.read(imagePath);
  if(!blob) return;
  let url = URL.createObjectURL(blob);
  setResumeUrl(url);
  }

  loadResume();
  },[imagePath]);

  const handleDelete = async (resumePath: string) => {
    const deleteData = await fs.read(resumePath);
    console.log("deleteData", deleteData);
  }

  return (
    <div
      className="resume-card animate-in fade-in duration-1000 h-fit"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && <h2 className="text-black font-bold break-words">{companyName}</h2>}
          {jobTitle && <h3 className="break-words text-lg text-gray-500">{jobTitle}</h3>}
          {!companyName && !jobTitle && <h2 className="text-black font-bold break-words">Resume</h2>}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img
            src={resumeUrl}
            alt="resume"
            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
          />
        </div>
      </div>)}
      <div className="flex gap-4 mt-2 flex-col sm:flex-row">
      <Link
        to={`/resume/${id}`}
        className="block h-full primary-button w-full p-4 text-center mb-4 sm:w-[50%]"
        aria-label={`View details for resume ${companyName || jobTitle || 'Resume'}`}
      >
        View Details
      </Link>
      <button className="block h-full primary-button w-full p-4 text-center mb-4 sm:w-[50%]" aria-label={`Delete resume ${companyName || jobTitle || 'Resume'}`} onClick={() => handleDelete(resumePath)}>
        Delete
      </button>
      </div>
    </div>
  );
};

export default ResumeCard;
