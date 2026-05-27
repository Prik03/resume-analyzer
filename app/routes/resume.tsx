import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resume - Ai Analyzer" },
  { name: "description", content: "View your resume analysis" },
];

const resume = () => {
    const {auth, fs, kv, isLoading} = usePuterStore();
    const { id } = useParams();
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResumeData = async () => {
            const response = await kv.get(`resume:${id}`);
            if(!response) return;

            const resumeData = JSON.parse(response);

            const resumeBlob = await fs.read(resumeData.resumePath);
            if(!resumeBlob) return;

            const pdfUrl = new Blob([resumeBlob], { type: "application/pdf" });
            const resumeUrl = URL.createObjectURL(pdfUrl);
            setResumeUrl(resumeUrl);
            const imageBlob = await fs.read(resumeData.imagePath);
            if(!imageBlob) return;
            const imageUrl = new Blob([imageBlob], { type: "image/png" });
            setImageUrl(URL.createObjectURL(imageUrl));
            setFeedback(resumeData.feedback);
            // Handle the fetched data (e.g., set state)
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
            {imageUrl && resumeUrl && (
                <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit"></div> 
                )}
        </section>
    </div>
    </main>
  )
}

export default resume