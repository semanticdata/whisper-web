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
        <div className='p-4'>
            {hasTranscription ? (
                <>
                    <div className='mb-4'>
                        <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                            Transcription
                        </h3>
                        <div
                            ref={scrollRef}
                            className='w-full bg-slate-50 rounded-lg border border-slate-200 max-h-[24rem] overflow-y-auto'
                        >
                            <div className='flex'>
                                {/* Timestamp column */}
                                <div className='flex-shrink-0 bg-slate-100 border-r border-slate-200 p-2'>
                                    <div className='font-mono text-xs text-slate-500'>
                                        {transcribedData.chunks.map(
                                            (chunk, i) => (
                                                <div
                                                    key={i}
                                                    className='leading-6 py-1 px-2 text-right min-w-[4rem]'
                                                >
                                                    {formatAudioTimestamp(
                                                        chunk.timestamp[0],
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Transcription text column */}
                                <div className='flex-1 p-2'>
                                    <div className='font-mono text-sm text-slate-800 whitespace-pre-wrap'>
                                        {transcribedData.chunks.map(
                                            (chunk, i) => (
                                                <div
                                                    key={i}
                                                    className='leading-6 py-1 px-2'
                                                >
                                                    {chunk.text}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {transcribedData && !transcribedData.isBusy && (
                        <div className='flex justify-end space-x-2'>
                            <button
                                onClick={exportTXT}
                                className='bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-4 py-2 transition-colors'
                            >
                                Export TXT
                            </button>
                            <button
                                onClick={exportJSON}
                                className='bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-4 py-2 transition-colors'
                            >
                                Export JSON
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className='text-center py-8 text-slate-500'>
                    <p>No transcription available.</p>
                    <p className='text-sm mt-1'>
                        Upload an audio file or record to get started.
                    </p>
                </div>
            )}
        </div>
    );
}
