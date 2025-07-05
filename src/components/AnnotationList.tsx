import React from "react";
import { Annotation } from "../utils/annotations";

interface AnnotationListProps {
    annotations: Annotation[];
    selectedAnnotation: Annotation | null;
    onSelectAnnotation: (annotation: Annotation | null) => void;
    onDeleteAnnotation: (id: string) => void;
}

export function AnnotationList({
    annotations,
    selectedAnnotation,
    onSelectAnnotation,
    onDeleteAnnotation,
}: AnnotationListProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    return (
        <div className='w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-full'>
            <div className='p-4 border-b border-slate-200'>
                <h2 className='text-lg font-semibold text-slate-900'>
                    Annotations
                </h2>
                <p className='text-sm text-slate-600'>
                    {annotations.length} total
                </p>
            </div>

            <div className='flex-1 overflow-y-auto'>
                {annotations.length === 0 ? (
                    <div className='p-4 text-center text-slate-500'>
                        <p>No annotations yet.</p>
                        <p className='text-sm mt-1'>
                            Complete a transcription to get started.
                        </p>
                    </div>
                ) : (
                    <div className='space-y-1 p-2'>
                        {annotations.map((annotation) => (
                            <div
                                key={annotation.id}
                                className={`relative group p-3 rounded-lg border cursor-pointer transition-all ${
                                    selectedAnnotation?.id === annotation.id
                                        ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                        : "bg-white border-slate-200 hover:bg-slate-50"
                                }`}
                                onClick={() => onSelectAnnotation(annotation)}
                            >
                                <div className='flex items-start justify-between'>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center justify-between'>
                                            <h3 className='font-medium text-slate-900 truncate'>
                                                {annotation.name || "Untitled"}
                                            </h3>
                                            <span className='text-xs text-slate-500 ml-2'>
                                                {formatDate(
                                                    annotation.createdAt,
                                                )}
                                            </span>
                                        </div>

                                        {annotation.address && (
                                            <p className='text-sm text-slate-600 truncate mt-1'>
                                                {annotation.address}
                                            </p>
                                        )}

                                        {annotation.phone && (
                                            <p className='text-sm text-slate-600 truncate'>
                                                {annotation.phone}
                                            </p>
                                        )}

                                        <p className='text-xs text-slate-500 mt-2'>
                                            {truncateText(
                                                annotation.transcription.text,
                                            )}
                                        </p>

                                        {annotation.notes && (
                                            <p className='text-xs text-slate-400 mt-1 italic'>
                                                {truncateText(
                                                    annotation.notes,
                                                    50,
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteAnnotation(annotation.id);
                                        }}
                                        className='opacity-0 group-hover:opacity-100 ml-2 p-1 text-slate-400 hover:text-red-500 transition-all'
                                        title='Delete annotation'
                                    >
                                        <svg
                                            className='h-4 w-4'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='p-4 border-t border-slate-200'>
                <button
                    onClick={() => onSelectAnnotation(null)}
                    className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
                >
                    New Transcription
                </button>
            </div>
        </div>
    );
}
