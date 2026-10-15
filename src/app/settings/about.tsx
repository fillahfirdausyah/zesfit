import Constants from 'expo-constants';

import { KeyValue } from '@/components/KeyValue';
import { Section, Screen } from '@/components/Screen';
import { Notice } from '@/components/States';

export default function AboutScreen() {
  return (
    <Screen>
      <Section title="Zesfit" icon="information-circle">
        <KeyValue icon="phone-portrait" label="App" value="Zesfit" />
        <KeyValue icon="pricetag" label="Version" value={Constants.expoConfig?.version ?? null} />
        <KeyValue icon="document-text" label="License" value="AGPL-3.0-or-later" />
        <Notice icon="lock-closed">
          Watch data stays on this phone in zesfit.db. Weather, if switched on, sends rounded coordinates to
          Open-Meteo.
        </Notice>
      </Section>
    </Screen>
  );
}
