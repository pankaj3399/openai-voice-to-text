import httpStatus from "http-status";
import sendResponse from "../../../utils/helpers/SendResponse.js";
import catchAsync from "../../../utils/helpers/catchAsync.js";
import axios from "axios";
import fs from "fs";
import ApiError from "../../../utils/errors/ApiError.js";
import FormData from "form-data";
import OpenAI from "openai";
import config from "../../../utils/server/config.js";
import User from "../../models/userSchema.js";
import path from "path";
import { exec } from "child_process";
import { dirname } from "path";
import { Storage } from "@google-cloud/storage";
import { pipeline } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

const bucketName = "saving_audio_bucket";
const keyFilePath = "public/bucket_key.json"; // Replace with the path to your JSON key file

const apiKey = String(config.OPENAI_SECRET);
const apiUrl = String(config.OPENAI_URL);

const openai = new OpenAI({
  apiKey: apiKey,
});

// Remove the file after a successful API call
const removeFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Error during audio transcription"
      );
    }
  });
};

// get text from the audio
const getAudioToText = async (path, fileName, languageCode) => {
  try {
    const audioData = fs.readFileSync(path);

    const formData = new FormData();
    formData.append("file", audioData, { filename: fileName });
    formData.append("model", "whisper-1");
    formData.append("language", languageCode);
    formData.append("temperature", 0.0);

    const response = await axios.post(apiUrl, formData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
    });

    return response.data.text;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Error during audio transcription"
    );
  }
};

// get open ai chat message
const getChatMessage = async (textMsg, transcript, filePath, totalChunk) => {
  try {
    console.log(transcript, "Sending this to chat gpt....");
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: textMsg },
        { role: "user", content: transcript },
      ],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
      temperature: 0.0,
    });
    return chatCompletion.choices[0].message;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error during chat completion"
    );
  } finally {
    // remove main audio file
    removeFile(filePath);
    // removing chunks file
    if (totalChunk > 0) {
      for (let i = 0; i < totalChunk; i++) {
        removeFile(`public/output/chunk_${i}.wav`);
      }
    }
  }
};

// get the prompt message
const getPromptMessage = async () => {
  const system_prompt_new = `
    Embedded with the expertise of a specialized physiotherapist assistant, you play a pivotal role in scrutinizing and interpreting dialogues between physiotherapists and patients. Your purpose extends beyond mere transcription; you are tasked with intelligently extracting and rephrasing invaluable information, organizing it into predefined categories, all while ensuring diverse sentence structures and maintaining context.
    
    You will generate a JSON object with the following categories, derived from the dialogue:
    
    - Hulpvraag patiënt (of contactreden): Concisely capture and rephrase the patient's primary complaint and reasons for seeking therapy, encapsulating their goals and expectations in a maximum of two sentences.
    - Functioneringsproblemen en beloop: Extract and detail the patient’s complaints from inception to progression. This should include pain levels and impact on daily activities, rephrased for sentence variety.
    - Medische gezondheidsdeterminanten: Uncover and incorporate medical factors impacting the patient's complaint, such as medication and past health issues, rephrased to avoid repetition.
    - Omgevingsdeterminanten: Articulate environmental factors as described by the patient, such as work and daily activities, ensuring varied sentence beginnings.
    - Persoonlijke determinanten: Extract and coherently synthesize personal factors from the patient’s perspective, including overall health and lifestyle, rephrased for diverse sentence structure.
    
    Your response should be as follows:
    User: {transcript}
    You :
    
    {
      "Hulpvraag patiënt (of contactreden)": "<Extracted and rephrased information>",
      "Functioneringsproblemen en beloop": "<Extracted and rephrased information>",
      "Medische gezondheidsdeterminanten": "<Extracted and rephrased information>",
      "Omgevingsdeterminanten": "<Extracted and rephrased information>",
      "Persoonlijke determinanten": "<Extracted and rephrased information>"
    }
    [end]
    
    Your output must be a JSON object articulated in English, excluding any additional elements. It should be detailed and comprehensive, using professional physiotherapy language, and ensure sentence variety to enhance readability.

    `;

  return system_prompt_new;
};

