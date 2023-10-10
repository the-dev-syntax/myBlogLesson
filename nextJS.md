## GETTING STARTED

npx create-next-app@latest

- name
- typescript
- eslint
-
-
-

## CREATING A page.tsx inside app

rfc ===>
export default function page() {
return (

<div>page</div>
)
}
------------------------------------------------------------------------
-------------------------------metadata---------------------------------
------------------------------------------------------------------------

[metadata]
https://nextjs.org/docs/app/building-your-application/optimizing/metadata

## here in this next 13.1.4

[Still making a head.tsx which is deprecated in new versions] did not work with dave

## all Metadata Values very helpful

https://nextjs.org/docs/app/api-reference/functions/generate-metadata

## Error handling

https://nextjs.org/docs/app/building-your-application/routing/error-handling

=======
======= page.tsx
=======

```tsx
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Designed by Deca",
  icons: {
    icon: "/AMRT-logo-waves-dark1.png",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Hello Deca!</h1>
      <Link href="/about">About Us</Link>
    </main>
  );
}
```

=======
======= about/page.tsx
=======

```tsx
import Link from "next/link";

export default function About() {
  //  throw new Error("not today");
  return (
    <>
      <h1>About</h1>
      <Link href="/"> Link to Home Page</Link>
    </>
  );
}
```

=======
======= about/loading.tsx
=======

```tsx
export default function Loading() {
  return <h1>loading...</h1>;
}
```

=======
======= about/layout.tsx contain the metadata from the docs
=======
[setup]
https://nextjs.org/docs/app/building-your-application/optimizing/metadata
[key-options-on-metadata]
https://nextjs.org/docs/app/api-reference/functions/generate-metadata

```tsx
import styles from "./styles.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page",
  description: "Designed by Deca",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>about NavBar</nav>
      <main className={styles.main}>{children}</main>
    </>
  );
}
```

=======
======= about/layout.tsx contain the metadata from the docs
=======
[copy-and-paste-from-the-docs]
[Error-handling]
https://nextjs.org/docs/app/building-your-application/routing/error-handling

```tsx
"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

---

---

---

installing npx create-next-app@13.2.?

adjusting the app/api/page.tsx
adjusting the app/api/layout.tsx

[data-Fetching] ------------------------------------------------------
[data-Fetching] ------------------------------------------------------
[data-Fetching] ------------------------------------------------------
[data-Fetching] ------------------------------------------------------

https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating

1 - make library file (lib) to contain all fetch functions
2 - make types.d.ts file to contain all data to be fetched type
3 - make page.tsx to hold additional more detailed pages
inside components folder ==> app(home p, css, all)/users(everything about users)/components(individual user info and posts)

```tsx
export default async function getUserPost(userId: number) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return undefined;

  return res.json();
}
// { cache : 'force-cache' } default , for stale data , not changing
//  { cache : 'no-store' }
//  { next : { revalidate : 60} } for dynamic data , updated frequently , check every 60sec ,
// this revalidate can be set at higher levels in the main app/page.html  ==> export const revalidate = 60;
// referenced in segment-level Caching
```

[CDN] content delivery network cloud
[ORM] Object Relational Mapping databases
[SSG] Static Site Generation
[SSR] Server Site Rendering
[ISR] incremental static regenration for cache in lib=library in your next app

to convert (SSR) Server Site Rendering to (SSG) Static Site Generation(recommended) by identifying the possible passed param [userId]

```tsx
import getUser from "@/lib/getUser";
import getUserPost from "@/lib/getUserPost";
import { Suspense } from "react";
import UserPosts from "./components/UserPosts";
import { Metadata } from "next";
import getAllUsers from "@/lib/getAllUsers";

import { notFound } from "next/navigation";

type Param = { params: { userId: string } };

// is is a build-in fn name -generateMetadata- to make dynamic metadata
//prettier-ignore
export async function generateMetadata({ params: { userId }}: Param): Promise<Metadata> {
  const userData: Promise<User> = getUser(userId);
  const user = await userData;

  if (!user?.name) {
    return {
      title: "User Not Found"
    }
  }

  return {
    title: user.name,
    description: `this is the page of ${user.name}`,
  };
}
// destructured { params: { userId }}
export default async function page({ params: { userId } }: Param) {
  const userData: Promise<User> = getUser(userId);
  const userPostData: Promise<Post[]> = getUserPost(userId);
  //    const [user , userPosts] = await Promise.all([userData, userPostData])

  const user = await userData;

  if (!user?.name) notFound();

  const content = (
    <section>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h1>Loading...</h1>}>
        {/* <UserPosts posts={userPosts} /> */}
        <UserPosts promise={userPostData} />
      </Suspense>
    </section>
  );

  return content;
}
const test = "test";

export async function generateStaticParams() {
  const usersData: Promise<User[]> = getAllUsers();
  const users = await usersData;

  return users.map((user) => ({
    userId: user.id.toString(),
  }));
}
```

## Good to know: Dynamic Segments are equivalent to Dynamic Routes in the pages directory.

## Generating Static Params same page

https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
he spoke about DynamicParams but it is not in the docs anymore

https://nextjs.org/docs/app/api-reference/functions/use-params beautiful

export default function Page({ params }: { params: { slug: string } }) {
return <div>My Post: {params.slug}</div>
}

the parameter passed of type
The parameter object that is being passed to the Page component is actually an object that contains a single property called params, which has a value of an object with a single property called slug of type string.

params here cus it is folder Name [userId] it will pass to all files req if needed as object and it passes as String
type Parameter = {
params: {
slug: string
}
}
--- ===============================================================
--- ===============================================================
--- ===============================================================
--- ===============================================================
special names for files:
[page.tsx]
[error.tsx]
[not-found.tsx]
--- ===============================================================
--- ===============================================================
--- ===============================================================
--- ===============================================================
adding [not-found.tsx] beside page.tsx inside [userId]folder
if library folder

```tsx
export default async function getAllUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");

  if (!res.ok) throw new Error("Failed to Fetch Data");

  return res.json();
}
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export default async function getUser(userId: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (!res.ok) return undefined;

  return res.json();
}
//   if (!res.ok) throw new Error("could not fetch this user");

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export default async function getUserPost(userId: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return undefined;

  return res.json();
}
// { cache : 'force-cache' } default , for stale data , not changing
//  { cache : 'no-store' }
//  { next : { revalidate : 60} } for dynamic data , updated frequently , check every 60sec ,
// this revalidate can be set at higher levels in the main app/page.html  ==> export const revalidate = 60;
// referenced in segment-level Caching

```

## ----------------------------------------------------------------------------

[install-fonts] ------------------------------------------------------
[install-fonts] ------------------------------------------------------
[install-fonts] ------------------------------------------------------
[install-fonts] ------------------------------------------------------

## ----------------------------------------------------------------------------

use variable fonts which does not need to be specified subsets for better performance like Inter

page.tsx

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] }); //everything in [],  variable font => no need for weight
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"] }); // values in [] , not variable font ==> must add weight
```

- component folder ===> made in app
- NavBar.tsx
- Search.tsx
- [searchTerm] folder ===> made in app
- [searchTerm]/ page.tsx
- lib folder
- getWikiResults.tsx
- types.d.ts to be ignored later

## Props to be passed

## Props to be passed

## Props to be passed

## keyValue is the only one to change its name

type Props = { params: { keyValue: string } };

## Props to be passed

## Props to be passed

## Props to be passed

[tsrfc] short cut for this

type Props = {}
export default function item({}: Props) {
return (

<div>item</div>
)
}

image optimization
https://nextjs.org/docs/app/building-your-application/optimizing/images
image components
https://nextjs.org/docs/app/api-reference/components/image

error.tsx from doc
https://nextjs.org/docs/app/api-reference/file-conventions/error

loading.tsx from docs
https://nextjs.org/docs/app/api-reference/file-conventions/loading

- -------------------- \***\*\*\*\***//**\*\***\*\***\*\*** -------------------------------------------------------------------------------------
- -------------------- \***\*\*\*\***//**\*\***\*\***\*\*** ------------------------------------------------------------------------------------
- -------------------- \***\*\*\*\***//**\*\***\*\***\*\*** ------------------------------------------------------------------------------------
- -------------------- --------------------------------------- \* [the-project-files] \* :----------------
- -------------------- \***\*\*\*\***//**\*\***\*\***\*\*** ------------------------------------------------------------------------------------
- -------------------- \***\*\*\*\***//**\*\***\*\***\*\*** ------------------------------------------------------------------------------------
- -------------------- \***\*\*\*\***//**\*\***\*\***\*\*** ------------------------------------------------------------------------------------

