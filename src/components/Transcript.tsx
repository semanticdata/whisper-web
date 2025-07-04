import { useRef, useEffect } from "react";

import { TranscriberData } from "../hooks/useTranscriber";
import { formatAudioTimestamp } from "../utils/AudioUtils";

interface Props {
    transcribedData: TranscriberData | undefined;
}

export default function Transcript({ transcribedData }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const saveBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };
    const exportTXT = () => {
        let chunks = transcribedData?.chunks ?? [];
        let text = chunks
            .map((chunk) => chunk.text)
            .join("")
            .trim();

        const blob = new Blob([text], { type: "text/plain" });
        saveBlob(blob, "transcript.txt");
    };
    const exportJSON = () => {
        let jsonData = JSON.stringify(transcribedData?.chunks ?? [], null, 2);

        // post-process the JSON to make it more readable
        const regex = /( {4}"timestamp": )\[\s+(\S+)\s+(\S+)\s+\]/gm;
        jsonData = jsonData.replace(regex, "$1[$2 $3]");

        const blob = new Blob([jsonData], { type: "application/json" });
        saveBlob(blob, "transcript.json");
    };

    // Scroll to the bottom when the component updates
    useEffect(() => {
        if (scrollRef.current) {
            const diff = Math.abs(
                scrollRef.current.offsetHeight +
                    scrollRef.current.scrollTop -
                    scrollRef.current.scrollHeight,
            );

            if (diff <= 64) {
                // We're close enough to the bottom, so scroll to the bottom
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    });

    // Only show transcription area if there are chunks
    const hasTranscription =
        transcribedData?.chunks && transcribedData.chunks.length > 0;

    return (
        <div className='w-full flex flex-col my-2 p-4'>
            {hasTranscription && (
                <div
                    ref={scrollRef}
                    className='w-full bg-white rounded-lg shadow-xl shadow-black/5 ring-1 ring-slate-700/10 max-h-[20rem] overflow-y-auto'
                >
                    <div className='flex'>
                        {/* Timestamp column */}
                        <div className='flex-shrink-0 bg-gray-50 border-r border-gray-200 p-2'>
                            <div className='font-mono text-xs text-gray-500'>
                                {transcribedData.chunks.map((chunk, i) => (
                                    <div
                                        key={i}
                                        className='leading-6 py-1 px-2 text-right min-w-[4rem]'
                                    >
                                        {formatAudioTimestamp(
                                            chunk.timestamp[0],
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transcription text column */}
                        <div className='flex-1 p-2'>
                            <div className='font-mono text-sm text-gray-800 whitespace-pre-wrap'>
                                {transcribedData.chunks.map((chunk, i) => (
                                    <div
                                        key={i}
                                        className='leading-6 py-1 px-2'
                                    >
                                        {chunk.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {transcribedData && !transcribedData.isBusy && hasTranscription && (
                <div className='w-full text-right mt-2'>
                    <button
                        onClick={exportTXT}
                        className='text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center'
                    >
                        Export TXT
                    </button>
                    <button
                        onClick={exportJSON}
                        className='text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center'
                    >
                        Export JSON
                    </button>
                </div>
            )}
        </div>
    );
}
