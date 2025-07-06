'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Link, Quote, Undo, Redo } from 'lucide-react';

interface HTMLEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function HTMLEditor({ content, onChange, placeholder = "Start writing..." }: HTMLEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </button>
                
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
                    className={`px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
                    title="Heading 1"
                >
                    H1
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
                    className={`px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
                    title="Heading 2"
                >
                    H2
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`px-3 py-2 rounded hover:bg-gray-200 text-sm ${editor.isActive('paragraph') ? 'bg-gray-300' : ''}`}
                    title="Paragraph"
                >
                    P
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </button>
            </div>

            {/* Editor */}
            <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
                <EditorContent editor={editor} />
            </div>

            {/* Variables Helper */}
            <div className="bg-blue-50 border-t border-blue-200 p-3">
                <p className="text-sm text-blue-800 font-medium mb-2">Available Variables:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">[DONOR_NAME]</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">[AMOUNT]</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">[EVENT_NAME]</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">[DATE]</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">[TIME]</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">[LOCATION]</span>
                </div>
            </div>
        </div>
    );
}