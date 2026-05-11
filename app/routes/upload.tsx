import { useState } from "react";
import FileUploader from "~/component/FileUploader";
import Navbar from "~/component/Navbar";

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const handleFileSubmit = (file: File | null) => {
    setFile(file);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusText("Processing your resume...");
  };
  return (
    <div className="bg-[url('/images/bg-main.svg')] bg-cover body-content">
      <Navbar />
      <main className="main-section">
        <div className="page-heading py-5">
          <h1>Smart Feedback For Your Dream Job!</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>
              Upload your resume and get instant AI-powered feedback to boost
              your chances of landing your dream job!
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                ></textarea>
              </div>
              <div className="form-div">
                <label htmlFor="Uploader">Uploader</label>
                <FileUploader onFileSelect={handleFileSubmit} />
              </div>
              <button type="submit" className="primary-button">
                {" "}
                Analyze Resume{" "}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default upload;
