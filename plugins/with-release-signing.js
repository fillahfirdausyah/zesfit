// Signs release builds with keystore/keystore.properties when that file exists (it is gitignored).
// Without it, release builds keep Expo's default debug signing so CI and fresh clones still build.
const { withAppBuildGradle } = require('expo/config-plugins');

const MARKER = '// zesfit-release-signing';

const LOAD_PROPERTIES = `${MARKER}
def zesfitKeystoreProperties = new Properties()
def zesfitKeystoreFile = rootProject.file("../keystore/keystore.properties")
if (zesfitKeystoreFile.exists()) {
    zesfitKeystoreFile.withInputStream { zesfitKeystoreProperties.load(it) }
}
`;

const RELEASE_CONFIG = `
        release {
            if (zesfitKeystoreFile.exists()) {
                storeFile file(zesfitKeystoreProperties['storeFile'])
                storePassword zesfitKeystoreProperties['storePassword']
                keyAlias zesfitKeystoreProperties['keyAlias']
                keyPassword zesfitKeystoreProperties['keyPassword']
            }
        }`;

function applySigning(gradle) {
  if (gradle.includes(MARKER)) return gradle;

  let out = gradle.replace(/^android \{/m, `${LOAD_PROPERTIES}\nandroid {`);

  // Add a release signing config next to Expo's debug one.
  out = out.replace(/signingConfigs \{(\s*)debug \{/, (match, ws) => `signingConfigs {${RELEASE_CONFIG}${ws}debug {`);

  // Point the release build type at it when the keystore is present.
  out = out.replace(
    /(release \{[^}]*?)signingConfig signingConfigs\.debug/,
    '$1signingConfig zesfitKeystoreFile.exists() ? signingConfigs.release : signingConfigs.debug',
  );

  if (!out.includes('signingConfigs.release')) {
    throw new Error('with-release-signing: app/build.gradle layout changed; release signing not applied');
  }
  return out;
}

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    cfg.modResults.contents = applySigning(cfg.modResults.contents);
    return cfg;
  });
};
