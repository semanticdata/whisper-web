import { useState, useEffect, useRef } from "react";

import { formatAudioTimestamp } from "../utils/AudioUtils";
import { webmFixDuration } from "../utils/BlobFix";

function getMimeType() {
    const types = [
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
        "audio/wav",
        "audio/aac",
    ];
    for (let i = 0; i < types.length; i++) {
        if (MediaRecorder.isTypeSupported(types[i])) {
            return types[i];
        }
    }
    return undefined;
}

export default function AudioRecorder(props: {
    onRecordingComplete: (blob: Blob) => void;
}) {
    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const startRecording = async () => {
        // Reset recording (if any)
        setRecordedBlob(null);

        let startTime = Date.now();

        try {
            if (!streamRef.current) {
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
            }

            const mimeType = getMimeType();
            const mediaRecorder = new MediaRecorder(streamRef.current, {
                mimeType,
            });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.addEventListener("dataavailable", async (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
                if (mediaRecorder.state === "inactive") {
                    const duration = Date.now() - startTime;

                    // Received a stop event
                    let blob = new Blob(chunksRef.current, { type: mimeType });

                    if (mimeType === "audio/webm") {
                        blob = await webmFixDuration(blob, duration, blob.type);
                    }

                    setRecordedBlob(blob);
                    props.onRecordingComplete(blob);

                    chunksRef.current = [];
                }
            });
            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
        ) {
            mediaRecorderRef.current.stop(); // set state to inactive
            setDuration(0);
            setRecording(false);
        }
    };

    useEffect(() => {
        if (recording) {
            const timer = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }

        return () => {
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track: MediaStreamTrack) => track.stop());
            }
        };
    }, [recording]);

    const handleToggleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className='space-y-4'>
            <div className='text-center'>
                <button
                    type='button'
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 min-w-[160px] ${
                        recording
                            ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                            : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                    }`}
                    onClick={handleToggleRecording}
                >
                    <div className='flex items-center'>
                        <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                                recording
                                    ? "bg-white animate-pulse"
                                    : "bg-white"
                            }`}
                        />
                        {recording
                            ? `Stop Recording (${formatAudioTimestamp(duration)})`
                            : "Start Recording"}
                    </div>
                </button>
            </div>

            {recordedBlob && (
                <div className='bg-slate-50 rounded-lg border border-slate-200 p-4'>
                    <h5 className='text-sm font-medium text-slate-700 mb-2'>
                        Recorded Audio
                    </h5>
                    <audio
                        className='w-full h-12 rounded-lg'
                        ref={audioRef}
                        controls
                    >
                        <source
                            src={URL.createObjectURL(recordedBlob)}
                            type={recordedBlob.type}
                        />
                    </audio>
                </div>
            )}
        </div>
    );
}
