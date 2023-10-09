import { getPostsMeta } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import ListItems from "@/app/components/ListItems";

export const revalidate = 86400;

type Props = {
  params: {
    tag: string;
  };
};

export async function generateStaticParams() {
  const postsMeta = await getPostsMeta();

  if (!postsMeta) return []; // metadata should return []

  const tags = new Set(postsMeta.map((post) => post.tags).flat());
  // The postsMeta array is an array of objects, each of which contains information about a post, such as the post's title, ID, and tags.
  // The map() method iterates over the postsMeta array and returns a new array containing the tags for each post.
  // The flat() method flattens the new array, so that it only contains the tags themselves.
  // The Set() object constructor creates a new Set object containing the elements that are passed to it.
  // const postsMeta = [
  //   { title: "Post 1", id: 1, tags: ["tag1", "tag2"] },
  //   { title: "Post 2", id: 2, tags: ["tag3", "tag4"] },
  //   { title: "Post 3", id: 3, tags: ["tag1", "tag5"] },
  // ];
  // const tags = new Set(postsMeta.map((post) => post.tags).flat());
  // Output:  Set { 'tag1', 'tag2', 'tag3', 'tag4', 'tag5' }

  return Array.from(tags).map((tag) => ({ tag })); // [{tag: 'new'}, {tag:'next.js'}]
  // example return Array.from(tags).map((tagKey) => ({ tagKey })); any object is a key-value pair
  // with map:you provide keys, the array provide the values
  // [{tagKey : tagValue}, {tagKey : tagValue}, {tagKey : tagValue}]
}

export async function generateMetadata({ params: { tag } }: Props) {
  const postsMeta: Meta[] | undefined = await getPostsMeta();

  if (!postsMeta)
    return {
      title: `tag not provided`,
    };

  return {
    title: `Posts about ${tag}`,
  };
}

export default async function pagesMetaByTag({ params: { tag } }: Props) {
  const postsMeta: Meta[] | undefined = await getPostsMeta();

  if (!postsMeta)
    return <p className="mt-10 text-center">Sorry, no posts available.</p>;

  const tagPosts = postsMeta.filter((obj) => obj.tags.includes(tag));

  if (!tagPosts.length)
    return (
      <div className="text-center">
        <p className="mt-10">Sorry, no posts for {tag}.</p>
        <Link href="/">Back to Home</Link>
      </div>
    );

  return (
    <>
      <h2 className="text-3xl mt-4 mb-0">Results for: #{tag}</h2>
      <section className="mt-6 mx-auto max-w-2xl">
        <ul className="w-full list-none p-0">
          {tagPosts.map((post) => (
            <ListItems key={post.id} post={post} />
          ))}
        </ul>
      </section>
    </>
  );
}