```tsx
// -------------------------------
// types.tsx file --------------------
// -------------------------------
type Result = {
  pageid: string;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
};

type SearchResult = {
  query?: {
    pages?: Result[];
  };
};

// -------------------------------
// lib/getWikiResults.tsx file --------------------
// -------------------------------

export default async function getWikiResults(searchTerm: string) {
  // to interact with wikipedia api it needs searchParams specific to its requirements
  const searchParams = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: searchTerm,
    gsrlimit: "20",
    prop: "pageimages|extracts",
    exchars: "100",
    exintro: "true",
    explaintext: "true",
    exlimit: "max",
    format: "json",
    origin: "*",
  });

  const response = await fetch(
    "https://en.wikipedia.org/w/api.php?" + searchParams
  );

  if (!response) return undefined;

  return response.json();
}

/*   
https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams  link 
   searchParams   explanation :
---------------------------------------------


The `searchParams` object in your code is created using the `URLSearchParams` constructor, which is part of the URLSearchParams API.

The `URLSearchParams` API is a JavaScript interface that allows you to manipulate and query the query string of a URL. It is defined in the HTML5 specification and is supported by most modern web browsers.

The `URLSearchParams` constructor takes a single argument, which is an object that contains the key-value pairs that you want to add to the query string. The keys in the object correspond to the query string parameters, and the values correspond to the values of those parameters.

In your code, the `searchParams` object is created with the following key-value pairs:

* `action`: The action parameter specifies the type of request to make to the API. In this case, the value is `'query'`, which indicates that you want to perform a search.
* `generator`: The generator parameter specifies the type of search you want to perform. In this case, the value is `'search'`, which indicates that you want to perform a full-text search.
* `gsrsearch`: The gsrsearch parameter specifies the search term that you want to search for. In this case, the value is `searchTerm`, which is a string that contains the search term.
* `gsrlimit`: The gsrlimit parameter specifies the maximum number of search results to return. In this case, the value is `'20'`, which means that the API will return up to 20 search results.
* `prop`: The prop parameter specifies the properties that you want to include in the search results. In this case, the value is `'pageimages|extracts'`, which means that you want to include page images and extracts (i.e., summaries) in the search results.
* `exchars`: The exchars parameter specifies the maximum number of characters to include in the search results. In this case, the value is `'100'`, which means that the API will include up to 100 characters in the search results.
* `exintro`: The exintro parameter specifies whether you want to include introductory text in the search results. In this case, the value is `'true'`, which means that the API will include introductory text in the search results.
* `explaintext`: The explaintext parameter specifies whether you want to include explanatory text in the search results. In this case, the value is `'true'`, which means that the API will include explanatory text in the search results.
* `exlimit`: The exlimit parameter specifies the maximum number of search results to return for each page. In this case, the value is `'max'`, which means that the API will return up to the maximum number of search results allowed by the server.
* `format`: The format parameter specifies the format of the search results. In this case, the value is `'json'`, which means that the API will return the search results in JSON format.
* `origin`: The origin parameter specifies the origin of the request. In this case, the value is `'`*'`, which means that the request can come from any origin.

I hope this helps! Let me know if you have any other questions.
*/

// -------------------------------
// app/layout.tsx file --------------------
// -------------------------------
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "D-Derma",
  description: "Customized products for your skin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-800">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

// -------------------------------
// app/page.tsx file --------------------
// -------------------------------

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] }); //everything in [],  variable font => no need for weight
// import { Roboto } from "next/font/google";
// const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"] }); // values in [] , not variable font ==> must add weight

export default function Home() {
  return (
    <main className={inter.className}>
      <div className="text-white">Hello</div>
    </main>
  );
}

// -------------------------------
// components/Navbar.tsx file --------------------
// -------------------------------

import Link from "next/link";
import Search from "./Search";

export default function Navbar() {
  return (
    <nav className="bg-slate-600 p-4 flex justify-between flex-col md:flex-row sticky top-0 drop-shadow-xl">
      <h1 className="text-3xl font-bold text-white grid place-content-center mb-2 md:mb-0">
        <Link href="/">D-Derma!</Link>
      </h1>
      <Search />
    </nav>
  );
}

// -------------------------------
// components/Search.tsx file --------------------
// -------------------------------

("use client");
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch("");
    router.push(`/${search}/`);
  };

  return (
    <form
      className="w-50 flex justify-center md:justify-between"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white p-2 w-80 text-xl rounded-xl"
        placeholder="Search"
      />
      <button
        type="submit"
        className="p-2 text-xl rounded-xl bg-slate-300 ml-2 font-bold"
      >
        🪶
      </button>
    </form>
  );
}

// window button + . to open emoji

// -------------------------------
// [searchTerm]/page.tsx file --------------------
// -------------------------------

import getWikiResults from "@/lib/getWikiResults";
import Item from "./components/item";

type Props = { params: { searchTerm: string } };

export async function generateMetadata({ params: { searchTerm } }: Props) {
  const wikidata: Promise<SearchResult> = getWikiResults(searchTerm);
  const data = await wikidata;
  const displayTerm = searchTerm.replaceAll("%20", " ");

  if (!data?.query?.pages) {
    return {
      title: `${displayTerm} NOT FOUND`,
    };
  }
  return {
    title: `${displayTerm}`,
    description: `Search results for ${displayTerm}`,
  };
}

export default async function SearchResults({ params: { searchTerm } }: Props) {
  const wikidata: Promise<SearchResult> = getWikiResults(searchTerm);
  const data = await wikidata;

  const results: Result[] | undefined = data?.query?.pages;

  const content = (
    <main className="bg-slate-200 mx-auto max-w-lg py-1 min-h-screen">
      {results ? (
        Object.values(results).map((result) => {
          return <Item key={result.pageid} result={result} />;
        })
      ) : (
        <h2 className="p-2 text-xl">
          {searchTerm.replaceAll("%20", " ")} Not Found
        </h2>
      )}
    </main>
  );

  return content;
}
/*
The Object.values() method is used to convert an object into an array of its values,
so it's not needed in this case since results is already an array.
*/

// -------------------------------
// [searchTerm]/components/item.tsx file --------------------
// -------------------------------

import Link from "next/link";
import Image from "next/image";

type Props = {
  result: Result;
};

export default function Item({ result }: Props) {
  const itemTextCol = (
    <div className="flex flex-col justify-center">
      <h2>
        <Link
          href={`https://en.wikipedia.org/?curid=${result.pageid}`}
          target="_blank"
          className="text-xl font-bold underline"
        >
          {result.title}
        </Link>
      </h2>
      <p>{result.extract}</p>
    </div>
  );

  const content = result?.thumbnail?.source ? (
    <article className="m-4 max-w-lg">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col justify-center">
          {/* Note  */}
          <Image
            src={result.thumbnail.source}
            alt={result.title}
            width={result.thumbnail.width}
            height={result.thumbnail.height}
            placeholder="empty"
            blurDataURL="true"
            loading="lazy"
            unoptimized
          />
        </div>
        {itemTextCol}
      </div>
    </article>
  ) : (
    <article className="m-4 max-w-lg">{itemTextCol}</article>
  );

  return content;
}
// it could be img tag with yellow warning or Image imported with  unoptimized to stop the warning , reference in the docs:
// https://nextjs.org/docs/pages/api-reference/components/image

// -------------------------------
// [searchTerm]/loading.tsx file --------------------
// -------------------------------

export default function loading() {
  return (
    <main className="bg-slate-200 mx-auto max-w-lg p-1 min-h-screen">
      <h2 className="m-4 text-2xl font-bold">Loading...</h2>
    </main>
  );
}

/*
export default function Loading() {
  // Or a custom loading skeleton component
  return <p>'Loading...'</p>
}

*/

// -------------------------------
// [searchTerm]/error.tsx file --------------------
// -------------------------------

("use client"); // Error components must be Client components

import { useEffect } from "react";
import Link from "next/link";

// prettier-ignore
export default function Error( {error, reset }: { error: Error, reset: () => void }) {

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="bg-slate-200 mx-auto max-w-lg py-1 px-4 min-h-screen">
      <h2 className="my-4 text-2xl font-bold">Something went wrong!</h2>
      <button
        className="mb-4 p-4 bg-red-500 text-white rounded-xl"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
      <p className="text-xl">
        Or go back to <Link href="/" className="underline">Home 🏠</Link>
      </p>
    </main>
  );
}

/*
in the docs:
'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}

*/
// ---------------------------------------------------------------------------------------------------------
```

**===================== ================================== ----------------**
**===================== ================================== ----------------**
---------------------- [lesson-6] --[gary-Blog--start] : ----------------
**===================== ================================== ----------------**
**===================== ================================== ----------------**

1- react font awesome icons library =>> npm i react-icons
2- npm install -D @tailwindcss/typography ==> prose lg:prose-xl
3- npm i gray-matter (explained down )
4- [Dates-times] formatting
5- npm i remark remark-html (explained down )
6- [dangerouslySetInnerHTML] from react

cwd is ===> current working directory

## 3- npm i gray-matter ------------------------------

https://www.npmjs.com/package/gray-matter explains gray matter

```ts
// Converts a string with front-matter, like this:

---
title: Hello
slug: home
---
<h1>Hello world!</h1>

// Into an object like this:

{
  content: '<h1>Hello world!</h1>',
  data: {
    title: 'Hello',
    slug: 'home'
  }
}

```

## 4- [Dates-times] formatting : ---------------------------------

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
from MDN:

```ts
const date = new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738));
// Results below assume UTC timezone - your results may vary

// Specify default date formatting for language (locale)
console.log(new Intl.DateTimeFormat('en-US').format(date));
// Expected output: "12/20/2020"

// Specify default date formatting for language with a fallback language (in this case Indonesian)
console.log(new Intl.DateTimeFormat(['ban', 'id']).format(date));
// Expected output: "20/12/2020"

  // Specify date and time format using "style" options (i.e. full, long, medium, short)
  console.log(
    new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Australia/Sydney' }).format(date),
  );
  // Expected output: "Sunday, 20 December 2020 at 14:23:16 GMT+11"

-------my touch ---------

