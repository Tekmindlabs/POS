import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log("Middleware triggered for path:", req.nextUrl.pathname);
    console.log("Session present:", !!session);

    if (error) {
      console.error("Middleware session error:", error);
    }

    // If no session and trying to access protected routes
    if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
      console.log("Redirecting to login - no session");
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // If session exists and trying to access auth routes
    if (session && req.nextUrl.pathname.startsWith('/auth')) {
      console.log("Redirecting to dashboard - has session");
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};