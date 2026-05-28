import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/component/ATS";
import Details from "~/component/Details";
import Summary from "~/component/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resume - Ai Analyzer" },
  { name: "description", content: "View your resume analysis" },
];

const resume = () => {
    const {auth, fs, kv, isLoading} = usePuterStore();
    const { id } = useParams();
   const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

     useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

    useEffect(() => {
        const fetchResumeData = async () => {
            try {
            const resume = await kv.get(`resume:${id}`);
            if(!resume) {
                setError("Resume data was not found.");
                return;
            }

            const data = JSON.parse(resume);
            const resumePath = data.resumePath ?? data.resumePaht;

            if(!resumePath || !data.imagePath) {
                setError("Resume file path is missing. Please upload the resume again.");
                return;
            }

            const resumeBlob = await fs.read(resumePath);
            if(!resumeBlob) return;

            const pdfUrl = new Blob([resumeBlob], { type: "application/pdf" });
            const resumeUrl = URL.createObjectURL(pdfUrl);
            setResumeUrl(resumeUrl);
            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = new Blob([imageBlob], { type: "image/png" });
            setImageUrl(URL.createObjectURL(imageUrl));
            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback});
            // Handle the fetched data (e.g., set state)
            } catch (error) {
                console.error("Failed to fetch resume data:", error);
                setError("Failed to load resume data.");
            }
        }

        fetchResumeData();
    }, [id]);

  return (
    <main className="!pt-0">
    <nav className="resume-nav">
    <Link to="/" className="back-button">
     <img src="/icons/back.svg" alt="" />
     <span className="text-gray-800 text-sm font-semibold">Back To Home</span>
    </Link>
    </nav>

    <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bd-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center flex">
            {error && (
                <p className="text-red-600 font-semibold">{error}</p>
            )}
            {imageUrl && resumeUrl && (
                <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img src={imageUrl} alt="Resume Analysis" className="rounded-2xl w-full h-full object-contain" />
                  </a>
                </div> 
                )}
        </section>
        <section className="feedback-section p-10 max-lg:p-5">
          <h2 className="text-4xl font-bold text-black">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animaate-in fade-in duration-1000 mt-5">
             <Summary feedback={feedback}/>
             <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
             <Details feedback={feedback} />
            </div>
          ) : (<img src="/images/resume-scan-2.gif" className="w-full mt-5" />)}
        </section>
    </div>
    </main>
  )
}

export default resume
