import { Redirect } from 'expo-router';

/** Today is the home tab now; `zesfit:///today` keeps working. */
export default function TodayRedirect() {
  return <Redirect href="/" />;
}