// Specify date and time format using "style" options (i.e. full, long, medium, short)
console.log(
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(new Date()),
);
// Expected output: "Sunday, 20 December 2020 at 14:23:16 GMT+11"
```

## 5- npm i remark remark-html -----------------------------------------

This plugin is useful when you want to quickly turn markdown into HTML. In most cases though, it’s recommended to use remark-rehype instead and finally use rehype-stringify to serialize HTML. The reason using both ecosystems instead of this plugin is recommended, is that there are many useful rehype plugins that you can then use. For example, you can minify HTML, format HTML, highlight code, add metadata, and a lot more.

Depending on the input you have and output you want, you can use different parts of rehype. If the input is HTML, you can use rehype-parse with unified. If the output is HTML, you can use rehype-stringify with unified If both the input and output are HTML, you can use rehype on its own. When you want to inspect and format HTML files in a project, you can use rehype-cli.

Security:
As improper use of HTML can open you up to a cross-site scripting (XSS) attacks, use of rehype can also be unsafe. Use rehype-sanitize to make the tree safe.

- ==> proper explanation of the code in the file itself

## 6- [dangerouslySetInnerHTML] from docs only used with trusted data -----------------------

https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html

dangerouslySetInnerHTML is React’s replacement for using innerHTML in the browser DOM. In general, setting HTML from code is risky because it’s easy to inadvertently expose your users to a cross-site scripting (XSS) attack. So, you can set HTML directly from React, but you have to type out dangerouslySetInnerHTML and pass an object with a \_\_html key, to remind yourself that it’s dangerous. For example:

```js
function createMarkup() {
  return { __html: "First &middot; Second" };
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

## how to secure [dangerouslySetInnerHTML] --------------

answer 1:
If XSS is your primary concern, you can use DOMPurify to sanitize your HTML before inserting it in the DOM via dangerouslySetInnerHTML. It's just 10K minified. And it works in Node too.

answer 2:
The article How to prevent XSS attacks when using dangerouslySetInnerHTML in React suggests to use jam3/no-sanitizer-with-danger eslint rule to check that the content passed to dangerouslySetInnerHTML is wrapped in this sanitizer function

Example of valid code is

```js
const sanitizer = dompurify.sanitize;
return <div dangerouslySetInnerHTML={{ __html: sanitizer(title) }} />; // Good
```

It also describes 3 sanitizer libraries:
DOMPurify
Xss.
xss-filters.

## Blog Post => Project Files :----------------------------------------------------

```tsx
// -------------------------------
// blogposts/pre-rendering.md  --------------------
// -------------------------------
---
title: "Two Forms of Pre-rendering"
date: "2023-03-14"
---

Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.

- **Static Generation** is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then _reused_ on each request.
- **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.

Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.

// -------------------------------
// blogposts/ssg-ssr.md  --------------------
// -------------------------------

---
title: "When to Use Static Generation vs. Server-side Rendering"
date: "2023-03-17"
---

We recommend using **Static Generation** (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.

You can use Static Generation for many types of pages, including:

- Marketing pages
- Blog posts
- E-commerce product listings
- Help and documentation

You should ask yourself: "Can I pre-render this page **ahead** of a user's request?" If the answer is yes, then you should choose Static Generation.

On the other hand, Static Generation is **not** a good idea if you cannot pre-render a page ahead of a user's request. Maybe your page shows frequently updated data, and the page content changes on every request.

In that case, you can use **Server-Side Rendering**. It will be slower, but the pre-rendered page will always be up-to-date. Or you can skip pre-rendering and use client-side JavaScript to populate data.

// -------------------------------
// app/page.tsx  --------------------
// -------------------------------
import Image from "next/image";
import Posts from "./components/Posts";

export default function Home() {
  return (
    <main className="px-6 mx-auto">
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and Welcome 👋&nbsp;
        <span className="whitespace-nowrap">
          I&apos;m <span className="font-bold">Deca</span>
        </span>
      </p>
      <Posts />
    </main>
  );
}

// -------------------------------
// app/layout.tsx  --------------------
// -------------------------------
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import MyProfilePic from "./components/MyProfilePic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deca's Blog",
  description: "Created by Deca khalil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-800">
        <Navbar />
        <MyProfilePic />
        {children}
      </body>
    </html>
  );
}

// -------------------------------
// app/components/Navbar.tsx  --------------------
// -------------------------------

import Link from "next/link";
import { FaYoutube, FaTwitter, FaGithub, FaLaptop } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-slate-600 p-4 sticky top-0 drop-shadow-xl z-10">
      <div className="prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
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

// -------------------------------
// app/components/MyProfilePic.tsx  --------------------
// -------------------------------

import Image from "next/image";

export default function MyProfilePic() {
  return (
    <section className="w-full mx-auto">
      <Image
        className="border-4 border-black dark:border-slate-500 drop-shadow-xl shadow-black rounded-full mx-auto mt-8"
        src="/images/deca-khalil-2.jpg"
        alt="Deca Khalil"
        width={200}
        height={200}
        priority={true}
      />
    </section>
  );
}

// -------------------------------
// lib/getFormattedDate.tsx  --------------------
// -------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

export default function getFormattedDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(dateString));
}



// -------------------------------
// lib/posts.tsx  --------------------
// -------------------------------

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectories = path.join(process.cwd(), "blogposts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectories);

  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectories, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    // Use gray-matter to parse the post metadata section
    // i think separate the metadata from body and store them in property key : ==> data
    // accept already read data-Content
    const grayMatterResult = matter(fileContents);

    const blogPost: BlogPost = {
      id: id,
      title: grayMatterResult.data.title,
      date: grayMatterResult.data.date,
    };

    // Combine the data with the id
    return blogPost;
  });

  // Sort posts by date ==> array of posts [each has BlogPost type data]
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/*

This code is using the `gray-matter` and `remark` packages to parse a Markdown file(.md) and convert it to HTML. Here's a breakdown of what each line does:

1. `import matter from 'gray-matter'`: This line imports the `gray-matter` package,
which is used to parse the metadata section of a Markdown file.

2. `import { remark } from 'remark'`: This line imports the `remark` package,
which is used to convert Markdown to HTML.

3. `import html from 'remark-html'`: This line imports the `remark-html` package,
 which is a plugin for `remark` that adds HTML rendering capabilities.

4. `const fileContents = fs.readFileSync(fullPath, 'utf8')`: This line reads the contents of the Markdown file
specified by `fullPath` and assigns it to the `fileContents` variable.
The `fs` module is used to perform the file read operation,
and the `utf8` option is used to specify the encoding of the file contents.

5. `const matterResult = matter(fileContents)`: This line calls the `matter` function from the `gray-matter` package, passing in the `fileContents` variable as an argument. The `matter` function parses the metadata section of the Markdown file and returns an object containing the parsed metadata. The `matterResult` variable is assigned the result of this operation.
6. `const processedContent = await remark().use(html).process(matterResult.content)`: This line calls the `remark` function, passing in the `html` plugin as an argument. The `use` method is used to specify the plugin to use for processing the Markdown content. The `process` method is then called on the resulting processor object, passing in the `matterResult.content` variable as an argument. This variable contains the Markdown content that was parsed by `gray-matter`. The `await` keyword is used to wait for the `process` method to complete before assigning the result to the `processedContent` variable.
7. `const contentHtml = processedContent.toString()`: This line calls the `toString` method on the `processedContent` object, which converts the processed Markdown content to a string. The resulting string is assigned to the `contentHtml` variable.

So, the final value of `contentHtml` will be a string containing the HTML content that was generated by processing the Markdown file.

*/
export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectories, `${id}.md`);

  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents); //==> return {content:'file contents', data:{title: title , date: date}}

  const processedData = await remark().use(html).process(matterResult.content); // return html in a nice presentable way

  const contentHtml = processedData.toString(); // convert html produced to string but reserve the structure

  const blogPostWithHtml: BlogPost & { contentHtml: string } = {
    id,
    title: matterResult.data.title,
    date: matterResult.data.date,
    contentHtml,
  };

  return blogPostWithHtml;
}



// -------------------------------
// app/components/Posts.tsx  --------------------
// ------------------------------- wrapper for all posts titles
import { getSortedPostsData } from "@/lib/posts";
import ListItems from "./ListItems";

export default function Posts() {
  const posts = getSortedPostsData();

  return (
    <section className="mt-6 mx-auto max-w-2xl">
      <h2 className="text-4xl font-bold dark:text-white/90 ">Blog</h2>
      <ul className="w-full">
        {posts.map((post) => (
          <ListItems key={post.id} post={post} />
        ))}
      </ul>
    </section>
  );
}

// -------------------------------
// app/components/ListItems.tsx  --------------------
// -------------------------------
// each post title , (only the post data passed here by grayMatter) ====> with ref to each post page

import getFormattedDate from "@/lib/getFormattedDate";
import Link from "next/link";

type Props = {
  post: BlogPost;
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
// -------------------------------
// /app/posts/[postId]/not-found.tsx  --------------------
// -------------------------------

export default function NotFound() {
  return <h1>The requested post does not exist.</h1>;
}
// -------------------------------
// /app/posts/[postId]/page.tsx  --------------------
// -------------------------------

import { getPostData, getSortedPostsData } from "@/lib/posts";
import { notFound } from "next/navigation";
import getFormattedDate from "@/lib/getFormattedDate";
import Link from "next/link";
// 3
export function generateStaticParams() {
  const posts = getSortedPostsData();

  return posts.map((post) => ({
    postId: post.id,
  }));
}
 // 2
export function generateMetadata({ params }: { params: { postId: string } }) {
  const posts = getSortedPostsData();
  const { postId } = params;

  const post = posts.find((post) => post.id === postId);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  } else {
    return {
      title: post.title,
    };
  }
}
// 1
// as the parent file [postId],  postId is passed to fns inside its file as type :
// { params: { postId: string } destructed like { params }
// you have to purify html by import DOMPurify from 'dompurify'; small library search it

export default async function Post({ params }: { params: { postId: string } }) {
  const posts = getSortedPostsData();
  const { postId } = params;

  if (!posts.find((post) => post.id === postId)) notFound();

  const { title, date, contentHtml } = await getPostData(postId);

  const formattedDate = getFormattedDate(date);

  return (
    <main className="px-6 prose-xl prose-slate dark:prose-invert dark:text-gray-200 mx-auto">
      <h1 className="text-3xl mt-4 mb-0">{title}</h1>
      <p className="mt-0">{date}</p>
      <article>
        <section dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <p>
          <Link href="/">← Back to home</Link>
        </p>
      </article>
    </main>
  );
}



// -------------------------------
// package.json  --------------------
// -------------------------------
{
  "name": "blog-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@types/node": "20.6.5",
    "@types/react": "18.2.22",
    "@types/react-dom": "18.2.7",
    "autoprefixer": "10.4.16",
    "eslint": "8.50.0",
    "eslint-config-next": "13.5.2",
    "gray-matter": "^4.0.3",
    "next": "13.5.2",
    "postcss": "8.4.30",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-icons": "^4.11.0",
    "remark": "^15.0.1",
    "remark-html": "^16.0.1",
    "tailwindcss": "3.3.3",
    "typescript": "5.2.2"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.10"
  }
}

```

**===================== ================================== ----------------**
**===================== ================================== ----------------**
--------------------- ------[My-Blog-me-trying] : -- ----------------
**===================== ================================== ----------------**
**===================== ================================== ----------------**

how to add className values one variable and one static to the same tag

```tsx
<body className={`min-h-screen ${inter.className}`}>{children}</body>
```

To style the bold words within the generated page using Next.js and Tailwind CSS, you can apply custom CSS classes to those words. Here's an example of how you can achieve this:

1. Define a custom CSS class in your Tailwind CSS configuration or in a separate CSS file. You can name it something like "highlight-bold".

2. Apply the "highlight-bold" class to the bold words in your generated page by modifying the HTML string before passing it to `dangerouslySetInnerHTML`.

Here's an example code snippet assuming you have Tailwind CSS properly set up in your Next.js project:

```jsx
import React from "react";

const Post = ({ postWithHtml }) => {
  // Add the custom CSS class "highlight-bold" to the bold words
  const highlightedHtml = postWithHtml.replace(
    /<strong>(.*?)<\/strong>/g,
    '<strong class="text-red-500">$1</strong>'
  );

  return (
    <div
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      className="prose"
    />
  );
};

export default Post;
```

In this example, I've used the `text-red-500` class from Tailwind CSS to change the color to red. You can replace it with any other Tailwind CSS color class or customize it according to your needs.

Remember to import and use the `Post` component wherever you're rendering your generated page.

Note: The regular expression used in the code snippet assumes that the bold words are wrapped in `<strong>` tags. If your HTML uses a different tag or formatting for bold words, you may need to modify the regular expression accordingly.

**-------------------------------------------------------------------------------------------------------------------**

**what are the head tag metadata needed for excellent seo?** search it in gpt4:
https://www.greengeeks.com/blog/html-tags-for-seo/
https://www.greengeeks.com/blog/10-expert-backed-tips-that-will-help-you-with-local-seo-marketing/

**difference between iterable and iterator protocols**
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols

**headers.methods in nextJS**
https://nextjs.org/docs/app/api-reference/functions/headers

[Headers.entries()]
: Returns an iterator
allowing to go through all key/value pairs contained in this object.
[Headers.forEach()]
: Executes a provided function once for each key/value pair in this Headers object.
[Headers.get()]
: Returns a String
sequence of all the values of a header within a Headers object with a given name.
[Headers.has()]
: Returns a boolean stating whether a Headers object contains a certain header.
[Headers.keys()]
: Returns an iterator
allowing you to go through all keys of the key/value pairs contained in this object.
[Headers.values()]
: Returns an iterator
allowing you to go through all values of the key/value pairs contained in this object.

**cookies.methods and info**
https://nextjs.org/docs/app/api-reference/functions/cookies

**cookies().get(name)** : A method that takes a cookie name and returns an object with name and value. If a cookie with name isn't found, it returns undefined. If multiple cookies match, it will only return the first match.
**cookies().getAll()** A method that is similar to get, but returns a list of all the cookies with a matching name. If name is unspecified, it returns all the available cookies.
**cookies().has(name)** A method that takes a cookie name and returns a boolean based on if the cookie exists (true) or not (false).
**cookies().set(name, value, options)** A method that takes a cookie name, value, and options and sets the outgoing request cookie.
**cookies().delete(name)** You can explicitly delete a cookie with a given name.
**cookies().set(name, '')** Alternatively, you can set a new cookie with the same name and an empty value.
**cookies().set(name, value, { maxAge: 0 })** Setting maxAge to 0 will immediately expire a cookie.
**cookies().set(name, value, { expires: timestamp })** Setting expires to any value in the past will immediately expire a cookie

```js
import { cookies } from "next/headers";

export default function Page() {
  const cookieStore = cookies();
  return cookieStore.getAll().map((cookie) => (
    <div key={cookie.name}>
      <p>Name: {cookie.name}</p>
      <p>Value: {cookie.value}</p>
    </div>
  ));
}
// --------------------
("use server");

import { cookies } from "next/headers";

async function create(data) {
  cookies().set("name", "lee");
  // or
  cookies().set("name", "lee", { secure: true });
  // or
  cookies().set({
    name: "name",
    value: "lee",
    httpOnly: true,
    path: "/",
  });
}
// --------------------
("use server");

import { cookies } from "next/headers";

async function create(data) {
  const oneDay = 24 * 60 * 60 * 1000;
  cookies().set("name", "value", { expires: Date.now() - oneDay });
}
```

https://nextjs.org/docs/app/building-your-application/routing/route-handlers
streaming OpenAI chatgpt-3-turbo

[import-type-NextRequest-from-'next/server'] :

The NextRequest class extends the native Request object with additional convenience methods, such as headers.

```js
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get("User-Agent");
  console.log(`User agent: ${userAgent}`);
}
```

[import-{NextRequest,NextResponse}-from-'next/server']:

NextResponse is a class from the next/server package that extends the native Response object with additional convenience methods. It is used to construct and modify HTTP responses in Next.js applications.

[.redirect()] Redirects the user to a different URL.
[.rewrite()] Rewrites the request URL.
[.next()] Continues the middleware chain.
[.setHeader()] Sets an HTTP response header.
[.removeHeader()] Removes an HTTP response header.

[NextResponse] is typically used in middleware functions to modify HTTP responses before they are sent to the client. For example, you could use [NextResponse] to redirect users to a login page if they are not authenticated, or to rewrite the request URL to serve static assets from a different directory.

example for redirect in middleware if user not authenticated:

```js
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {
  if (!req.user) {
    return res.redirect("/login");
  }

  // Continue the middleware chain
  return res.next();
}
```

[request.formData()]

```ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  return NextResponse.json({ name, email });
}
```

[request.formData()] with [zod-form-data]
Since formData data are all strings, you may want to use [zod-form-data]
to validate the request and retrieve data in the format you prefer (e.g. number).

recommended to use with https://www.npmjs.com/package/zod-form-data

[alternative-to-zod] ==>>>>> [Valibot] https://www.youtube.com/watch?v=nCZ06oegzeM

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

## when making new URL(request.url)

it will look like that

```ts
const requestUrl = 'https://example.com/path/to/resource?param1=value1&param2=value2';

const url = new URL(requestUrl);

console.log(url);
//  will look like that :

URL {
  href: 'https://example.com/path/to/resource?param1=value1&param2=value2',
  origin: 'https://example.com',
  protocol: 'https:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/path/to/resource',
  search: '?param1=value1&param2=value2',
  searchParams: URLSearchParams { 'param1' => 'value1', 'param2' => 'value2' },
  hash: ''
}

// to access URLSearchParams Object:
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
const paramsString = "q=URLUtils.searchParams&topic=api";
const searchParams = new URLSearchParams(paramsString);

// Iterating the search parameters
for (const p of searchParams) {
  console.log(p);
}

console.log(searchParams.has("topic")); // true
console.log(searchParams.has("topic", "fish")); // false
console.log(searchParams.get("topic") === "api"); // true
console.log(searchParams.getAll("topic")); // ["api"]
console.log(searchParams.get("foo") === null); // true
console.log(searchParams.append("topic", "webdev"));
console.log(searchParams.toString()); // "q=URLUtils.searchParams&topic=api&topic=webdev"
console.log(searchParams.set("topic", "More webdev"));
console.log(searchParams.toString()); // "q=URLUtils.searchParams&topic=More+webdev"
console.log(searchParams.delete("topic"));
console.log(searchParams.toString()); // "q=URLUtils.searchParams"
[URLSearchParams.entries()]
[searchParams.entries()]

```

[URLSearchParams]
https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

[URLSearchParams.sort()] Sorts all key/value pairs, if any, by their keys.
[URLSearchParams.entries()]
[searchParams.entries()] Returns an iterator allowing iteration through all key/value pairs contained in this object in the same order as they appear in the query string.

[useRouter]
https://nextjs.org/docs/app/api-reference/functions/use-router

// prettier-ignore
const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
const name = e.target.name;

setData((prevData) => ({
...prevData,
[name]: e.target.value,
}));
};

