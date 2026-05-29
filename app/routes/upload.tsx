import { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/component/FileUploader";
import Navbar from "~/component/Navbar";
import { convertPdfToImage } from "~/lib/pdfToImg";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const upload = () => {
  const { auth, isLoading, ai, kv, fs } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const handleFileSubmit = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) return setStatusText("Error: Failed to upload File");

    setStatusText("Converting to Image...");
    const ImageFile = await convertPdfToImage(file);

    if (!ImageFile.file)
      return setStatusText("Error: Failed to convert PDF to Image");

    setStatusText("Uploading the Image...");
    const uploadedImage = await fs.upload([ImageFile.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload Image");

    setStatusText("Preparing Data...");

    const UUID = generateUUID();

    const data = {
      id: UUID,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path, 
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };

    await kv.set(`resume:${UUID}`, JSON.stringify(data));

    setStatusText("Analyzing...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription }),
    );
    if (!feedback) return setStatusText("Error: failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${UUID}`, JSON.stringify(data));
    setStatusText("Analysis Complete, redirecting...");
    navigate(`/resume/${UUID}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
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
