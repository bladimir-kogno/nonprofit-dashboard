'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold truncate pr-4">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}