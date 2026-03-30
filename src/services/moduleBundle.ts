import { Directory, File, Paths } from "expo-file-system";

import type { ResolvedModuleRelease } from "@/src/store/userStore";

type BundleManifestRecord = {
  releaseId: number;
  moduleName: string;
  platform: string;
  version: string;
  buildNumber: number;
  packageUrl: string;
  bundleUri: string;
  downloadedAt: string;
};

type BundleManifest = Record<string, BundleManifestRecord>;

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function getBundleDirectory() {
  const bundleDirectory = new Directory(Paths.cache, "module-bundles");
  bundleDirectory.create({ idempotent: true, intermediates: true });
  return bundleDirectory;
}

function getManifestFile() {
  return new File(getBundleDirectory(), "manifest.json");
}

function getReleaseKey(release: ResolvedModuleRelease) {
  return [
    sanitizeSegment(release.moduleName || "unknown-module"),
    sanitizeSegment(release.platform),
    sanitizeSegment(release.version),
    String(release.buildNumber),
  ].join("@");
}

async function readManifest(): Promise<BundleManifest> {
  const manifestFile = getManifestFile();
  if (!manifestFile.exists) {
    return {};
  }

  try {
    const content = await manifestFile.text();
    return content ? (JSON.parse(content) as BundleManifest) : {};
  } catch {
    return {};
  }
}

async function writeManifest(manifest: BundleManifest) {
  const manifestFile = getManifestFile();
  if (!manifestFile.exists) {
    manifestFile.create({ intermediates: true, overwrite: true });
  }
  manifestFile.write(JSON.stringify(manifest, null, 2));
}

function resolveCachedBundle(record?: BundleManifestRecord | null) {
  if (!record?.bundleUri) return null;
  const file = new File(record.bundleUri);
  return file.exists ? file.uri : null;
}

export async function prepareModuleBundle(release: ResolvedModuleRelease) {
  const manifest = await readManifest();
  const releaseKey = getReleaseKey(release);
  const cachedRecord = manifest[releaseKey];
  const cachedBundleUri =
    cachedRecord && cachedRecord.packageUrl === release.packageUrl
      ? resolveCachedBundle(cachedRecord)
      : null;

  if (cachedBundleUri) {
    return {
      bundleUri: cachedBundleUri,
      cached: true,
    };
  }

  const bundleDirectory = getBundleDirectory();
  const moduleSegment = sanitizeSegment(release.moduleName || "unknown-module");
  const platformSegment = sanitizeSegment(release.platform);
  const versionSegment = sanitizeSegment(
    `${release.version}-${release.buildNumber}`,
  );
  const fileExtension = release.packageUrl.split(".").pop() || "bundle";
  const fileName = `${moduleSegment}-${platformSegment}-${versionSegment}.${sanitizeSegment(fileExtension)}`;
  const destination = new File(bundleDirectory, fileName);

  const downloadedFile = await File.downloadFileAsync(
    release.packageUrl,
    destination,
    {
      idempotent: true,
    },
  );

  manifest[releaseKey] = {
    releaseId: release.id,
    moduleName: release.moduleName || "unknown-module",
    platform: release.platform,
    version: release.version,
    buildNumber: release.buildNumber,
    packageUrl: release.packageUrl,
    bundleUri: downloadedFile.uri,
    downloadedAt: new Date().toISOString(),
  };
  await writeManifest(manifest);

  return {
    bundleUri: downloadedFile.uri,
    cached: false,
  };
}
