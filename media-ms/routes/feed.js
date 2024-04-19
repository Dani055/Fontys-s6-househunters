import { Router } from "express";
import multer from "multer";
import { test, UploadMedia } from "../controllers/feed.js";
import { deleteMediaS3 } from "../s3.js";

const router = Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 * 3, files: 10 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      console.log("Skipped upload due to incorrect image format");
      cb(null, false);
      return;
    }
  },
});

router.get("/", test);
router.post("/upload", upload.array("photo"), UploadMedia);

export default router;

async function handleListingChange(channel, msg){
  const eventData = JSON.parse(msg.content.toString());
  if (eventData.imagesToDelete.length > 0) {
    await deleteMediaS3(eventData.imagesToDelete);
  }
  channel.ack(msg);
}

export async function subToChannel(channel) {
  channel.on("error", (error) => {
    console.log("Error occurred during message consumption:", error);
  });
  await subToQueue(channel, 'listingEditedMediaSub', handleListingChange)
  await subToQueue(channel, 'listingDeletedMediaSub', handleListingChange)
}
async function subToQueue(
  channel,
  queueName,
  callback
) {
  await channel.consume(
    queueName,
    async (msg) => {
      if (msg !== null) {
        try {
          await callback(channel, msg);
        } catch (error) {
          console.log(error);
        }
      }
    },
    { noAck: false }
  );
}