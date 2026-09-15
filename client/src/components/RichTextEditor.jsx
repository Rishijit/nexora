import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import YouTube from "@tiptap/extension-youtube";

function RichTextEditor({ content = "", onChange }) {
  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const editor = useEditor({
    extensions: [
  StarterKit,

  Color.configure({
    types: ["textStyle"],
  }),

  Highlight.configure({
    multicolor: true,
  }),

  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),

  Image.configure({
    inline: false,
    allowBase64: false,
  }),
  YouTube.configure({
  controls: true,
  nocookie: true,
  width: 640,
  height: 360,
  }),
],

    content:
  content ||
  `
    <p>Start writing your rich note here...</p>
  `,
  onUpdate: ({ editor }) => {
  if (onChange) {
    onChange(editor.getHTML());
  }
},
  });
  useEffect(() => {
  if (editor && content !== editor.getHTML()) {
    editor.commands.setContent(content || "<p></p>");
  }
}, [content, editor]);
function addImage() {
  if (!editor) {
    return;
  }

  const imageUrl = window.prompt("Enter image URL:");

  if (!imageUrl) {
    return;
  }

  editor
    .chain()
    .focus()
    .setImage({
      src: imageUrl,
    })
    .run();
}
function openImagePicker() {
  fileInputRef.current?.click();
}

async function handleImageUpload(event) {
  const file = event.target.files?.[0];

  if (!file || !editor) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image size must be less than 5 MB.");
    event.target.value = "";
    return;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    alert("Cloudinary configuration is missing.");
    event.target.value = "";
    return;
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    setIsUploadingImage(true);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Image upload failed"
      );
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: data.secure_url,
      })
      .run();
  } catch (error) {
    console.error("Image upload error:", error);
    alert(error.message || "Failed to upload image.");
  } finally {
    setIsUploadingImage(false);
    event.target.value = "";
  }
}
function addYouTubeVideo() {
  if (!editor) {
    return;
  }

  const videoUrl = window.prompt(
    "Enter a YouTube video URL:"
  );

  if (!videoUrl) {
    return;
  }

  editor
    .chain()
    .focus()
    .setYoutubeVideo({
      src: videoUrl,
    })
    .run();
}

  if (!editor) {
    return null;
  }

  function getButtonClass(isActive = false) {
    return isActive
      ? "toolbar-button active"
      : "toolbar-button";
  }

  return (
    <div className="rich-editor-wrapper">
      <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  style={{ display: "none" }}
/>
      <div className="rich-editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            className={getButtonClass(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            className={getButtonClass(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <em>I</em>
          </button>

          <button
            type="button"
            className={getButtonClass(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <u>U</u>
          </button>

          <button
            type="button"
            className={getButtonClass(editor.isActive("strike"))}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className={getButtonClass(
              editor.isActive("heading", { level: 1 })
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            title="Heading 1"
          >
            H1
          </button>

          <button
            type="button"
            className={getButtonClass(
              editor.isActive("heading", { level: 2 })
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            title="Heading 2"
          >
            H2
          </button>

          <button
            type="button"
            className={getButtonClass(
              editor.isActive("heading", { level: 3 })
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            title="Heading 3"
          >
            H3
          </button>

          <button
            type="button"
            className={getButtonClass(editor.isActive("paragraph"))}
            onClick={() => editor.chain().focus().setParagraph().run()}
            title="Normal paragraph"
          >
            P
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className={getButtonClass(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            • List
          </button>

          <button
            type="button"
            className={getButtonClass(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered list"
          >
            1. List
          </button>

          <button
            type="button"
            className={getButtonClass(editor.isActive("blockquote"))}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
          >
            Quote
          </button>

          <button
            type="button"
            className={getButtonClass(editor.isActive("codeBlock"))}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code block"
          >
            Code
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className={getButtonClass(
              editor.isActive({ textAlign: "left" })
            )}
            onClick={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
            title="Align left"
          >
            ⬅
          </button>

          <button
            type="button"
            className={getButtonClass(
              editor.isActive({ textAlign: "center" })
            )}
            onClick={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
            title="Align center"
          >
            ↔
          </button>

          <button
            type="button"
            className={getButtonClass(
              editor.isActive({ textAlign: "right" })
            )}
            onClick={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
            title="Align right"
          >
            ➡
          </button>

          <button
            type="button"
            className={getButtonClass(
              editor.isActive({ textAlign: "justify" })
            )}
            onClick={() =>
              editor.chain().focus().setTextAlign("justify").run()
            }
            title="Justify"
          >
            ☰
          </button>
        </div>

        <div className="toolbar-group color-tools">
          <label
            className="color-control"
            title="Text colour"
          >
            <span className="color-control-label">Text</span>

            <input
              type="color"
              defaultValue="#ffffff"
              onChange={(event) => {
                editor
                  .chain()
                  .focus()
                  .setColor(event.target.value)
                  .run();
              }}
            />
          </label>

          <label
            className="color-control"
            title="Highlight colour"
          >
            <span className="color-control-label">Mark</span>

            <input
              type="color"
              defaultValue="#f5d76e"
              onChange={(event) => {
                editor
                  .chain()
                  .focus()
                  .setHighlight({
                    color: event.target.value,
                  })
                  .run();
              }}
            />
          </label>

          <button
            type="button"
            className="toolbar-button"
            onClick={() => editor.chain().focus().unsetColor().run()}
            title="Remove text colour"
          >
            Clear Text
          </button>

          <button
            type="button"
            className="toolbar-button"
            onClick={() => editor.chain().focus().unsetHighlight().run()}
            title="Remove highlight"
          >
            Clear Mark
          </button>
        </div>

        <div className="toolbar-group">
  <button
    type="button"
    className="toolbar-button"
    onClick={addImage}
    title="Insert image"
  >
    🖼️ Image
  </button>
  <button
  type="button"
  className="toolbar-button"
  onClick={openImagePicker}
  disabled={isUploadingImage}
  title="Upload image from your computer"
>
  {isUploadingImage ? "Uploading..." : "📁 Upload Image"}
</button>
<button
  type="button"
  className="toolbar-button"
  onClick={addYouTubeVideo}
  title="Insert YouTube video"
>
  🎬 YouTube
</button>
  <button
    type="button"
    className="toolbar-button"
    onClick={() =>
      editor.chain().focus().setHorizontalRule().run()
    }
    title="Horizontal divider"
  >
    Divider
  </button>

  <button
    type="button"
    className="toolbar-button"
    onClick={() =>
      editor.chain().focus().unsetAllMarks().run()
    }
    title="Clear formatting"
  >
    Clear Format
  </button>
</div>

        <div className="toolbar-group history-group">
          <button
            type="button"
            className="toolbar-button"
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            ↶ Undo
          </button>

          <button
            type="button"
            className="toolbar-button"
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            ↷ Redo
          </button>
        </div>
      </div>

      <div className="rich-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default RichTextEditor;
