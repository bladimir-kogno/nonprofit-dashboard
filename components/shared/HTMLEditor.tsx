'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Link, Quote, Undo, Redo, Code, Eye } from 'lucide-react';

interface HTMLEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function HTMLEditor({ content, onChange, placeholder = "Start writing..." }: HTMLEditorProps) {
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [htmlContent, setHtmlContent] = useState(content);

    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setHtmlContent(html);
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] p-4 overflow-auto',
            },
        },
    });

    const handleHtmlChange = (newHtml: string) => {
        setHtmlContent(newHtml);
        onChange(newHtml);
        if (editor) {
            editor.commands.setContent(newHtml);
        }
    };

    const toggleMode = () => {
        if (isHtmlMode) {
            // Switching from HTML to visual mode
            if (editor) {
                editor.commands.setContent(htmlContent);
            }
        } else {
            // Switching from visual to HTML mode
            if (editor) {
                setHtmlContent(editor.getHTML());
            }
        }
        setIsHtmlMode(!isHtmlMode);
    };

    if (!editor) {
        return <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 animate-pulse min-h-[250px]">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>;
    }

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-3 flex flex-wrap gap-1 overflow-x-auto">
                {/* Mode Toggle */}
                <button
                    type="button"
                    onClick={toggleMode}
                    className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium mr-2 ${isHtmlMode ? 'bg-gray-300' : ''}`}
                    title={isHtmlMode ? "Switch to Visual Editor" : "Switch to HTML Code"}
                >
                    {isHtmlMode ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                {!isHtmlMode && (
                    <>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </button>
                
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
                    className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
                    title="Heading 1"
                >
                    H1
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
                    className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
                    title="Heading 2"
                >
                    H2
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm ${editor.isActive('paragraph') ? 'bg-gray-300' : ''}`}
                    title="Paragraph"
                >
                    P
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </button>
                    </>
                )}
            </div>

            {/* Editor */}
            <div className="min-h-[200px] max-h-[400px] overflow-y-auto bg-white">
                {isHtmlMode ? (
                    <textarea
                        value={htmlContent}
                        onChange={(e) => handleHtmlChange(e.target.value)}
                        placeholder="Enter HTML code here..."
                        className="w-full h-full min-h-[200px] p-4 border-0 focus:outline-none font-mono text-sm resize-none"
                        style={{ fontFamily: 'monospace' }}
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
            </div>

            {/* Variables Helper */}
            <div className="bg-blue-50 border-t border-blue-200 p-3">
                <p className="text-sm text-blue-800 font-medium mb-2">Available Variables:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                          onClick={() => editor.chain().focus().insertContent('[DONOR_NAME]').run()}>
                        [DONOR_NAME]
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                          onClick={() => editor.chain().focus().insertContent('[AMOUNT]').run()}>
                        [AMOUNT]
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                          onClick={() => editor.chain().focus().insertContent('[EVENT_NAME]').run()}>
                        [EVENT_NAME]
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                          onClick={() => editor.chain().focus().insertContent('[DATE]').run()}>
                        [DATE]
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                          onClick={() => editor.chain().focus().insertContent('[TIME]').run()}>
                        [TIME]
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                          onClick={() => editor.chain().focus().insertContent('[LOCATION]').run()}>
                        [LOCATION]
                    </span>
                </div>
            </div>
        </div>
    );
}