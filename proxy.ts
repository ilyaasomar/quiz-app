import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  //   authentication path is here
  const isAuthPath = path === "/auth/sign-in" || path === "/auth/sign-up";
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const token = session?.session.token;
    console.log(token);

    // check if the token exist
    if (session && !token) {
      const response = NextResponse.redirect(
        new URL("/auth/sign-in", request.nextUrl)
      );
      response.cookies.delete("better-auth.session_token");
      return response;
    }

    // check if user already login
    if (isAuthPath && token) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    // Redirect non-authenticated users away from protected pages
    if (!isAuthPath && !token) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Session error", error);
  }
}

export const config = {
  matcher: [
    "/",
    "/quiz",
    "/questions",
    "/options",
    "/attempts",
    "/results",
    "/account/settings",
    "/auth/sign-in",
    "/auth/sign-up",
  ],
};
