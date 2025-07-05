export interface Annotation {
    id: string;
    name: string;
    address: string;
    phone: string;
    notes: string;
    transcription: {
        text: string;
        chunks: { text: string; timestamp: [number, number | null] }[];
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface AnnotationFormData {
    name: string;
    address: string;
    phone: string;
    notes: string;
}

const STORAGE_KEY = "whisper-web-annotations";

export class AnnotationStorage {
    static getAll(): Annotation[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];

            const annotations = JSON.parse(data) as Annotation[];
            return annotations.map((annotation) => ({
                ...annotation,
                createdAt: new Date(annotation.createdAt),
                updatedAt: new Date(annotation.updatedAt),
            }));
        } catch (error) {
            console.error("Error loading annotations:", error);
            return [];
        }
    }

    static save(annotation: Annotation): void {
        try {
            const annotations = this.getAll();
            const existingIndex = annotations.findIndex(
                (a) => a.id === annotation.id,
            );

            if (existingIndex >= 0) {
                annotations[existingIndex] = annotation;
            } else {
                annotations.push(annotation);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
        } catch (error) {
            console.error("Error saving annotation:", error);
        }
    }

    static delete(id: string): void {
        try {
            const annotations = this.getAll();
            const filtered = annotations.filter((a) => a.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error("Error deleting annotation:", error);
        }
    }

    static getById(id: string): Annotation | null {
        const annotations = this.getAll();
        return annotations.find((a) => a.id === id) || null;
    }

    static generateId(): string {
        return `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export function createAnnotation(
    formData: AnnotationFormData,
    transcriptionData: {
        text: string;
        chunks: { text: string; timestamp: [number, number | null] }[];
    },
): Annotation {
    const now = new Date();
    return {
        id: AnnotationStorage.generateId(),
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        notes: formData.notes,
        transcription: transcriptionData,
        createdAt: now,
        updatedAt: now,
    };
}

export function updateAnnotation(
    existing: Annotation,
    formData: AnnotationFormData,
): Annotation {
    return {
        ...existing,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        notes: formData.notes,
        updatedAt: new Date(),
    };
}
