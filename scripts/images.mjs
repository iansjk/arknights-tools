import { promises as fs } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ACESHIP_ROOT = path.join(__dirname, "../../AN-EN-Tags");

dotenv.config({
  path: path.join(__dirname, "../.env.local"),
});

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/** @type {Array<{ sourceDir: string, destDir: string, replace?: (filename: string) => string, filter?: (filename: string) => boolean}} */
const tasks = [
  {
    sourceDir: `${ACESHIP_ROOT}/img/skills`,
    destDir: "arknights/skills",
    filter: (filename) => filename.endsWith(".png"),
    replace: (filename) =>
      path
        .parse(filename)
        .name.replace(/^skill_icon_/, "")
        .replace("#", "_"),
  },
  {
    sourceDir: `${ACESHIP_ROOT}/img/avatars`,
    destDir: "arknights/avatars",
    filter: (filename) => /^char_[^_]+_[^_]+(_\d+\+?)?\.png$/.test(filename),
  },
  {
    sourceDir: `${ACESHIP_ROOT}/img/equip/icon`,
    destDir: "arknights/equip",
    filter: (filename) => filename.endsWith(".png"),
  },
  {
    sourceDir: `${ACESHIP_ROOT}/img/portraits`,
    destDir: "arknights/portraits",
    filter: (filename) => /^char_[^_]+_[^_]+_\d+\+?\.png$/.test(filename),
  },
  {
    sourceDir: `${ACESHIP_ROOT}/img/items`,
    destDir: "arknights/items",
    filter: (filename) => filename.endsWith(".png"),
  },
];

const upload = async (existingPublicIds, task) => {
  let uploadCount = 0;
  const { sourceDir, destDir, replace: replaceFn, filter: filterFn } = task;
  const dirEntries = await fs.readdir(sourceDir, {
    withFileTypes: true,
  });
  const filenames = dirEntries
    .filter(
      (dirent) => dirent.isFile() && (filterFn == null || filterFn(dirent.name))
    )
    .map((dirent) => dirent.name);
  await Promise.all(
    filenames.map(async (filename) => {
      const publicId = path.join(
        destDir,
        replaceFn ? replaceFn(filename) : path.parse(filename).name
      );
      if (publicId && !existingPublicIds.has(publicId)) {
        console.log(
          `images: "${publicId}" not found in Cloudinary, uploading...`
        );
        await cloudinary.uploader.upload(path.join(sourceDir, filename), {
          public_id: publicId,
        });
        uploadCount += 1;
      }
    })
  );
  return uploadCount;
};

const uploadAllImages = async () => {
  let publicIds = [];
  let nextCursor = null;
  const baseParams = {
    type: "upload",
    resource_type: "image",
    prefix: "arknights",
    max_results: 500,
  };
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await cloudinary.api.resources(
      nextCursor ? { ...baseParams, next_cursor: nextCursor } : baseParams
    );
    nextCursor = response.next_cursor;
    publicIds = [...publicIds, ...response.resources.map((r) => r.public_id)];
    if (!nextCursor) {
      break;
    }
  }
  const existingPublicIds = new Set(publicIds);
  console.log(
    `images: found ${existingPublicIds.size} existing images in Cloudinary.`
  );

  try {
    const uploadCounts = await Promise.all(
      tasks.map((task) => upload(existingPublicIds, task))
    );
    const totalUploadCount = uploadCounts.reduce((acc, cur) => acc + cur, 0);
    console.log(`images: uploaded ${totalUploadCount} new files, done.`);
  } catch (e) {
    console.error(e);
  }
};

export default uploadAllImages;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  uploadAllImages();
}
