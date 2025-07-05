import React, { useState, useEffect } from "react";
import { AnnotationFormData, Annotation } from "../utils/annotations";

interface AnnotationFormProps {
    onSave: (formData: AnnotationFormData) => void;
    initialData?: Annotation;
    isDisabled?: boolean;
}

export function AnnotationForm({
    onSave,
    initialData,
    isDisabled,
}: AnnotationFormProps) {
    const [formData, setFormData] = useState<AnnotationFormData>({
        name: "",
        address: "",
        phone: "",
        notes: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                address: initialData.address,
                phone: initialData.phone,
                notes: initialData.notes,
            });
        } else {
            setFormData({
                name: "",
                address: "",
                phone: "",
                notes: "",
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field: keyof AnnotationFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className='bg-white rounded-lg shadow-xl shadow-black/5 ring-1 ring-slate-700/10 p-6'>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
                {initialData ? "Edit Annotation" : "Add Annotation"}
            </h3>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label
                        htmlFor='name'
                        className='block text-sm font-medium text-slate-700 mb-1'
                    >
                        Name
                    </label>
                    <input
                        type='text'
                        id='name'
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled={isDisabled}
                        className='w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500'
                        placeholder='Enter name'
                    />
                </div>

                <div>
                    <label
                        htmlFor='address'
                        className='block text-sm font-medium text-slate-700 mb-1'
                    >
                        Address
                    </label>
                    <input
                        type='text'
                        id='address'
                        value={formData.address}
                        onChange={(e) =>
                            handleChange("address", e.target.value)
                        }
                        disabled={isDisabled}
                        className='w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500'
                        placeholder='Enter address'
                    />
                </div>

                <div>
                    <label
                        htmlFor='phone'
                        className='block text-sm font-medium text-slate-700 mb-1'
                    >
                        Phone
                    </label>
                    <input
                        type='tel'
                        id='phone'
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        disabled={isDisabled}
                        className='w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500'
                        placeholder='Enter phone number'
                    />
                </div>

                <div>
                    <label
                        htmlFor='notes'
                        className='block text-sm font-medium text-slate-700 mb-1'
                    >
                        Notes
                    </label>
                    <textarea
                        id='notes'
                        value={formData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        disabled={isDisabled}
                        rows={4}
                        className='w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500'
                        placeholder='Add notes about this transcription'
                    />
                </div>

                <button
                    type='submit'
                    disabled={isDisabled}
                    className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors'
                >
                    {initialData ? "Update Annotation" : "Save Annotation"}
                </button>
            </form>
        </div>
    );
}
