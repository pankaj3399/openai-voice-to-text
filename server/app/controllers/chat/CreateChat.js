import httpStatus from "http-status";
import sendResponse from "../../../utils/helpers/SendResponse.js";
import catchAsync from "../../../utils/helpers/catchAsync.js";
import axios from 'axios';
import fs from 'fs';
import ApiError from "../../../utils/errors/ApiError.js";
import FormData from 'form-data';
import OpenAI from 'openai';
import config from "../../../utils/server/config.js";

const apiKey = String(config.OPENAI_SECRET);
const apiUrl = String(config.OPENAI_URL);

const openai = new OpenAI({
    apiKey: apiKey,
});

// Remove the file after a successful API call
const removeFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Error during audio transcription');
        }
    });
}

// get text from the audio
const getAudioToText = async (path, fileName) => {
    try {
        const audioData = fs.readFileSync(path);

        const formData = new FormData();
        formData.append('file', audioData, { filename: fileName });
        formData.append('model', 'whisper-1');

        const response = await axios.post(apiUrl, formData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                ...formData.getHeaders(),
            }
        });

        return response.data.text;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Error during audio transcription');
    }
}

// get open ai chat message
const getChatMessage = async (textMsg, filePath, totalChunk,) => {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: 'user', content: textMsg },
            ],
            model: 'gpt-4',
        });
        return chatCompletion.choices[0].message;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error during chat completion');
    } finally {
        // remove main audio file
        removeFile(filePath);

        // removing chunks file
        if (totalChunk > 0) {
            for (let i = 1; i <= totalChunk; i++) {
                removeFile(`public/output/chunk_${i}.wav`);
            }
        }
    }
}

// get the prompt message
const getPromptMessage = async (transcript) => {
    const system_prompt_new = `
    Embedded with the expertise of a specialized physiotherapist assistant, you play a pivotal role in scrutinizing and interpreting dialogues between physiotherapists and patients. Your purpose extends beyond mere transcription; you are tasked with intelligently extracting and rephrasing invaluable information, organizing it into predefined categories, all while ensuring diverse sentence structures and maintaining context.
    
    You will generate a JSON object with the following categories, derived from the dialogue:
    
    - Hulpvraag patiënt (of contactreden): Concisely capture and rephrase the patient's primary complaint and reasons for seeking therapy, encapsulating their goals and expectations in a maximum of two sentences.
    - Functioneringsproblemen en beloop: Extract and detail the patient’s complaints from inception to progression. This should include pain levels and impact on daily activities, rephrased for sentence variety.
    - Medische gezondheidsdeterminanten: Uncover and incorporate medical factors impacting the patient's complaint, such as medication and past health issues, rephrased to avoid repetition.
    - Omgevingsdeterminanten: Articulate environmental factors as described by the patient, such as work and daily activities, ensuring varied sentence beginnings.
    - Persoonlijke determinanten: Extract and coherently synthesize personal factors from the patient’s perspective, including overall health and lifestyle, rephrased for diverse sentence structure.
    
    Your response should be as follows:
    User: ${transcript}
    You :
    
    {
      "Hulpvraag patiënt (of contactreden)": "<Extracted and rephrased information>",
      "Functioneringsproblemen en beloop": "<Extracted and rephrased information>",
      "Medische gezondheidsdeterminanten": "<Extracted and rephrased information>",
      "Omgevingsdeterminanten": "<Extracted and rephrased information>",
      "Persoonlijke determinanten": "<Extracted and rephrased information>"
    }
    [end]
    
    Your output must be a JSON object articulated in Dutch, excluding any additional elements. It should be detailed and comprehensive, using professional physiotherapy language, and ensure sentence variety to enhance readability.
    
    
    
    `

    return system_prompt_new;
}

// Function to split audio file into chunks
const splitAudio = async (filePath, outputDirectory = 'public/output', chunkSize = 24 * 1024 * 1024) => {
    try {
        const audioBuffer = fs.readFileSync(filePath);
        const totalChunks = Math.ceil(audioBuffer.length / chunkSize);
        let totalChunk = 0;

        for (let i = 0; i < totalChunks; i++) {
            totalChunk += 1;
            const start = i * chunkSize;
            const end = (i + 1) * chunkSize;
            const chunkBuffer = audioBuffer.slice(start, end);

            const chunkFileName = `${outputDirectory}/chunk_${i + 1}.wav`;
            fs.writeFileSync(chunkFileName, chunkBuffer);
        }
        console.log('Audio file successfully split into chunks.');
        return totalChunk;
    } catch (error) {
        console.error('Error splitting audio file:', error);
    }
};

const CreateChat = catchAsync(
    async (req, res) => {

        // file paths
        const filePath = req.file.path;
        const fileName = req.file.filename;
        const fileSizeInMB = req.file.size / (1024 * 1024);

        let text;
        let totalChunk;

        if (fileSizeInMB > 24) {
            totalChunk = await splitAudio(filePath);

            let fullText = '';

            // Transcribe each chunk and append to fullText
            for (let i = 1; i <= totalChunk; i++) {
                const chunkFilePath = `public/output/chunk_${i}.wav`;
                const chunkText = await getAudioToText(chunkFilePath, `chunk_${i}.wav`);
                fullText += chunkText + ' '; // Assuming you want a space between chunk texts
            }

            // Set the full text
            text = fullText.trim();
        } else {
            // getting text from audio
            text = await getAudioToText(filePath, fileName);
        }

        // promtmsg
        const promtMsg = await getPromptMessage(text);

        // get assistant response
        const chatData = await getChatMessage(promtMsg, filePath, totalChunk);

        // Split the content into lines
        const lines = chatData.content.split('\n');

        // Extract user messages
        // const userMessages = lines.filter(line => line.startsWith('User:'));
        // const youMessages = lines.filter(line => line.startsWith('You:'));

        const extractValue = (key) => {
            const index = lines.findIndex(line => line.includes(`"${key}":`));
            return index !== -1 ? lines[index].replace(/.*: "(.*)",?$/, "$1").trim().replace(/\\n/g, "\n") : null;
        };

        // Extract values for specific keys
        const hulpvraagValue = extractValue("Hulpvraag patiënt (of contactreden)");
        const beloopValue = extractValue("Functioneringsproblemen en beloop");
        const medischeValue = extractValue("Medische gezondheidsdeterminanten");
        const omgevingsValue = extractValue("Omgevingsdeterminanten");
        const persoonlijkeValue = extractValue("Persoonlijke determinanten");

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
            }
        });
    }
)

export default CreateChat