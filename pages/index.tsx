import { defaultUser } from "@/data/users";
import { ProfileScreen } from "@/components/profile/profile-screen";

/** Site root renders the first user. Individual profiles live at /<slug>. */
export default function Home() {
  return <ProfileScreen profile={defaultUser} />;
}
