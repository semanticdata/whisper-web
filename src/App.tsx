import { useState, useEffect } from "react";
import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";
import { AnnotationList } from "./components/AnnotationList";
import { AnnotationForm } from "./components/AnnotationForm";
import { useTranscriber } from "./hooks/useTranscriber";
import {
    Annotation,
    AnnotationStorage,
    AnnotationFormData,
    createAnnotation,
    updateAnnotation,
} from "./utils/annotations";

function App() {
    const transcriber = useTranscriber();
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [selectedAnnotation, setSelectedAnnotation] =
        useState<Annotation | null>(null);
    const [isNewTranscription, setIsNewTranscription] = useState(true);

    // Load annotations on app start
    useEffect(() => {
        const loadedAnnotations = AnnotationStorage.getAll();
        setAnnotations(loadedAnnotations);
    }, []);

    // Handle annotation selection
    const handleSelectAnnotation = (annotation: Annotation | null) => {
        setSelectedAnnotation(annotation);
        setIsNewTranscription(annotation === null);

        if (annotation) {
            // Reset transcriber state and load annotation's transcription
            transcriber.onInputChange();
        }
    };

    // Handle saving annotation
    const handleSaveAnnotation = (formData: AnnotationFormData) => {
        if (
            !transcriber.output?.chunks ||
            transcriber.output.chunks.length === 0
        ) {
            alert(
                "Please complete a transcription first before saving an annotation.",
            );
            return;
        }

        let annotation: Annotation;

        if (selectedAnnotation && !isNewTranscription) {
            // Update existing annotation
            annotation = updateAnnotation(selectedAnnotation, formData);
        } else {
            // Create new annotation
            annotation = createAnnotation(formData, {
                text: transcriber.output.text,
                chunks: transcriber.output.chunks,
            });
        }

        AnnotationStorage.save(annotation);

        // Refresh annotations list
        const updatedAnnotations = AnnotationStorage.getAll();
        setAnnotations(updatedAnnotations);
        setSelectedAnnotation(annotation);
        setIsNewTranscription(false);
    };

    // Handle deleting annotation
    const handleDeleteAnnotation = (id: string) => {
        if (confirm("Are you sure you want to delete this annotation?")) {
            AnnotationStorage.delete(id);
            const updatedAnnotations = AnnotationStorage.getAll();
            setAnnotations(updatedAnnotations);

            if (selectedAnnotation?.id === id) {
                setSelectedAnnotation(null);
                setIsNewTranscription(true);
                transcriber.onInputChange();
            }
        }
    };

    // Get current transcription data to display
    const currentTranscriptionData =
        selectedAnnotation && !isNewTranscription
            ? {
                  isBusy: false,
                  text: selectedAnnotation.transcription.text,
                  chunks: selectedAnnotation.transcription.chunks,
              }
            : transcriber.output;

    // Check if transcription is complete and ready for annotation
    const isTranscriptionComplete =
        transcriber.output &&
        !transcriber.output.isBusy &&
        transcriber.output.chunks.length > 0;

    return (
        <div className='flex h-screen bg-gray-50'>
            {/* Sidebar */}
            <AnnotationList
                annotations={annotations}
                selectedAnnotation={selectedAnnotation}
                onSelectAnnotation={handleSelectAnnotation}
                onDeleteAnnotation={handleDeleteAnnotation}
            />

            {/* Main Content */}
            <div className='flex-1 flex flex-col overflow-hidden'>
                {/* Header */}
                <div className='bg-white border-b border-slate-200 px-6 py-4'>
                    <h1 className='text-2xl font-extrabold tracking-tight text-slate-900'>
                        Whisper Web
                    </h1>
                    <p className='text-slate-600 mt-1'>
                        ML-powered speech recognition directly in your browser
                    </p>
                </div>

                {/* Content Area */}
                <div className='flex-1 overflow-y-auto p-6'>
                    <div className='max-w-4xl mx-auto space-y-6'>
                        {/* Audio Manager - only show for new transcriptions */}
                        {isNewTranscription && (
                            <AudioManager transcriber={transcriber} />
                        )}

                        {/* Transcript Display */}
                        {currentTranscriptionData && (
                            <div className='bg-white rounded-lg shadow-sm'>
                                <Transcript
                                    transcribedData={currentTranscriptionData}
                                />
                            </div>
                        )}

                        {/* Annotation Form */}
                        {(isTranscriptionComplete || selectedAnnotation) && (
                            <AnnotationForm
                                onSave={handleSaveAnnotation}
                                initialData={selectedAnnotation || undefined}
                                isDisabled={transcriber.isBusy}
                            />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className='bg-white border-t border-slate-200 px-6 py-3 text-center text-sm text-slate-500'>
                    Made with{" "}
                    <a
                        className='underline hover:text-slate-700'
                        href='https://github.com/xenova/transformers.js'
                    >
                        🤗 Transformers.js
                    </a>
                </div>
            </div>
        </div>
    );
}

export default App;
