import type { ConfigPlugin } from '@expo/config-plugins';
// eslint-disable-next-line
import { withDangerousMod } from '@expo/config-plugins';
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
} from 'fs';
import { basename, join } from 'path';

export const androidFolderPath = ['app', 'src', 'main', 'assets'];

export async function copyFolderRecursiveSync(source: string, target: string) {
  if (!existsSync(target)) mkdirSync(target);

  const files = readdirSync(source);

  files.forEach(async (file) => {
    const sourcePath = join(source, file);
    const targetPath = join(target, file);

    if (lstatSync(sourcePath).isDirectory()) {
      copyFolderRecursiveSync(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  });
}

const withAndroidAssets: ConfigPlugin<string | string[]> = (
  expoConfig,
  files,
) =>
  withDangerousMod(expoConfig, [
    'android',
    (modConfig) => {
      if (modConfig.modRequest.platform === 'android') {
        const androidDwarablePath = join(
          modConfig.modRequest.platformProjectRoot,
          ...androidFolderPath,
        );
        if (!Array.isArray(files)) {
          // eslint-disable-next-line
          files = [files];
        }

        files.forEach((file) => {
          const isFile = lstatSync(file).isFile();
          if (isFile) {
            copyFileSync(file, join(androidDwarablePath, basename(file)));
          } else {
            copyFolderRecursiveSync(file, androidDwarablePath);
          }
        });
      }
      return modConfig;
    },
  ]);

export default withAndroidAssets;