## [name] this makes it dynamic how ??? chatgpt-3 turbo

Certainly! Here's an example to demonstrate how using dynamic property names can make the `handleChange` function update the state object dynamically based on the input's `name` attribute:

```jsx
const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const name = e.target.name;

  setData((prevData) => ({
    ...prevData,
    [name]: e.target.value,
  }));
};
```

Let's assume you have an input field like this:

```jsx
<input type="text" name="firstName" onChange={handleChange} />
```

When the user types into the input field, the `handleChange` function will be called. The `e.target.name` will be `'firstName'`, which is the value of the `name` attribute of the input field.

With the dynamic property name syntax `[name]` in the object spread notation, the state update will be as follows:

```jsx
setData((prevData) => ({
  ...prevData,
  firstName: e.target.value,
}));
```

This will update the `firstName` property in the `data` state object with the new value entered by the user.

Similarly, if you have another input field with a different `name` attribute, such as:

```jsx
<input type="text" name="lastName" onChange={handleChange} />
```

The `handleChange` function will handle the change event for this input field as well. The `e.target.name` will be `'lastName'`, and the state update will be:

```jsx
setData((prevData) => ({
  ...prevData,
  lastName: e.target.value,
}));
```

In this way, by using dynamic property names with the `[name]` syntax, the `handleChange` function can update the state object dynamically based on the `name` attribute of the input field. This allows you to handle multiple input fields with a single event handler and keep the state object updated with the corresponding values.

