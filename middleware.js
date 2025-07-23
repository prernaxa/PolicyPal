// middleware.js or src/middleware.js
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Apply the middleware only to these routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/api/(.*)"],
};
