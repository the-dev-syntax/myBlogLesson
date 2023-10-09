import Posts from "./components/Posts";
import MyProfilePic from "./components/MyProfilePic";

export const revalidate = 86400; // at production: 86400   w is sec per day
// it take two refreshes to get the update one to trigger reval then 10s , one to get it

export default function Home() {
  return (
    <div className="mx-auto">
      <MyProfilePic />
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and Welcome 👋&nbsp;
        <span className="whitespace-nowrap">
          I'm <span className="font-bold">Deca</span>
        </span>
      </p>

      <Posts />
    </div>
  );
}