\*/
<email-validation>:
([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)_|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)_|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]\*[0-9A-Za-z]:[!-Z^-~]+)])

<email-validation>: RFC 5322:
([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)_|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'_+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)_|\[[\t -Z^-~]_])
<email-validation>: RFC 5322: improved:
([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)_|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)_|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]\*[0-9A-Za-z]:[!-Z^-~]+)])

Here are the API providers that will be reviewed below:

- Email Verification API
- ZeroBounce
- Email Checker
- Xverify
- BriteVerify
- NeverBounce
- Bulk Email Checker
- Email List Verification

([A-Z])[\w+.]{1,}

([A-Z]): Matches an uppercase letter.
[\w+.]{1,}: Matches one or more alphanumeric characters, underscores, or periods.

- The \w character class matches any alphanumeric character, including letters, numbers, and underscores.
- The + quantifier means that the previous character must appear one or more times.
- The . character matches any single character, including letters, numbers, spaces, punctuation, and symbols.
- The {1,} quantifier means that the previous character must appear one or more times.

```tsx
// -------------------------------
// app/feedback.tsx  --------------------
// -------------------------------

"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const initState = {
  name: "",
  email: "",
  message: "",
};

export default function Feedback() {
  const [data, setData] = useState(initState);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(JSON.stringify(data));
    const { name, email, message } = data;

    // Send data to API route
    const res = await fetch("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    });

    const result = await res.json();
    // console.log(result);

    // Navigate to thank you
    router.push(`/thank-you/`);
  };

  // prettier-ignore
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name;

    //[name] this makes it dynamic how explained at the nextJS.md
    // (prevData) => ({...prevData,  this is to :preserve name(prev state) while updating email 
    //also preserve name & email (prev states)while updating message
    setData((prevData) => ({
      ...prevData,
      [name]: e.target.value,
    }));
  };

  // Object.values(data)  ===>  will return an array containing the values of the properties in the data object ,
  // ya 3m el object give me arr of your values .convert <every> value to <Boolean>
  // will activate button if all values true and pattern is matched
  const canSave = [...Object.values(data)].every(Boolean);

  const content = (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mx-auto max-w-3xl p-6"
    >
      <h1 className="text-4xl mb-4">Contact Us</h1>

      <label className="text-2xl mb-1" htmlFor="name">
        Name:
      </label>
      <input
        className="p-3 mb-6 text-2xl rounded-2xl text-black"
        type="text"
        id="name"
        name="name"
        placeholder="Jane"
        pattern="([A-Z])[\w+.]{1,}"
        value={data.name}
        onChange={handleChange}
        autoFocus
      />

      <label className="text-2xl mb-1" htmlFor="email">
        Email:
      </label>
      <input
        className="p-3 mb-6 text-2xl rounded-2xl text-black"
        type="email"
        id="email"
        name="email"
        placeholder="Jane@yoursite.com"
        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        value={data.email}
        onChange={handleChange}
      />

      <label className="text-2xl mb-1" htmlFor="message">
        Message:
      </label>
      <textarea
        className="p-3 mb-6 text-2xl rounded-2xl text-black"
        id="message"
        name="message"
        placeholder="Your message here..."
        rows={5}
        cols={33}
        value={data.message}
        onChange={handleChange}
      />

      <button
        className="p-3 mb-6 text-2xl rounded-2xl text-black border-solid border-white border-2 max-w-xs bg-slate-400 hover:cursor-pointer hover:bg-slate-300 disabled:hidden"
        disabled={!canSave}
      >
        Submit
      </button>
    </form>
  );

  return content;
}

// -------------------------------
// app/thank-you.tsx  --------------------
// -------------------------------
export default function ThankYou() {
  return (
    <main>
      <h1 className="text-3xl grid place-content-center min-h-screen">
        Thank you for your feedback!
      </h1>
    </main>
  );
}

// -------------------------------
// app/api/hello/route.tsx  --------------------
// ------------------------------- static GET

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello , Next.js!" });
}

// -------------------------------
// app/api/echo/route.tsx  --------------------
// ------------------------------- Dynamic GET

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const obj = Object.fromEntries(searchParams.entries());

  return NextResponse.json({ obj, message: "hello" });
}
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const name = searchParams.get("name");
//   const job = searchParams.get("job");

//   return NextResponse.json({ name, job, message: "hello" });
// }

// -------------------------------
// app/api/feedback/route.tsx  --------------------
// -------------------------------Dynamic POST

import { NextResponse } from "next/server";

type Feedback = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const data: Feedback = await request.json();
  //   console.log(`data: `, data);

  const { name, email, message } = data;
  // process and save the data in the DB

  return NextResponse.json({ name, email, message });
}
```

remove node_modules and all dependencies :

## npm uninstall --save-dev ===>>> did not work

these two works:  
 rm -rf node_modules [<<<<<==========]
rm package-lock.json [<<<<<==========]

to activate it again

## npm install

- ===================== \***\*\*\*\***//**\*\***\*\***\*\*** ----------------
- ===================== \***\*\*\*\***//**\*\***\*\***\*\*** ----------------
  ------------------------------ \* [lesson-08] route Handlers \* : ---------
- ===================== \***\*\*\*\***//**\*\***\*\***\*\*** ----------------
- ===================== \***\*\*\*\***//**\*\***\*\***\*\*** ----------------
- ===================== --------------------------------------- \*-----------
  difference between:
  [folder] Dynamic route segment
  [...folder] Catch-all route segment
  [[...folder]] Optional catch-all route

Dynamic route segment: This is a route that is defined by adding brackets to a page.
For example, [folder] would be a dynamic route segment.
This type of route is useful when you want to create a page that
can be accessed by different URLs with different parameters.

Catch-all route segment: This is a route that is defined by adding three dots (...) inside
the brackets. For example, [...folder] would be a catch-all route segment.
This type of route is useful when you want to create a page that can handle
multiple parameters in the URL.

Optional catch-all route segments: This is a new feature introduced in Next.js 13.5.
It allows you to make catch-all routes optional by including the parameter in double
brackets ([[...folder]]). For example, [[...folder]] would be an optional catch-all
route segment. This type of route is useful when you want to create a page that can
handle multiple parameters in the URL, but also has a default behavior when no
parameters are provided.

REST API

an API key in the .env.local is usually a specific value issued by 3rd party data source when you set up an account

CRUD API in Next.js is a way to create API routes that can perform the four basic operations on data: create, read, update, and delete. These API routes are not meant for the user to request data directly, but for the app itself to reference in another function or a page. For example, if you have a page that displays a list of posts, you can use the fetch API or a library like axios to make requests to your CRUD API routes and get the data you need to render the page. Similarly, if you have a form that allows the user to create or edit a post, you can use the same methods to send data to your CRUD API routes and update the database accordingly. Therefore, CRUD API in Next.js is a way to separate your data logic from your presentation logic and make your app more modular and maintainable. You can learn more about how to use CRUD API in Next.js from their official documentation or from some tutorials that show you how to build CRUD apps with Next.js and other tools.

---

## from windows copilot

---

```tsx
//-------------------------------
// ../../lib/db.js
//-------------------------------

const mongoose = require("mongoose");

// Replace this with your actual connection string
const connectionString = "mongodb://user:password@host:port/database";

// Connect to MongoDB
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

// Export mongoose
module.exports = mongoose;
```

You can then import this db module in other files where you need to access your database. For example, in your app.js file, you can write something like this:

```tsx
// app.js
//--------------------------------------------
const db = require("./lib/db"); // Import the db module

// Create a schema for posts
const postSchema = new db.Schema({
  title: String,
  content: String,
  date: Date,
});

// Create a model for posts
const Post = db.model("Post", postSchema);

// Create a new post document and save it to the database
const post = new Post({
  title: "Hello World",
  content: "This is a test post",
  date: new Date(),
});

post
  .save()
  .then(() => {
    console.log("Post saved successfully");
  })
  .catch((err) => {
    console.error("Post save error", err);
  });
```

```tsx
// pages/api/posts.js
//-------------------------------
import db from "../../lib/db"; // a module that connects to your database
import { useServerComponent } from "next/server-component";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Get all posts from the database
      const posts = await db.getAllPosts();
      res.status(200).json(posts);
      break;
    case "POST":
      // Create a new post in the database
      const { title, content } = req.body;
      const post = await db.createPost(title, content);
      res.status(201).json(post);
      break;
    case "PUT":
      // Update an existing post in the database
      const { id } = req.query;
      const { title, content } = req.body;
      const post = await db.updatePost(id, title, content);
      res.status(200).json(post);
      break;
    case "PATCH":
      // Partially update an existing post in the database
      const { id } = req.query;
      const { title, content } = req.body;
      const post = await db.patchPost(id, title, content);
      res.status(200).json(post);
      break;
    case "DELETE":
      // Delete an existing post from the database
      const { id } = req.query;
      await db.deletePost(id);
      res.status(204).end();
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
```

```tsx
// app/posts/layout.js
//-------------------------------
import { useServerComponent } from "next/server-component";
import PostList from "./post-list.server"; // a server component that renders a list of posts

export default function PostsLayout({ children }) {
  // useServerComponent is a hook that lets you use server components inside app layouts
  // it returns a React element that can be rendered on the client or streamed to the browser
  const posts = useServerComponent(PostList);

  return (
    <div className="posts-layout">
      <div className="posts-sidebar">
        {posts} {/* this will render the PostList server component */}
      </div>
      <div className="posts-content">
        {children} {/* this will render the page component */}
      </div>
    </div>
  );
}

// app/posts/post-list.server.js
import db from "../../lib/db"; // a module that connects to your database

export default function PostList() {
  // this is a server component that fetches and renders a list of posts from the database
  // it can use any Node.js API or library without bundling or transpiling
  // it can also use React hooks and components as usual

  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    // this effect will run only on the server, not on the client
    async function fetchPosts() {
      const posts = await db.getAllPosts();
      setPosts(posts);
    }
    fetchPosts();
  }, []);

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id}>
          <a href={`/posts/${post.id}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}
