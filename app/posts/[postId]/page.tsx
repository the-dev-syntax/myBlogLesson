import { getPostsMeta, getPostByName } from "@/lib/posts";
import { notFound } from "next/navigation";
import getFormattedDate from "@/lib/getFormattedDate";
import Link from "next/link";

// this is like cache :"no-cache" , this will make page SSR
// to catch error during dev ,
// will come back to add longer duration , to cache ==> SSG pages
export const revalidate = 86400;

type Props = {
  params: {
    postId: string;
  };
};
//* this will cause problem generateStaticParams with validate = 0;
export async function generateStaticParams() {
  const posts = await getPostsMeta();

  if (!posts) return [];

  return posts.map((post) => ({
    postId: post.id,
  }));
}

export async function generateMetadata({ params: { postId } }: Props) {
  // console.log(postId);
  const post = await getPostByName(`${postId}.mdx`);

  if (!post) {
    return {
      title: "Post Not Found",
      // add metadata
    };
  } else {
    return {
      title: post.meta.title,
    };
  }
}

export default async function Post({ params: { postId } }: Props) {
  // console.log(postId);
  const post = await getPostByName(`${postId}.mdx`);
  // console.log(post?.meta, "Post fn");

  // cuz notFound return never , no need for return before it
  if (!post) notFound();

  const { meta, content } = post;

  const formattedDate = getFormattedDate(meta.date);

  const tags = meta.tags.map((tag, i) => (
    <Link key={i} href={`/tags/${tag}`}>
      {tag}
    </Link>
  ));

  return (
    <>
      <h2 className="text-3xl mt-4 mb-0">{meta.title}</h2>
      <p className="mt-0 text-sm">{formattedDate}</p>
      <article>{content}</article>
      <section>
        <h3>Related:</h3>
        <div className="flex flex-row gap-4">{tags}</div>
      </section>
      <p className="mb-10">
        <Link href="/">← Back to home</Link>
      </p>
    </>
  );
}
