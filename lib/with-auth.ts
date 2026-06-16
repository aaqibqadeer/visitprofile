import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

type Role = "admin" | "user";

type AuthProps = {
  user: { id: string; email: string; role: Role };
};

type Handler<P> = (
  ctx: GetServerSidePropsContext,
  user: AuthProps["user"]
) => Promise<GetServerSidePropsResult<P>>;

/** Wrap getServerSideProps with auth + role check. Redirects to /login if no session. */
export function withAuth<P extends Record<string, unknown>>(
  requiredRole: Role | null,
  handler: Handler<P>
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P & AuthProps>> => {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return ctx.req.cookies
              ? Object.entries(ctx.req.cookies).map(([name, value]) => ({ name, value: value ?? "" }))
              : [];
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              ctx.res.setHeader(
                "Set-Cookie",
                `${name}=${value}; Path=/; HttpOnly; SameSite=Lax${options?.secure ? "; Secure" : ""}`
              );
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        redirect: {
          destination: `/login?next=${encodeURIComponent(ctx.resolvedUrl)}`,
          permanent: false,
        },
      };
    }

    const role = ((user as User).user_metadata as { role?: string })?.role as Role | undefined;

    if (requiredRole && role !== requiredRole) {
      return {
        redirect: {
          destination: role === "admin" ? "/admin" : "/dashboard",
          permanent: false,
        },
      };
    }

    const result = await handler(ctx, {
      id: user.id,
      email: user.email ?? "",
      role: role ?? "user",
    });

    if ("props" in result) {
      return {
        ...result,
        props: {
          ...(result.props instanceof Promise ? await result.props : result.props),
          user: { id: user.id, email: user.email ?? "", role: role ?? "user" },
        },
      } as GetServerSidePropsResult<P & AuthProps>;
    }

    return result as GetServerSidePropsResult<P & AuthProps>;
  };
}