```

**The difference between REST API and CRUD API**
The difference between REST API and CRUD API is that REST API is a design style for web APIs that follows certain constraints, such as using HTTP methods, uniform interfaces, and stateless communication, while CRUD API is a way to create API routes that can perform the four basic operations on data: create, read, update, and delete. REST API and CRUD API are not mutually exclusive, as they can be used together to build applications that need to manage data in a database structure. However, REST API is more than just CRUD, as it also defines how the resources are identified, represented, and manipulated by the clients and servers. CRUD API is more focused on the data manipulation functions, and does not specify how the data is structured or transferred.

To illustrate the difference between REST API and CRUD API, let's use an example of a blog application that has posts and comments as resources. A REST API for this application would use HTTP methods to perform CRUD operations on these resources, such as:

- GET /posts - Read all posts
- POST /posts - Create a new post
- GET /posts/{id} - Read a specific post
- PUT /posts/{id} - Update a specific post
- DELETE /posts/{id} - Delete a specific post
- GET /posts/{id}/comments - Read all comments for a specific post
- POST /posts/{id}/comments - Create a new comment for a specific post
- GET /comments/{id} - Read a specific comment
- PUT /comments/{id} - Update a specific comment
- DELETE /comments/{id} - Delete a specific comment

A CRUD API for this application would also use HTTP methods to perform CRUD operations on these resources, but it would not necessarily follow the same conventions as the REST API. For example, a CRUD API could use different endpoints, parameters, or formats to manipulate the data, such as:

- GET /api/posts - Read all posts
- POST /api/posts/create - Create a new post
- GET /api/posts/read/{id} - Read a specific post
- POST /api/posts/update/{id} - Update a specific post
- POST /api/posts/delete/{id} - Delete a specific post
- GET /api/comments?post={id} - Read all comments for a specific post
- POST /api/comments/create?post={id} - Create a new comment for a specific post
- GET /api/comments/read/{id} - Read a specific comment
- POST /api/comments/update/{id} - Update a specific comment
- POST /api/comments/delete/{id} - Delete a specific comment

As you can see, the REST API and the CRUD API have different ways of designing the API routes, even though they both perform the same functions on the data. The REST API follows a more consistent and standardized approach, while the CRUD API has more flexibility and customization. Both have their advantages and disadvantages, depending on the needs and preferences of the developers and users.

If you want to learn more about the difference between REST API and CRUD API, you can check out some of these articles¹²³ that explain them in more detail.

Source: Conversation with Bing, 10/2/2023
(1) CRUD vs. REST: What's the Difference? | Nordic APIs. https://nordicapis.com/crud-vs-rest-whats-the-difference/.
(2) What's the Difference between CRUD and REST? - Abstract API. https://www.abstractapi.com/guides/crud-vs-rest.
(3) Ultimate CRUD vs REST Guide: Operations Simplified 101 - Hevo Data. https://hevodata.com/learn/crud-vs-rest/.

```ts
//-------------------------------
// src/app/api/todos/route.js
//-------------------------------
import { NextResponse } from "next/server";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos";
const API_KEY: string = process.env.DATA_API_KEY as string;

export async function GET() {
  const res = await fetch(DATA_SOURCE_URL); // res will be  [ ]
  const allTodos: Todo[] = await res.json(); //this json to: parse the res ===> { [ ] }

  return NextResponse.json(allTodos); //this json to: stringify it
}

export async function POST(request: Request) {
  const { userId, title }: Partial<Todo> = await request.json();

  if (!title || !userId)
    return NextResponse.json({ message: "Messing required Data" });

  const res = await fetch(DATA_SOURCE_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      API_KEY: API_KEY,
    },
    body: JSON.stringify({
      title,
      userId,
      completed: false,
    }),
  });
  const newTodo: Todo = await res.json();
  return NextResponse.json(newTodo);
}

export async function PUT(request: Request) {
  const { userId, id, title, completed }: Todo = await request.json();

  if (!title || !userId || !id || typeof completed !== "boolean")
    return NextResponse.json({ message: "Messing required Data" });

  const res = await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      API_KEY: API_KEY,
    },
    body: JSON.stringify({
      title,
      userId,
      completed,
    }),
  });
  const updatedTodo: Todo = await res.json();
  return NextResponse.json(updatedTodo);
}

export async function DELETE(request: Request) {
  const { id }: Partial<Todo> = await request.json();

  if (!id) return NextResponse.json({ message: "Todo id is required" });

  await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      API_KEY: API_KEY,
    },
  });
  return NextResponse.json({ message: `Todo ${id} deleted` });
}

//-------------------------------
// src/app/api/todos/[id]/route.js
//-------------------------------

import { NextResponse } from "next/server";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos";

type Props = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  // const id = await request.url.slice(request.url.lastIndexOf("/") + 1);

  console.log(id);
  const res = await fetch(`${DATA_SOURCE_URL}/${id}`);
  const todo: Todo = await res.json();

  if (!todo.id) return NextResponse.json({ message: "not Found" });

  return NextResponse.json(todo);
}
```

**===================== ================================== ----------------**
**===================== ================================== ----------------**
--------------------=== == [lesson-09] : [Middleware] ==== ===-------------
**===================== ================================== ----------------**
**===================== ================================== ----------------**

https://nextjs.org/docs/app/building-your-application/routing/middleware

Can have modifiers on named parameters (starting with :): /about/:path\* matches /about/a/b/c because

- is zero or more.
  ? is zero or one
  and + one or more

```ts
//-------------------------------
// src/middleware.js   this is wrong (dave) , the right one is bellow it
//-------------------------------

import { NextResponse } from "next/server";

export default function middleware(request: Request) {
  console.log("middleware!"); // middleware!
  console.log(request.method); //  GET
  console.log(request.url); //  http://localhost:3000/
  console.log(request.headers);
  console.log("##");

  const origin = request.headers.get("origin");
  console.log("origin:", origin);

  return NextResponse.next();
}
```

```ts
//-------------------------------
// src/middleware.js ====================the right one
//-------------------------------
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? ["https://www.mysite.com", "https://mysite.com"]
    : ["http://localhost:3000"];

