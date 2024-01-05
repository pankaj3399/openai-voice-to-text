/* eslint-disable no-unused-vars */
import AudioReactRecorder from "audio-react-recorder";
import { useEffect, useState } from "react";
import { axiosGET, axiosPOST } from "../../../../hooks/axiosMethods";
import { useAtom } from "jotai";
import { atomToken, atomUser } from "../../../../configs/states/atomState";
import { ENUM_STATUS } from "../../../../configs/constants";
import StatusMessages from "../../partials/StatusMessages";
import {
  removeFromLocalStorage,
  setOnLocalStorage,
} from "../../../../hooks/helpers";
import useAuthCheck from "../../../../hooks/useAuthCheck";

const initialVal = {
  propertyOne: "",
  propertyTwo: "",
  propertyThree: "",
  propertyFour: "",
  propertyFive: "",
};

const ChatHeadAudio = ({
  apiCallSuccess,
  setApiCalSuccess,
  setTextContent,
  access,
  textbox,
  setTextbox,
}) => {
  // atom states
  const [token] = useAtom(atomToken);
  const [user] = useAtom(atomUser);
  const { refetchUser } = useAuthCheck();
  // states
  // eslint-disable-next-line no-unused-vars
  const [audio, setAudio] = useState(null);
  const [recordState, setRecordState] = useState(ENUM_STATUS.NONE);
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [noAudioErr, setNoAudioErr] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("nl"); // Set the default language

  // handler
  const startRecording = () => {
    setApiCalSuccess(false);
    // if (recordState !== ENUM_STATUS.START) {
    setStartTime(new Date());
    setTotalElapsedTime(0);
    // }
    setRecordState(ENUM_STATUS.START);
  };

  const pauseRecording = () => {
    if (recordState === ENUM_STATUS.START) {
      updateTotalElapsedTime();
    }
    setRecordState(ENUM_STATUS.PAUSE);
  };

  const startPausedRecording = () => {
    setRecordState(ENUM_STATUS.START);
    setStartTime(new Date());
  };

  const stopRecording = () => {
    if (recordState === ENUM_STATUS.START) {
      updateTotalElapsedTime();
    }
    setRecordState(ENUM_STATUS.STOP);
  };

  const onSave = async (audioData) => {
    setAudio(audioData);

    if (totalElapsedTime >= 10) {
      setNoAudioErr(false);

      // Send the audio file to the server
      if (audioData.blob && !noAudioErr) {
        console.log(audioData.blob, "Hi");
        // send file to gcp storage and then call api to get chat out of it
        try {
          setLoading(true);
          const res = await axiosGET("chat/upload/gcp", setGetLoading, token);
          const res2 = await fetch(res.url, {
            method: "PUT",
            headers: {
              "Content-Type": audioData.blob.type,
            },
            body: audioData.blob,
          });
          if (res2.ok) {
            console.log("File uploaded successfully!");
            const response = await axiosPOST(
              "chat/gcp",
              { language: selectedLanguage, time: totalElapsedTime },
              setLoading,
              token
            );
            setApiCalSuccess(response.success);
            setTextContent(response.data?.array);
            setOnLocalStorage(
              "responses",
              JSON.stringify(response.data?.array)
            );
            setOnLocalStorage("userId", user._id);
            await refetchUser();
          } else {
            console.error("File upload failed:", res2.statusText);
            throw new Error(res2.statusText);
          }
        } catch (error) {
          setLoading(false);
          setRecordState(ENUM_STATUS.PAUSE);
          console.error("Error sending audio to the server:", error);
        }
      }
    } else {
      setNoAudioErr(true);
    }
  };

  const updateTotalElapsedTime = () => {
    if (startTime) {
      const now = new Date();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      setTotalElapsedTime(totalElapsedTime + elapsedSeconds);
      setStartTime(null); // Reset startTime after updating totalElapsedTime
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleReset = () => {
    setRecordState(ENUM_STATUS.NONE);
    setApiCalSuccess(false);
    setStartTime(new Date());
    setTotalElapsedTime(0);
    setTextbox(initialVal);
    setNoAudioErr(false);
    removeFromLocalStorage("responses");
    removeFromLocalStorage("userId");
  };

  useEffect(() => {
    if (recordState === ENUM_STATUS.START) {
      setStartTime(new Date());
      const intervalId = setInterval(updateTotalElapsedTime, 1000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordState]);

  return (
    <>
      <div className="app-header text-center">
        <img
          src="/images/text_only_blue.png"
          alt="Fysio.AI Logo"
          className="header-logo"
        />
      </div>

      <>
        <AudioReactRecorder
          state={recordState}
          onStop={onSave}
          canvasWidth={0}
          canvasHeight={0}
        />

        <div className="button-group mt-4 mb-4 text-center">
          {(recordState === ENUM_STATUS.STOP &&
            (apiCallSuccess || noAudioErr)) ||
          textbox.propertyThree.length ? (
            <button
              id="startButton"
              className="control-btn start-btn"
              title="Reset"
              onClick={handleReset}
            >
              <i className="fas fa-refresh"></i>Reset Opname
            </button>
          ) : null}

          {recordState === ENUM_STATUS.NONE && !textbox.propertyThree.length ? (
            <button
              id="startButton"
              className="control-btn start-btn"
              title="Klik om de opname te starten"
              onClick={startRecording}
              disabled={
                !user?.isActive ||
                !access ||
                user?.timesUsed >= user?.usageLimit ||
                new Date() < new Date(user?.startDate) ||
                new Date() > new Date(user?.endDate)
              }
            >
              <i className="fas fa-play"></i>Start Opname
            </button>
          ) : null}

          {recordState === ENUM_STATUS.START && (
            <>
              <button
                id="pauseButton"
                className="control-btn pause-btn"
                title="Klik om de opname te pauzeren"
                onClick={pauseRecording}
              >
                <i className="fas fa-pause"></i>Pauzeer Opname
              </button>
            </>
          )}

          {recordState === ENUM_STATUS.PAUSE && (
            <>
              <button
                id="resumeButton"
                className="control-btn resume-btn"
                title="Klik hier om door te gaan met de huidige opname"
                onClick={startPausedRecording}
              >
                <i className="fas fa-play"></i>Doorgaan met Opnemen
              </button>

              <button
                id="stopButton"
                className="control-btn stop-btn"
                title="Klik hier om de opname te stoppen en op te slaan"
                onClick={stopRecording}
              >
                <i className="fas fa-stop"></i>Stop Opname en maak samenvatting
              </button>
            </>
          )}
        </div>
      </>

      <div className="language-selection mt-4 mb-4 text-center">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="languageOptions"
            id="nederlands"
            value="nl"
            checked={selectedLanguage === "nl"}
            onChange={handleLanguageChange}
          />
          <label
            className="form-check-label"
            htmlFor="nederlands"
            style={{ fontWeight: 400 }}
          >
            Nederlands
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="languageOptions"
            id="engels"
            value="en"
            checked={selectedLanguage === "en"}
            onChange={handleLanguageChange}
          />
          <label
            className="form-check-label"
            htmlFor="engels"
            style={{ fontWeight: 400 }}
          >
            Engels
          </label>
        </div>
        {!access && (
          <div className="mt-3 mb-3 text-center warning-message">
            Require microphone access to record audio.
          </div>
        )}
      </div>

      <StatusMessages
        loading={loading}
        apiCallSuccess={apiCallSuccess}
        recordState={recordState}
        totalElapsedTime={totalElapsedTime}
      />

      {(!user.isActive ||
        user?.timesUsed >= user?.usageLimit ||
        new Date() < new Date(user?.startDate) ||
        new Date() > new Date(user?.endDate)) && (
        <div className="mt-3 mb-3 text-center warning-message">
          Geen credits (meer) beschikbaar. Neem contact op via info@fysio.ai.
        </div>
      )}

      {noAudioErr && (
        <div className="mt-3 mb-3 text-center warning-message">
          Geen geluid gedetecteerd, controleer je audio.
        </div>
      )}
    </>
  );
};

export default ChatHeadAudio;
