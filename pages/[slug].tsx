import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { getAllSlugs, getUser } from "@/data/users";
import { ProfileScreen } from "@/components/profile/profile-screen";

/**
 * /user1, /user2, … — one statically-generated page per profile.
 *
 * Only the `slug` travels through `getStaticProps` (the profile holds React
 * components for icons, which aren't JSON-serialisable). The profile itself is
 * resolved from the bundled registry at render time — works at build and on the
 * client alike.
 */
export default function UserPage({ slug }: InferGetStaticPropsType<typeof getStaticProps>) {
  const profile = getUser(slug);
  if (!profile) return null;
  return <ProfileScreen profile={profile} />;
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: getAllSlugs().map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ slug: string }> = ({ params }) => {
  const slug = String(params?.slug);
  if (!getUser(slug)) return { notFound: true };
  return { props: { slug } };
};