export function middleware(request: NextRequest) {
  // const regex = new RegExp('/api/*')
  // if (regex.test(request.url)){}
  const origin = request.headers.get("origin");
  console.log("origin:", origin);

  // some app like test apps has no origin , so to test leave it like that
  // but in production if (origin && !allowedOrigin.includes(origin) || !origin) {
  // so to block any app even apps without origin also block browser requests if not limited in the config matcher
    if (origin && !allowedOrigin.includes(origin)) {
      return new NextResponse(null, {
        status: 400,
        statusText: "bad request",
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

  console.log("middleware!"); // middleware!
  console.log(request.method); //  GET
  console.log(request.url); // http://localhost:3000/api/todos
  console.log(request.nextUrl.pathname);
  console.log(request);

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};




//-------------------------------
//-------------------------------
//-------------------------------




Headers {
  [Symbol(headers list)]: HeadersList {
        cookies: null,
        [Symbol(headers map)]: Map(13) {
          'accept' => { name: 'accept', value: '*/*' },
          'accept-encoding' => { name: 'accept-encoding', value: 'gzip, deflate, br' },
          'accept-language' => {
            name: 'accept-language',
            value: 'en-US,en-GB;q=0.9,en;q=0.8,ar-SA;q=0.7,ar-EG;q=0.6,ar;q=0.5'
          },
          'connection' => { name: 'connection', value: 'keep-alive' },
          'host' => { name: 'host', value: 'localhost:3000' },
          'referer' => { name: 'referer', value: 'http://localhost:3000/' },
          'sec-ch-ua' => {
            name: 'sec-ch-ua',
            value: '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"'
          },
          'sec-ch-ua-mobile' => { name: 'sec-ch-ua-mobile', value: '?0' },
          'sec-ch-ua-platform' => { name: 'sec-ch-ua-platform', value: '"Windows"' },
          'sec-fetch-dest' => { name: 'sec-fetch-dest', value: 'script' },
          'sec-fetch-mode' => { name: 'sec-fetch-mode', value: 'no-cors' },
          'sec-fetch-site' => { name: 'sec-fetch-site', value: 'same-origin' },
          'user-agent' => {
          name: 'user-agent',
          value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
        }
      },
      [Symbol(headers map sorted)]: [
              [ 'accept', '*/*' ],
              [ 'accept-encoding', 'gzip, deflate, br' ],
              [
              'accept-language',
              'en-US,en-GB;q=0.9,en;q=0.8,ar-SA;q=0.7,ar-EG;q=0.6,ar;q=0.5'
            ],
              [ 'connection', 'keep-alive' ],
              [ 'host', 'localhost:3000' ],
              [ 'referer', 'http://localhost:3000/' ],
              [
              'sec-ch-ua',
              '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"'
            ],
              [ 'sec-ch-ua-mobile', '?0' ],
              [ 'sec-ch-ua-platform', '"Windows"' ],
              [ 'sec-fetch-dest', 'script' ],
              [ 'sec-fetch-mode', 'no-cors' ],
              [ 'sec-fetch-site', 'same-origin' ],
              [
              'user-agent',
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
            ]
        ]
  },
    [Symbol(guard)]: 'request',
          [Symbol(realm)]: {
                settingsObject: {
                baseUrl: undefined,
                origin: [Getter],
                policyContainer: { referrerPolicy: 'strict-origin-when-cross-origin' }
              }
        }
}
------------------------------------------------------

request: {
  cookies: RequestCookies {},
  geo: {},
  ip: undefined,
  nextUrl: {
        href: 'http://localhost:3000/api/todos',
        origin: 'http://localhost:3000',
        protocol: 'http:',
        username: '',
        password: '',
        host: 'localhost:3000',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/todos',
        search: '',
        searchParams: <ref *1> URLSearchParams {
              [Symbol(query)]: [],
              [Symbol(context)]: URL {
                  [Symbol(context)]: URLContext {
                        href: 'http://localhost:3000/api/todos',
                        origin: 'http://localhost:3000',
                        protocol: 'http:',
                        hostname: 'localhost',
                        pathname: '/api/todos',
                        search: '',
                        username: '',
                        password: '',
                        port: '3000',
                        hash: ''
                  },
                  [Symbol(query)]: [Circular *1]
              }
        },
        hash: ''
    },
  url: 'http://localhost:3000/api/todos',
  bodyUsed: false,
  cache: 'default',
  credentials: 'same-origin',
  destination: '',
  headers: {
          accept: '*/*',
          accept-encoding: 'gzip, deflate, br',
          connection: 'close',
          host: 'localhost:3000',
          user-agent: 'Thunder Client (https://www.thunderclient.com)'
    },
  integrity: '',
  keepalive: false,
  method: 'GET',
  mode: 'cors',
  redirect: 'follow',
  referrer: 'about:client',
  referrerPolicy: '',
  signal: AbortSignal {
          [Symbol(kEvents)]: SafeMap(0) {},
          [Symbol(events.maxEventTargetListeners)]: 10,
          [Symbol(events.maxEventTargetListenersWarned)]: false,
          [Symbol(kAborted)]: false,
          [Symbol(kReason)]: undefined,
          [Symbol(kOnabort)]: undefined,
          [Symbol(realm)]: {
              settingsObject: {
                  baseUrl: undefined,
                  origin: [Getter],
                  policyContainer: { referrerPolicy: 'strict-origin-when-cross-origin' }
            }
        }
    }
}


```

**npm i limiter**
**has to be added to route.ts not middleware.ts in NextJs as it depend on node and NextJs uses edge runtime so will give error with middleware.ts**
[Cors]
https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cors
https://nextjs.org/docs/app/api-reference/file-conventions/route

```ts
//-------------------------------
// src/middleware.js =======>>>>>>  dave code ===> don't go with this one
//-------------------------------

import { NextResponse } from "next/server";
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? ["https://www.mysite.com", "https://mysite.com"]
    : ["http://localhost:3000"];

export default function middleware(request: Request) {
  // const regex = new RegExp('/api/*')
  // if (regex.test(request.url)){}
  const origin = request.headers.get("origin");
  console.log("origin:", origin);

  // some app like test apps has no origin , so to test leave it like that
  // but in production if (origin && !allowedOrigin.includes(origin) || !origin) {
  // so to block any app even apps without origin also block browser requests if not limited in the config matcher
  if (origin && !allowedOrigin.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: "bad request",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  console.log("middleware!"); // middleware!
  console.log(request.method); //  GET
  console.log(request.url); //  http://localhost:3000/

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};

//-------------------------------
// src/middleware.js =======>>>>>>  deca code ===> with docs
//-------------------------------

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? ["https://www.mysite.com", "https://mysite.com"]
    : ["http://localhost:3000"];

export function middleware(request: NextRequest) {
  // const regex = new RegExp('/api/*')
  // if (regex.test(request.url)){}
  const origin = request.headers.get("origin");
  console.log("origin:", origin);

  // some app like test apps has no origin , so to test leave it like that
  // but in production if (origin && !allowedOrigin.includes(origin) || !origin) {
  // so to block any app even apps without origin also block browser requests if not limited in the config matcher

  if (origin && !allowedOrigin.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: "bad request",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  console.log("middleware!"); // middleware!
  console.log(request.method); //  GET
  console.log(request.url); // http://localhost:3000/api/todos
  console.log(request.nextUrl.pathname); // /api/todos

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
//-------------------------------
// src/app/api/todos/route.ts
//------------------------------- only the Get function here the rest the same

import { NextResponse } from "next/server";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos";
const API_KEY: string = process.env.DATA_API_KEY as string;

export async function GET(request: Request) {
  const origin = request.headers.get("origin");

  const res = await fetch(DATA_SOURCE_URL); // res will be  [ ]
  const allTodos: Todo[] = await res.json(); //this json to: parse the res ===> { [ ] }

  // return NextResponse.json(allTodos); //this json to: stringify it
  return new NextResponse(JSON.stringify(allTodos), {
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Content-Type": "application/json",
    },
  });
}

//-------------------------------
// src/app/api/config/limiter.ts
//------------------------------- reference will be in route.ts not middleware.ts

import { RateLimiter } from "limiter";

export const limiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: "min",
  fireImmediately: true,
});

//-------------------------------
// src/app/api/hello/route.ts
//-------------------------------

import { limiter } from "../config/limiter";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const remaining = await limiter.removeTokens(1);

  const origin = request.headers.get("origin");

  console.log("Remaining Token", remaining);
  if (remaining < 0) {
    // first param is body ==>here there is no body to json it
    return new NextResponse(null, {
      status: 429,
      statusText: "Too many Requests",
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Content-Type": "text/plain",
      },
    });
  }
  return NextResponse.json({ message: "Hello, Next JS" });
}
```

it is not in the course but from the docs middleware basics:
to do redirect()
to do rewrite()
to do authentication (security)
to do cors config
to do modify req or res headers
to do respond directly if error

https://nextjs.org/docs/app/building-your-application/routing/middleware

```ts
--------------------------here opening example

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*',
}

There are two ways to define which paths Middleware will run on:
------------------------------------------------------------------

--------------------------1- matcher control Options
//----- one path

export const config = {
  matcher: '/about/:path*',
}

//----- multiple paths

export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}



--------------------------2- conditional statements

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
/*
https://example.com/blog/hello-world and the first argument is /about-2,
 the new URL object will be https://example.com/about-2.
 The rewrite method then rewrites the request to this new URL object
 while preserving the original URL.


 Redirect will reroute to a new page and show the URL changes,
 while rewrite will map an incoming request path to a different
 destination path and mask the URL, making it appear the user hasn’t
 changed their location on the site. For example, if you have a redirect
 from /about to /home, the browser will show /home in the address bar.
 But if you have a rewrite from /about to /home, the browser will show /about
 in the address bar, even though the content of /home is displayed
*/
```

**NextRequest and NextResponse**
https://nextjs.org/docs/pages/api-reference/functions/next-server

<can you write a code for connecting to OpenWeatherMap API using nextJs 13.5?>

```ts
------------------------------
// app/api/weather/route.ts
------------------------------
import { NextResponse } from 'next/server'

// Define your API key and base URL for OpenWeatherMap API
const API_KEY = 'your_api_key_here'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Export a GET function : that takes a query parameter for the city name
export async function GET({ query }) {
  // Get the city name from the query parameter
  const city = query.get('city')

  // If the city name is not provided, return an error response
  if (!city) {
    return NextResponse.json({ error: 'City name is required' })
  }

  // Construct the URL for the current weather endpoint
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`

  // Fetch the data from the OpenWeatherMap API
  const response = await fetch(url)
  const data = await response.json()

  // If the API returns an error, return an error response
  if (data.cod !== 200) {
    return NextResponse.json({ error: data.message })
  }

  // Otherwise, return a success response with the weather data
  return NextResponse.json({ data })
}



```

```tsx
------------------------------
// pages/weather.tsx
------------------------------


import { GetServerSideProps } from 'next'

// Define a type for the weather data
type WeatherData = {
  data: {
    name: string
    main: {
      temp: number
      feels_like: number
      humidity: number
    }
    weather: [
      {
        description: string
        icon: string
      }
    ]
  }
}

// Define a type for the page props
type WeatherProps = {
  weatherData: WeatherData | null
  error: string | null
}

// Define a page component that renders the weather data or an error message
export default function Weather({ weatherData, error }: WeatherProps) {
  // If there is an error, return a message
  if (error) {
    return <div>{error}</div>
  }

  // If there is no weather data, return a message
  if (!weatherData) {
    return <div>No weather data</div>
  }

  // Destructure the weather data
  const { name, main, weather } = weatherData.data

  // Return a JSX element that displays the weather data
  return (
    <div>
      <h1>Weather for {name}</h1>
      <p>Temperature: {main.temp} °C</p>
      <p>Feels like: {main.feels_like} °C</p>
      <p>Humidity: {main.humidity} %</p>
      <p>Description: {weather[0].description}</p>
      <img src={`https://openweathermap.org/img/w/${weather[0].icon}.png`} alt="Weather icon" />
    </div>
  )
}

// Define a getServerSideProps function that fetches the weather data from the API route
export const getServerSideProps: GetServerSideProps<WeatherProps> = async (context) => {
  // Get the city name from the query parameter
  const city = context.query.city as string

  // If the city name is not provided, return an error prop
  if (!city) {
    return {
      props: {
        weatherData: null,
        error: 'City name is required',
      },
    }
  }

  // Construct the URL for the API route that connects to OpenWeatherMap API
  const url = `http://localhost:3000/api/weather?city=${city}`

  // Fetch the data from the API route
  const response = await fetch(url)
  const data = await response.json()

  // If the API route returns an error, return an error prop
  if (data.error) {
    return {
      props: {
        weatherData: null,
        error: data.error,
      },
    }
  }

  // Otherwise, return a weatherData prop with the fetched data
  return {
    props: {
      weatherData: data,
      error: null,
    },
  }
}



