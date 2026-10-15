import { Redirect } from 'expo-router';

/** Watch faces live under the Watch tab; `zesfit:///watchfaces` keeps working. */
export default function WatchfacesRedirect() {
  return <Redirect href="/watch/faces" />;
}
