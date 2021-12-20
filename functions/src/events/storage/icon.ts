import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cpp from "child-process-promise";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import mkdirp from "mkdirp";

// Based on:
// https://github.com/firebase/functions-samples/blob/main/generate-thumbnail/functions/index.js


// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = "thumb_";

/**
 * When an image is uploaded in the Storage
 * bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
export const generateThumbnail = functions
    .storage.object().onFinalize(async (object) => {
      const uid = object?.metadata?.uid;
      if (!uid) {
        return functions.logger.error("uid not set in metadata");
      }
      // File and directory paths.
      const filePath = object.name as string;
      const contentType = object
          .contentType as string; // This is the image MIME type
      const fileDir = path.dirname(filePath);
      const fileName = path.basename(filePath);
      const thumbFilePath = path
          .normalize(path
              .join(fileDir, `${THUMB_PREFIX}${fileName}`));
      const tempLocalFile = path.join(os.tmpdir(), filePath);
      const tempLocalDir = path.dirname(tempLocalFile);
      const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

      // Exit if this is triggered on a file that is not an image.
      if (!contentType.startsWith("image/")) {
        return functions.logger.log("This is not an image.");
      }

      // Exit if the image is already a thumbnail.
      if (fileName.startsWith(THUMB_PREFIX)) {
        return functions.logger.log("Already a Thumbnail.");
      }

      // Cloud Storage files.
      const bucket = admin.storage().bucket(object.bucket);
      const file = bucket.file(filePath);
      const thumbFile = bucket.file(thumbFilePath);
      const metadata = {
        contentType: contentType,
        // To enable Client-side caching you can set
        // the Cache-Control headers here. Uncomment below.
        // 'Cache-Control': 'public,max-age=3600',
      };

      // Create the temp directory where the storage file will be downloaded.
      await mkdirp(tempLocalDir);
      // Download file from bucket.
      await file.download({destination: tempLocalFile});
      functions.logger.log("The file has been downloaded to", tempLocalFile);
      // Generate a thumbnail using ImageMagick.
      await cpp.spawn(
          "convert",
          [
            tempLocalFile,
            "-thumbnail",
            `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
            tempLocalThumbFile,
          ],
          {capture: ["stdout", "stderr"]});
      functions.logger.log("Thumbnail created at", tempLocalThumbFile);
      // Uploading the Thumbnail.
      await bucket.upload(
          tempLocalThumbFile,
          {destination: thumbFilePath, metadata: metadata}
      );

      functions.logger.log("Thumbnail uploaded to Storage at", thumbFilePath);
      // Once the image has been uploaded
      // delete the local files to free up disk space.
      fs.unlinkSync(tempLocalFile);
      fs.unlinkSync(tempLocalThumbFile);
      // Get the Signed URLs for the thumbnail and original image.
      const results = await Promise.all([
        thumbFile.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        }),
        file.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        }),
      ]);
      functions.logger.log("Got Signed URLs.");
      const thumbResult = results[0];
      //   const originalResult = results[1];
      const thumbFileUrl = thumbResult[0];
      //   const fileUrl = originalResult[0];
      // Add the URLs to the Database

      await admin
          .firestore()
          .collection("users")
          .doc(uid)
          .update({
            icon: thumbFileUrl,
          });
      return functions.logger.log("Thumbnail URLs saved to firestore.");
    });
