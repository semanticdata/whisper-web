export default function Progress({
    text,
    percentage,
}: {
    text: string;
    percentage: number;
}) {
    percentage = percentage ?? 0;
    return (
        <div className='w-full space-y-2'>
            <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-slate-700 truncate'>
                    {text}
                </span>
                <span className='text-sm text-slate-500'>
                    {percentage.toFixed(1)}%
                </span>
            </div>
            <div className='w-full bg-slate-200 rounded-full h-2'>
                <div
                    className='bg-indigo-600 h-2 rounded-full transition-all duration-300'
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
