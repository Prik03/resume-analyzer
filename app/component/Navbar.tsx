import { Link, useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">Resume</p>
      </Link>
      <button
        className="primary-button w-fit"
        onClick={() => navigate("/upload")}
      >
        Upload Resume
      </button>
    </nav>
  );
};

export default Navbar;
