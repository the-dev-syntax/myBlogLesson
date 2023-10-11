import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import Video from "@/app/components/video";
import CustomImage from "@/app/components/customImage";

type FileTree = {
  tree: [
    {
      path: string;
    }
  ];
};
// this fn to get all content and metadata from each file
// gets file raw data convert it to text , use compileMDX => return obj of {frontmatter , content}
// compileMDX parameter is an object contain {source : fileFetchedTexted , options}
// options:
// compileMDX<{ type of frontmatter }>

// prettier-ignore
export async function getPostByName(fileName: string): Promise<BlogPost | undefined> {
  const res = await fetch(
    `https://raw.githubusercontent.com/the-dev-syntax/next-dave-final-project/main/${fileName}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) return undefined;

  const rawMDX = await res.text();

  if (rawMDX === "404: Not Found") return undefined;

  // /** @type {import('rehype-pretty-code').Options} */
  // const options = {
  //   theme: {
  //     dark: "github-dark-dimmed",
  //     // light: "github-light",
  //   },
  // };

  // now process the res data
  // prettier-ignore
  const { content, frontmatter } = await compileMDX<{
    title: string;
    date: string;
    tags: string[];
  }>({
    source: rawMDX,
    components: {
      Video,
      CustomImage,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          [rehypePrettyCode],

          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  });

  const id = fileName.replace(/\.mdx$/, "");

  const blogPostObj: BlogPost = {
    meta: {
      id,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
    },
    content,
  };

  return blogPostObj;
}
// this fn contact api to get tree then filter each mdx file , pass it to another fn
// to extract metadata from it and put them in an array to display it

export async function getPostsMeta(): Promise<Meta[] | undefined> {
  const res = await fetch(
    "https://api.github.com/repos/the-dev-syntax/next-dave-final-project/git/trees/main?recursive=1",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) return undefined;

  const repoFileTree: FileTree = await res.json();

  // console.log(repoFileTree);
  // prettier-ignore
  const filesArray = repoFileTree.tree.map((obj) => obj.path).filter((path) => path.endsWith(".mdx"));

  let posts: Meta[] = [];

  for (const file of filesArray) {
    const post = await getPostByName(file);
    if (post) {
      const { meta } = post;
      posts.push(meta);
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
