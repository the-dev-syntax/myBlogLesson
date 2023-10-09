import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  priority?: string;
};

export default function CustomImage({ src, alt, priority }: Props) {
  const p = priority ? true : false;

  return (
    <div className="w-full h-full">
      <Image
        className="rounded-lg mx-auto"
        src={src}
        alt={alt}
        width={650}
        height={650}
        priority={p}
      />
    </div>
  );
}
// this will be called from mdx file as
// <customImage scr="full url from github" alt="any title" priority="true if it is the main one" />
//*  add in [compilerMDX] ,add in next.config.js
//? remote image:===>  add configuration to next.config.js , ref to docs .
