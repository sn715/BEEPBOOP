import { Redirect } from "expo-router";

// There are no saved accounts in the demo, so every launch starts at the beginning.
export default function Index() {
  return <Redirect href="/welcome" />;
}
