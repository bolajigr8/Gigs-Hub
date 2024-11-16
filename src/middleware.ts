import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

//  any request matching these routes will require authentication.

const isProtectedRoute = createRouteMatcher([
  '/onboard(.*)',
  '/jobs(.*)',
  '/activity(.*)',
  '/membership(.*)',
  '/account(.*)',
  // any of their subpaths, indicated by (.*) are also marked as protected.
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
