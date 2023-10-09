/* my code :
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
*/
// to validate th code is working
// npm run build
// npm start
// move new.md to blogPost file
// thunderClient add the url to thunder above
// make it post request , you will see path an secret value already added to query
// worked in thunder but the browser did not validate and did not show the new blog
// make fn above GET , make build again , start again , thunder good  browser good.

// dave new code :

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return new NextResponse(JSON.stringify({ message: "Invalid Token" }), {
      status: 401,
      statusText: "Unauthorized",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const path = request.nextUrl.searchParams.get("path") || "/";

  revalidatePath(path);

  return NextResponse.json({ revalidated: true });
}
