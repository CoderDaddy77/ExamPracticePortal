import { useMemo, useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadImageToSupabase } from '../lib/supabaseStorage';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDark?: boolean;
}

export function RichTextEditor({ value, onChange, placeholder, isDark }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [uploading, setUploading] = useState(false);

  // Helper: upload a File to Supabase and insert the public URL into the editor
  const uploadAndInsertImage = async (quill: any, file: File) => {
    const range = quill.getSelection(true) || { index: quill.getLength() };
    setUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      quill.insertEmbed(range.index, 'image', publicUrl);
      setTimeout(() => {
        quill.insertText(range.index + 1, '\n');
        quill.setSelection(range.index + 2);
      }, 10);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Add tooltips to toolbar buttons after component mounts
  useEffect(() => {
    const toolbar = document.querySelector('.ql-toolbar');
    if (toolbar) {
      const setProp = (selector: string, title: string) => {
        const el = toolbar.querySelector(selector);
        if (el) el.setAttribute('title', title);
      };

      setProp('.ql-bold', 'Bold (Ctrl+B)');
      setProp('.ql-italic', 'Italic (Ctrl+I)');
      setProp('.ql-underline', 'Underline (Ctrl+U)');
      setProp('.ql-strike', 'Strikethrough');
      setProp('.ql-list[value="ordered"]', 'Numbered List');
      setProp('.ql-list[value="bullet"]', 'Bullet List');
      setProp('.ql-image', 'Upload Image to Cloud');
      setProp('.ql-header', 'Heading');
      setProp('.ql-color', 'Text Color');
      setProp('.ql-background', 'Background Color');
    }
  }, []);

  // Custom toolbar configuration — image handler now uploads to Supabase
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['image']
      ],
      handlers: {
        image: function (this: any) {
          const quill = this.quill;
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
              // Upload to Supabase instead of embedding base64
              const range = quill.getSelection(true) || { index: quill.getLength() };
              // We need to access the component's state, so we dispatch a custom event
              const uploadEvent = new CustomEvent('supabase-image-upload', { detail: { file, quill, range } });
              document.dispatchEvent(uploadEvent);
            }
          };
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  // Listen for custom upload events from the toolbar handler
  useEffect(() => {
    const handleUploadEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.file && detail?.quill) {
        uploadAndInsertImage(detail.quill, detail.file);
      }
    };
    document.addEventListener('supabase-image-upload', handleUploadEvent);
    return () => document.removeEventListener('supabase-image-upload', handleUploadEvent);
  }, []);

  // Handle image paste — upload to Supabase instead of embedding base64
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const handlePaste = (e: ClipboardEvent) => {
        if (e.clipboardData && e.clipboardData.items) {
          const items = e.clipboardData.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              e.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                uploadAndInsertImage(quill, file);
                return;
              }
            }
          }
        }
      };

      quill.root.addEventListener('paste', handlePaste);
      return () => {
        quill.root.removeEventListener('paste', handlePaste);
      };
    }
  }, []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'image'
  ];

  return (
    <div className={`rich-text-editor relative ${isDark ? 'dark-theme' : 'light-theme'}`}>
      <style>{`
        .rich-text-editor .ql-container {
          font-size: 16px;
          min-height: 300px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .rich-text-editor .ql-editor {
          min-height: 300px;
        }
        
        .rich-text-editor.dark-theme .ql-toolbar {
          background: #1E1E1D;
          border-color: #64748b !important;
        }
        
        .rich-text-editor.dark-theme .ql-container {
          background: #1E1E1D;
          border-color: #64748b !important;
          color: #f1f5f9;
        }
        
        .rich-text-editor.dark-theme .ql-editor.ql-blank::before {
          color: #94a3b8;
        }
        
        .rich-text-editor.dark-theme .ql-stroke {
          stroke: #cbd5e1 !important;
        }
        
        .rich-text-editor.dark-theme .ql-fill {
          fill: #cbd5e1 !important;
        }
        
        .rich-text-editor.dark-theme .ql-picker-label {
          color: #cbd5e1 !important;
        }
        
        .rich-text-editor.dark-theme .ql-picker-options {
          background: #2d2e33;
          border-color: #64748b;
        }
        
        .rich-text-editor.dark-theme .ql-picker-item:hover {
          color: #3b82f6 !important;
        }
        
        /* HOVER STATE - Grey background, NOT active color */
        .rich-text-editor.dark-theme .ql-toolbar button:hover {
          background: rgba(148, 163, 184, 0.15) !important;
        }
        
        .rich-text-editor.light-theme .ql-toolbar button:hover {
          background: rgba(0, 0, 0, 0.05) !important;
        }
        
        /* ACTIVE STATE - Blue highlight */
        .rich-text-editor.dark-theme .ql-toolbar button.ql-active {
          background: rgba(59, 130, 246, 0.2) !important;
        }
        
        .rich-text-editor.light-theme .ql-toolbar button.ql-active {
          background: rgba(59, 130, 246, 0.15) !important;
        }
        
        /* Active state stroke/fill colors */
        .rich-text-editor.dark-theme .ql-toolbar button.ql-active .ql-stroke {
          stroke: #3b82f6 !important;
        }
        
        .rich-text-editor.dark-theme .ql-toolbar button.ql-active .ql-fill {
          fill: #3b82f6 !important;
        }
        
        .rich-text-editor.light-theme .ql-toolbar button.ql-active .ql-stroke {
          stroke: #2563eb !important;
        }
        
        .rich-text-editor.light-theme .ql-toolbar button.ql-active .ql-fill {
          fill: #2563eb !important;
        }
        
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          max-height: 500px;
          width: auto;
          height: auto;
          border-radius: 8px;
          margin: 12px 0;
          box-shadow: none;
          object-fit: contain;
          display: block;
        }
        
        .rich-text-editor.light-theme .ql-toolbar {
          background: white;
          border-color: #e5e7eb !important;
          border-radius: 8px 8px 0 0;
        }
        
        .rich-text-editor.light-theme .ql-container {
          border-color: #e5e7eb !important;
          border-radius: 0 0 8px 8px;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      `}</style>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Start typing...'}
      />

      {uploading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm shadow-xl flex items-center justify-center z-50 rounded-lg border border-slate-700">
          <div className={`p-4 rounded-xl shadow-xl flex flex-col items-center gap-3 ${isDark ? 'bg-[#1E1E1D]' : 'bg-white'}`}>
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
              Uploading image...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
