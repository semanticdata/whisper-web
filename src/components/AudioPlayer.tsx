import { useEffect, useRef } from "react";

export default function AudioPlayer(props: {
    audioUrl: string;
    mimeType: string;
}) {
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const audioSource = useRef<HTMLSourceElement>(null);

    // Updates src when url changes
    useEffect(() => {
        if (audioPlayer.current && audioSource.current) {
            audioSource.current.src = props.audioUrl;
            audioPlayer.current.load();
        }
    }, [props.audioUrl]);

    return (
        <div className='bg-white rounded-lg border border-slate-200 shadow-sm p-4'>
            <h4 className='text-sm font-medium text-slate-700 mb-3'>
                Audio Preview
            </h4>
            <audio
                ref={audioPlayer}
                controls
                className='w-full h-12 rounded-lg'
            >
                <source ref={audioSource} type={props.mimeType}></source>
            </audio>
        </div>
    );
}