// Function to split audio file into chunks
const splitAudio = async (filePath) => {
  try {
    const outputAudio = path.join("public", "output", "chunk_%d.wav");

    await new Promise((resolve, reject) => {
      // 120 second segments
      const sCommand = `ffmpeg -i "${filePath}" -f segment -segment_time 120 -c copy ${outputAudio}`;

      exec(sCommand, (error, stdout, stderr) => {
        if (error) {
          resolve({
            status: "error",
          });
        } else {
          resolve({
            status: "success",
            error: stderr,
            out: stdout,
          });
        }
      });
    });
  } catch (error) {
    console.error("Error splitting audio file:", error);
  }
};

const CreateChatGCP = catchAsync(async (req, res) => {
  const fileName = `audio_${req?.user?._id}.wav`;
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

  // Create a readable stream from the file
  const readableStream = file.createReadStream();

  // Create a writable stream to save the file locally (you can modify this as needed)
  const writableStream = fs.createWriteStream("public/files/audio.wav");

  // Use pipelineAsync to handle the stream asynchronously

  await pipelineAsync(readableStream, writableStream);
  console.log("File download completed.");

  console.log("File downloaded successfully!", res);
  // file paths
  const filePath = `public/files/audio_${req?.user?._id}.wav`;

  const language = req.body.language;
  const time = req.body.time;
  let text;
  let totalChunk;
  const user = await User.findById(req.user._id);
  if (user?.timesUsed >= user?.usageLimit) {
    // send mail
    const mailOptions = {
      from: "Fysio.ai <no-reply@fysio.ai.com>",
      to: user.email,
      subject: `Gebruikslimiet Overtroffen`,
      html: `<p>Je hebt de gebruikslimiet van je account overschreden. Neem voor meer details contact op via info@fysio.ai.</p>`,
    };

    send_mail(mailOptions);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Je hebt de gebruikslimiet van je account overschreden."
    );
  } else if (
    new Date() < new Date(user?.startDate) ||
    new Date() > new Date(user?.endDate)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "De datum moet liggen tussen de startdatum en einddatum van je account"
    );
  }

  if (time > 120) {
    totalChunk = Math.ceil(time / 120);
    await splitAudio(filePath);

    let fullText = "";

    // Transcribe each chunk and append to fullText
    for (let i = 0; i < totalChunk; i++) {
      const chunkFilePath = `public/output/chunk_${i}.wav`;
      const chunkText = await getAudioToText(
        chunkFilePath,
        `chunk_${i}.wav`,
        language
      );
      console.log(`The output of chunk_${i}.wav is ${chunkText}`);
      fullText += chunkText + " "; // Assuming you want a space between chunk texts
    }

    // Set the full text
    text = fullText.trim();
  } else {
    // getting text from audio
    text = await getAudioToText(filePath, fileName, language);
  }

  // promtmsg
  const promtMsg = await getPromptMessage();

  // get assistant response
  const chatData = await getChatMessage(promtMsg, text, filePath, totalChunk);

  // Split the content into lines
  const lines = chatData.content.split("\n");

  // Extract user messages
  // const userMessages = lines.filter(line => line.startsWith('User:'));
  // const youMessages = lines.filter(line => line.startsWith('You:'));

  const extractValue = (key) => {
    const index = lines.findIndex((line) => line.includes(`"${key}":`));
    return index !== -1
      ? lines[index]
          .replace(/.*: "(.*)",?$/, "$1")
          .trim()
          .replace(/\\n/g, "\n")
      : null;
  };

  // Extract values for specific keys
  const hulpvraagValue = extractValue("Hulpvraag patiënt (of contactreden)");
  const beloopValue = extractValue("Functioneringsproblemen en beloop");
  const medischeValue = extractValue("Medische gezondheidsdeterminanten");
  const omgevingsValue = extractValue("Omgevingsdeterminanten");
  const persoonlijkeValue = extractValue("Persoonlijke determinanten");

  await User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        timesUsed: user?.timesUsed ? user?.timesUsed + 1 : 1,
        secondsUsed: user?.secondsUsed
          ? user?.secondsUsed + parseInt(time)
          : parseInt(time),
      },
    }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Chat retrived successfully!`,
    data: {
      textData: text,
      chat: chatData,
      array: [
        hulpvraagValue,
        beloopValue,
        medischeValue,
        omgevingsValue,
        persoonlijkeValue,
      ],
    },
  });
});

export default CreateChatGCP;
