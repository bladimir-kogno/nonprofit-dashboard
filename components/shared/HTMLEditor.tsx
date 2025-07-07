'use client';

import React, { useEffect, useRef } from 'react';
import { Bold, Italic, List, Link, Code, Type } from 'lucide-react';

interface HTMLEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showVariables?: boolean;
}

const templateVariables = [
    '[DONOR_NAME]',
    '[AMOUNT]',
    '[DATE]',
    '[EVENT_NAME]',
    '[TIME]',
    '[LOCATION]',
    '[ORGANIZATION_NAME]',
    '[VOLUNTEER_NAME]',
    '[RECIPIENT_NAME]'
];

export default function HTMLEditor({ value, onChange, placeholder = "Enter your content here...", showVariables = true }: HTMLEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertVariable = (variable: string) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const newText = text.slice(0, start) + variable + text.slice(end);
            
            onChange(newText);
            
            // Focus back to textarea and set cursor position
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + variable.length, start + variable.length);
            }, 0);
        }
    };

    const formatText = (tag: string) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.slice(start, end);
            
            let wrappedText = '';
            switch (tag) {
                case 'bold':
                    wrappedText = `<strong>${selectedText}</strong>`;
                    break;
                case 'italic':
                    wrappedText = `<em>${selectedText}</em>`;
                    break;
                case 'link':
                    wrappedText = `<a href="https://">${selectedText}</a>`;
                    break;
                case 'list':
                    wrappedText = `<ul><li>${selectedText}</li></ul>`;
                    break;
                case 'code':
                    wrappedText = `<code>${selectedText}</code>`;
                    break;
                case 'h2':
                    wrappedText = `<h2>${selectedText}</h2>`;
                    break;
                default:
                    wrappedText = selectedText;
            }
            
            const newText = textarea.value.slice(0, start) + wrappedText + textarea.value.slice(end);
            onChange(newText);
            
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + wrappedText.length, start + wrappedText.length);
            }, 0);
        }
    };

    return (
        <div className="space-y-4">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('h2')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="Heading"
                >
                    <Type className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('link')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="Link"
                >
                    <Link className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('list')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="List"
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('code')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="Code"
                >
                    <Code className="h-4 w-4" />
                </button>
            </div>

            {/* Template Variables */}
            {showVariables && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Template Variables:</p>
                    <div className="flex flex-wrap gap-2">
                        {templateVariables.map((variable) => (
                            <button
                                key={variable}
                                type="button"
                                onClick={() => insertVariable(variable)}
                                className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
                            >
                                {variable}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Text Editor */}
            <div>
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full min-h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    style={{ fontFamily: 'monospace' }}
                />
            </div>

            {/* Preview */}
            <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div 
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[100px] prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            </div>
        </div>
    );
}