```

**===================== ================================== ----------------**
**===================== ================================== ----------------**
-----------------=== = [enviroment-values] : <[.env.local]> = ===----------
**===================== ================================== ----------------**
**===================== ================================== ----------------**
https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

**===================== ================================== ----------------**
**===================== ================================== ----------------**
--------------------=== = [lesson-10] : <[Revalidation]> = ===-------------
**===================== ================================== ----------------**
**===================== ================================== ----------------**
in lesson 8 blogPost how to apply ISR so website does not need to build every time a post is added
use ISR with or without fetch
also will work for fetch with headless (Content Management Services) CMS
Some popular headless CMSs include: search them
Contentful ===> has one project free
Prismic ===> has one project free
Strapi xx
DatoCMS ===> maybe one project free
TinaCMS ===> has one project free

Revalidation

## in the docs it is under ===>> Data Fetching, Caching, and Revalidating

https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating

## dynamic params with generateStaticParams , also dynamic revalidate

https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config

## key points: two ways to validate either

1- time-based : Automatically revalidate data after a certain amount of time has passed
2- On-demand : Manually revalidate data based on an event (e.g. form submission), or data from CMS
dynamicParams default : true
revalidate default: false

The revalidate option is only available when using the Node.js Runtime. (browser)
This means using the revalidate option with runtime = 'edge' will not work. (nextJs)

## # to generate secret token in the .env.local

node require('crypto').randomBytes(16).toString('hex') // '01b9e7ed45c5b224d020f05fd029d6d8'

lesson 6 blogPost:

```tsx
------------------------------
// .env.local
------------------------------
MY_SECRET_TOKEN=decalearnnextjs
// comment here start with # , it has to be  ===>  lastLetter=firstLetter

------------------------------
// app/api/revalidate/route.ts
------------------------------

// from docs:  https://<your-site.com>/api/revalidate?tag=collection&secret=<token>

// will be https    localhost:3000   <token>: 01b9e7ed45c5b224d020f05fd029d6d8 or '01b9e7ed45c5b224d020f05fd029d6d8'
// url to thunder : http://localhost:3000/api/revalidate?path=/&secret=decalearnnextjs


// gary for next v.13.3 did not work for me:

// import { NextApiRequest, NextApiResponse } from "next";
// // import { revalidatePath } from "next/cache";

// export default async function GET(req: NextApiRequest, res: NextApiResponse) {
//   if (req.query.secret !== process.env.MY_SECRET_TOKEN)
//     return res.status(401).json({ message: "Invalid Token" });

//   const path = req.query.path as string;

//   await res.revalidate(path);

//   return res.json({
//     revalidated: true,
//     message: "validate done",
//     at: Date.now(),
//   });
// }
------------------------------------------
// exact from docs : minor addition

import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  if (!path) {
    return Response.json({ message: "Missing path param" }, { status: 400 });
  }

  if (
    request.nextUrl.searchParams.get("secret") !== process.env.MY_SECRET_TOKEN
  ) {
    return Response.json({ message: "Invalid Token" }, { status: 401 });
  }

  revalidatePath(path);

  return Response.json({ revalidated: true, now: Date.now() });
}

// to validate th code is working
// npm run build
// npm start
// move new.md to blogPost file
// thunderClient add the url to thunder above
// make it post request , you will see path an secret value already added to query
// worked in thunder but the browser did not validate and did not show the new blog
// make fn above GET , make build again , start again , thunder good  browser good.
```

**===================== ================================== ----------------**
**===================== ================================== ----------------**
--------------------=== = [lesson-12] : <[final-project]>= ===-------------
**===================== ================================== ----------------**
**===================== ================================== ----------------**

## -----------------------uploaded mdx files to github---------------------------

## 1- make a repo on github ==> always without without readme file

## 2- git bash - navigate to folder

## 3- git init

## 4- git add . ===> to add all files and folders inside

## 5- git commit -m "message"

## 6- git push <remote url> <main or branch name>

ex: git push https://github.com/the-dev-syntax/next-dave-final-project.git main

## 7- if it didn't work , git pull

## 8- if it didn't work , git pull https://github.com/the-dev-syntax/next-dave-final-project.git main --allow-unrelated-histories

## 8- if it didn't work , git pull https://github.com/the-dev-syntax/myBlogLesson.git main --allow-unrelated-histories

## 9- git push <remote url> <main or branch name>

ex: git push https://github.com/the-dev-syntax/next-dave-final-project.git main

## go to my image icon on the github page in the top right ==> settings ==> down down left menu ==> developer settings ==> Personal access tokens ==> tokens classic ==> big button => generate new token ==> new token classic ==> confirm password(maybe) ==> note like a title : testToken ==> under expiration : no expiration , select scope : public_repo ==> down down => generate token ===> you will see this token once [copy] it

testToke : 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

above <Post /> in page.tsx {/_ @ts-expect-error Server Component _/}
remove &apos; in the I&apos;m =>> make it ==> I'm Deca in page.tsx  
to do so will add a rule in .eslintrc.json ===> from the docs
{
"extends": "next/core-web-vitals",  
 "rules": {
"react/no-escaped-entities": "off"
}
}

## Github API Documentation: to make a fetch :

https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28

## [return-object-from-github]example:

{
"sha": "cd8274d15fa3ae2ab983129fb037999f264ba9a7",
"url": "https://api.github.com/repos/octocat/Hello-World/trees/cd8274d15fa3ae2ab983129fb037999f264ba9a7",
"tree": [ ===> this will contain object for each file inside
{
"path": "file.rb",
"mode": "100644",
"type": "blob",
"size": 132,
"sha": "7c258a9869f33c1e1e1f74fbb32f07c86cb5a75b",
"url": "https://api.github.com/repos/octocat/Hello-World/git/blobs/7c258a9869f33c1e1e1f74fbb32f07c86cb5a75b"
}
],
"truncated": true
}

Sure. Here is a link to a documentation on how to make a function like the one you provided:

Fetching data from a repository: https://docs.github.com/en/rest/repos/contents: https://docs.github.com/en/rest/repos/contents

This page provides detailed information on how to use the GitHub REST API to fetch data from a repository. You can use this information to write a function in VS Code to fetch repo data.

Here is a breakdown of the function that you provided:
JavaScript

```ts
export async function getPostByName(fileName: string): Promise<BlogPost | undefined> {
  const res = await fetch(`https://raw.githubusercontent.com/gitdagray/test-blogposts/main/${fileName}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }
  })
```

Use code with caution. Learn more

[export] - This keyword makes the function available to other modules.
[async] - This keyword tells JavaScript that the function is asynchronous. This means that the function can return a promise, which is a way to represent the eventual completion (or failure) of an asynchronous operation.
[getPostByName] - This is the name of the function.
[fileName] - This is the parameter for the function. It is the name of the file that you want to fetch.
Promise<BlogPost | undefined> - This is the return type of the function. It means that the function will return a promise that resolves to a BlogPost object or undefined.
[fetch()] - This function is used to fetch data from a remote server.
https://raw.githubusercontent.com/gitdagray/test-blogposts/main/${fileName} - This is the URL of the repository that you want to fetch the file from.
{ headers: { Accept: 'application/vnd.github+json', Authorization:Bearer ${process.env.GITHUB_TOKEN}, 'X-GitHub-Api-Version': '2022-11-28', } } - This is an object that contains the headers for the fetch request. The Accept header tells the server what type of response you expect. The Authorization header is used to authenticate with the GitHub server. The X-GitHub-Api-Version header tells the server which version of the GitHub API you are using.

The [fetch()] function will return a promise that resolves to a response object. The response object contains the data from the server. You can then use the json() method to parse the response data into a JavaScript object.

In the function that you provided, you are using the json() method to parse the response data into a BlogPost object. If the response data cannot be parsed into a BlogPost object, the json() method will return undefined.

The function that you provided is a good example of how to use the GitHub REST API to fetch data from a repository. You can use this function as a starting point to write your own functions to fetch different types of data from GitHub.

## "https://api.github.com/repos/gitdagray/<repo name>/git/trees/<branch(main)>?recursive=1",

[MDX]
https://nextjs.org/docs/app/building-your-application/configuring/mdx ====> it is this one

https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins all rehype plugins

all in npm also in github:
[rehype-highlight] — syntax highlight code blocks with Highlight.js via lowlight ===>etfooo 3ala omo
[rehype-pretty-code] replace highlight.js https://rehype-pretty-code.netlify.app/
[rehype-slug] — add ids to headings
[rehype-autolink-headings] — add links to headings to them selfs , content to insert in the link, if behavior is not 'wrap'

to show raw data link in github , go into the individual file then top right ==> raw

!error in Mistake: again regex of /\.mdx$/

install dependencies :
npm i highlight.js rehype-highlight rehype-slug rehype-autolink-headings
npm install rehype-pretty-code shiki
https://rehype-pretty-code.netlify.app/

npm i @tailwindcss/aspect-ratio@latest -D

remote images next documentations:
https://nextjs.org/docs/pages/building-your-application/optimizing/images#remote-images

## with [remote-images] ==> image [custom-component] ([Image]) from "next/image" + [config] next.config.js + add in [compilerMDX]

## with youtube [videos] ==> video [components] [iframe] + add in [compilerMDX] + package from tailwind [aspect-ratio]

```ts
app / page.js:

import Image from "next/image";

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
}

next.config.js:

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/my-bucket/**",
      },
    ],
  },
};
```

## npm i sharp

recommended by next for the images at production time

## npm i next-sitemap

recommended by next for SEO at production time

create file ==> next-sitemap.config.js

```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
};

// process.env.SITE_URL ====> at production will be your .com
// also put SITE_URL in .env.local
```

## add this line in package.json "scripts" ===> "postbuild": "next-sitemap"

"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"postbuild": "next-sitemap"
},

change revalidate value in all pages.tsx
