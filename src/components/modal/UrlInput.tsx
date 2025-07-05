import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export function UrlInput(
    props: DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
) {
    return (
        <div className='mt-4'>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
                Audio URL
            </label>
            <input
                {...props}
                type='url'
                className='w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm'
                placeholder='https://example.com/audio.mp3'
                required
            />
        </div>
    );
}
