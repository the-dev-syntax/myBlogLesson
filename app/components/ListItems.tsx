import getFormattedDate from "@/lib/getFormattedDate";
import Link from "next/link";

type Props = {
  post: Meta;
};

export default function ListItems({ post }: Props) {
  const { title, id, date } = post;
  const formattedDate = getFormattedDate(date);

  return (
    <li className="mt-4 text-2xl dark:text:white/90">
      <Link
        className="underline text-teal-300 hover:text-white/90 dark:hover:text-white"
        href={`/posts/${id}`}
      >
        {title}
      </Link>
      <br />
      <p className="text-sm mt-1 text-teal-600">{formattedDate}</p>
    </li>
  );
}
