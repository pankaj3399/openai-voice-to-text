import httpStatus from "http-status";
import sendResponse from "../../../utils/helpers/SendResponse.js";
import catchAsync from "../../../utils/helpers/catchAsync.js";
import axios from "axios";
import fs from "fs";
import ApiError from "../../../utils/errors/ApiError.js";
import FormData from "form-data";
import config from "../../../utils/server/config.js";
import User from "../../models/userSchema.js";
import path from "path";
import { dirname } from "path";
import { Storage } from "@google-cloud/storage";

const bucketName = "saving_audio_bucket";
const fileName = "audio.wav";
const keyFilePath = "public/bucket_key.json"; // Replace with the path to your JSON key file

const GCPSignedUrl = catchAsync(async (req, res) => {
  // Load the service account key from the JSON file
  const keyFileContent = fs.readFileSync(
    path.resolve(dirname("./"), keyFilePath)
  );
  const credentials = JSON.parse(keyFileContent);

  // Create a new instance of the Storage class
  const storage = new Storage({
    projectId: credentials.project_id,
    credentials,
  });

  // Get a reference to the bucket and file
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  // Set the expiration time for the signed URL (in seconds)
  const expiration = Date.now() + 15 * 60 * 1000; // 15 minutes from now

  console.log(expiration);

  // Generate a signed URL for uploading
  const [url] = await file.getSignedUrl({
    action: "write",
    expires: expiration,
    version: "v4",
  });

  console.log(`Generated signed URL for file upload: ${url}`);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Uploaded successfully!`,
    data: {
      url,
    },
  });
});

export default GCPSignedUrl;
