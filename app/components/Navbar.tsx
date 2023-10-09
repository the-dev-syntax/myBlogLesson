import Link from "next/link";
import { FaYoutube, FaTwitter, FaGithub, FaLaptop } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-slate-600 p-4 sticky top-0 drop-shadow-xl z-10">
      <div className="md:px-6 prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
        <h1 className="text-3xl font-bold text-white grid place-content-center mb-2 md:mb-0">
          <Link
            href="/"
            className="text-white/90 no-underline hover:text-white"
          >
            Deca Khalil
          </Link>
        </h1>
        <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white text-3xl lg:text-4xl">
          <Link
            className="text-white/90 hover:text-white"
            href="https://www.youtube.com/"
            target="_blank"
          >
            <FaYoutube />
          </Link>
          <Link
            className="text-white/90 hover:text-white"
            href="https://www.twitter.com"
            target="_blank"
          >
            <FaTwitter />
          </Link>
          <Link
            className="text-white/90 hover:text-white"
            href="https://www.udemy.com/"
            target="_blank"
          >
            <FaLaptop />
          </Link>
          <Link
            className="text-white/90 hover:text-white"
            href="https://github.com/the-dev-syntax"
            target="_blank"
          >
            <FaGithub />
          </Link>
        </div>
      </div>
    </nav>
  );
}
// href="https://www.youtube.com/@decaKhalil"
// href="https://www.twitter.com/@decaKhalil"
// href="https://www.decaKhalil.com/@decaKhalil"
