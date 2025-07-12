import React, {
  useMemo,
  useCallback,
  useRef,
  forwardRef,
  Ref,
} from 'react';
import axios from 'axios';
import ReactQuill, { ReactQuillProps } from 'react-quill';
// Quill core already bundled with react-quill; explicit import not needed after emoji side-effect registration

// ─── Styles ──────────────────────────────────────────────────────────────────
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import '../styles/rich-text-editor.css';

// ─── Emoji Module Registration ───────────────────────────────────────────────
import 'quill-emoji/dist/quill-emoji.js'; // registers EmojiBlot and modules automatically

// ─── Component Props ─────────────────────────────────────────────────────────
interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  theme?: 'light' | 'dark';
  minHeightPx?: number; // optional override
}

// ─── Main Component ──────────────────────────────────────────────────────────
const RichTextEditor = forwardRef(
  (
    {
      value,
      onChange,
      placeholder = 'Write your content here…',
      theme = 'light',
      minHeightPx = 200,
    }: RichTextEditorProps,
    ref: Ref<ReactQuill>,
  ) => {
    const quillRef = useRef<ReactQuill | null>(null);

    // image upload handler ----------------------------------------------------
    const handleImageUpload = useCallback(async () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        if (!input.files?.length) return;

        const formData = new FormData();
        formData.append('file', input.files[0]);

        try {
          const { data } = await axios.post<{ imageUrl: string }>(
            '/api/uploads/image',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
          );

          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection(true);
          if (quill && range) {
            quill.insertEmbed(range.index, 'image', data.imageUrl, 'user');
          }
        } catch (err) {
          console.error('Image upload failed ↠', err);
        }
      };
    }, []);

    // quill modules ----------------------------------------------------------
    const modules: ReactQuillProps['modules'] = useMemo(
      () => ({
        toolbar: {
          container: [
            ['bold', 'italic', 'strike'], // formatting
            [{ list: 'bullet' }, { list: 'ordered' }],
            ['link'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }],
            ['emoji'],
            ['image'],
          ],
          handlers: { image: handleImageUpload },
        },
        'emoji-toolbar': true,
        'emoji-shortname': true,
      }),
      [handleImageUpload],
    );

    // allowed formats to preserve -------------------------------------------
    const formats = [
      'bold',
      'italic',
      'strike',
      'list',
      'bullet',
      'link',
      'align',
      'emoji',
      'image',
    ];

    // dynamic theming --------------------------------------------------------
    const containerClass =
      theme === 'dark'
        ? 'ql-editor dark:text-gray-100 dark:bg-gray-800'
        : 'ql-editor';

    return (
      <div
        className={`rich-text-editor border rounded-lg overflow-hidden ${
          theme === 'dark'
            ? 'border-gray-600 bg-gray-800'
            : 'border-gray-300 bg-white'
        }`}
      >
        <ReactQuill
          ref={(node) => {
            quillRef.current = node;
            if (typeof ref === 'function') ref(node as ReactQuill);
            else if (ref) (ref as React.MutableRefObject<ReactQuill | null>).current = node;
          }}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          theme="snow"
          className={containerClass}
          style={{ minHeight: minHeightPx }}
        />
      </div>
    );
  },
);

export default RichTextEditor;