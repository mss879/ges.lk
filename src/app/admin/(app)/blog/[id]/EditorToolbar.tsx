"use client";

import { useRef, useState, type ReactNode } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Columns3,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Info,
  Italic,
  Lightbulb,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Rows3,
  SquareCode,
  Strikethrough,
  Table,
  Trash2,
  TriangleAlert,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";
import { altFromFileName, uploadBlogImage } from "@/lib/blog/upload";

function Btn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-stone-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${
        active ? "bg-[#00AC4E]/15 text-[#007a37]" : "hover:bg-stone-100 hover:text-stone-900"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-5 w-px bg-stone-200" aria-hidden="true" />;

/**
 * The formatting toolbar for the blog editor. Uses useEditorState so only the
 * toolbar re-renders when the selection changes, not the whole form.
 */
export default function EditorToolbar({
  editor,
  postId,
  onError,
}: {
  editor: Editor;
  postId: string;
  onError: (message: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      paragraph: e.isActive("paragraph"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      h4: e.isActive("heading", { level: 4 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      link: e.isActive("link"),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      callout: e.isActive("callout"),
      calloutVariant: (e.getAttributes("callout").variant as string | undefined) ?? null,
      table: e.isActive("table"),
      image: e.isActive("image"),
      imageAlt: (e.getAttributes("image").alt as string | null) ?? "",
      imageTitle: (e.getAttributes("image").title as string | null) ?? "",
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  const setLink = () => {
    const previous = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("Link address (https://…, /page, mailto:, tel: or #heading)", previous);
    if (url === null) return;
    if (url.trim() === "") {
      chain().extendMarkRange("link").unsetLink().run();
      return;
    }
    const ok = chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
    if (!ok) onError("That link address isn't allowed. Use a web, email, phone or on-page link.");
  };

  const callout = (variant: "tip" | "note" | "warning") => {
    if (state.callout) chain().updateCallout(variant).run();
    else chain().setCallout(variant).run();
  };

  const uploadImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url, width, height } = await uploadBlogImage(file, postId);
      chain().setImage({ src: url, alt: altFromFileName(file.name), width, height } as never).run();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Couldn't upload that image.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="sticky top-0 z-20 rounded-t-2xl border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        <Btn title="Paragraph" active={state.paragraph && !state.callout} onClick={() => chain().setParagraph().run()}>
          <Pilcrow className="h-4 w-4" />
        </Btn>
        <Btn title="Heading 2" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </Btn>
        <Btn title="Heading 3" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </Btn>
        <Btn title="Heading 4" active={state.h4} onClick={() => chain().toggleHeading({ level: 4 }).run()}>
          <Heading4 className="h-4 w-4" />
        </Btn>
        <Divider />
        <Btn title="Bold" active={state.bold} onClick={() => chain().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Btn>
        <Btn title="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Btn>
        <Btn title="Underline" active={state.underline} onClick={() => chain().toggleUnderline().run()}>
          <Underline className="h-4 w-4" />
        </Btn>
        <Btn title="Strikethrough" active={state.strike} onClick={() => chain().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </Btn>
        <Btn title="Inline code" active={state.code} onClick={() => chain().toggleCode().run()}>
          <Code className="h-4 w-4" />
        </Btn>
        <Btn title={state.link ? "Edit link" : "Add link"} active={state.link} onClick={setLink}>
          <LinkIcon className="h-4 w-4" />
        </Btn>
        {state.link && (
          <Btn title="Remove link" onClick={() => chain().extendMarkRange("link").unsetLink().run()}>
            <Unlink className="h-4 w-4" />
          </Btn>
        )}
        <Divider />
        <Btn title="Bulleted list" active={state.bulletList} onClick={() => chain().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Btn>
        <Btn title="Numbered list" active={state.orderedList} onClick={() => chain().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </Btn>
        <Btn title="Quote" active={state.blockquote} onClick={() => chain().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </Btn>
        <Btn title="Tip box" active={state.calloutVariant === "tip" && state.callout} onClick={() => callout("tip")}>
          <Lightbulb className="h-4 w-4" />
        </Btn>
        <Btn title="Note box" active={state.calloutVariant === "note" && state.callout} onClick={() => callout("note")}>
          <Info className="h-4 w-4" />
        </Btn>
        <Btn title="Warning box" active={state.calloutVariant === "warning" && state.callout} onClick={() => callout("warning")}>
          <TriangleAlert className="h-4 w-4" />
        </Btn>
        {state.callout && (
          <Btn title="Remove box" onClick={() => chain().unsetCallout().run()}>
            <Trash2 className="h-4 w-4" />
          </Btn>
        )}
        <Btn title="Code / diagram block" active={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()}>
          <SquareCode className="h-4 w-4" />
        </Btn>
        <Btn title="Divider line" onClick={() => chain().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </Btn>
        <Divider />
        <Btn
          title="Insert table"
          active={state.table}
          onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          <Table className="h-4 w-4" />
        </Btn>
        <Btn title="Insert image" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </Btn>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="hidden"
          onChange={(e) => uploadImage(e.target.files?.[0])}
        />
        <Divider />
        <Btn title="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </Btn>
        <Btn title="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </Btn>
      </div>

      {/* Context bar: table tools, or image alt text + caption */}
      {state.table && (
        <div className="flex flex-wrap items-center gap-1 border-t border-stone-100 px-2 py-1.5 text-[11px] font-bold text-stone-500">
          <span className="mr-1 uppercase tracking-widest">Table</span>
          <button type="button" onClick={() => chain().addRowAfter().run()} className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-stone-100 cursor-pointer">
            <Rows3 className="h-3.5 w-3.5" /> Add row
          </button>
          <button type="button" onClick={() => chain().addColumnAfter().run()} className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-stone-100 cursor-pointer">
            <Columns3 className="h-3.5 w-3.5" /> Add column
          </button>
          <button type="button" onClick={() => chain().deleteRow().run()} className="rounded-md px-2 py-1 hover:bg-stone-100 cursor-pointer">
            Delete row
          </button>
          <button type="button" onClick={() => chain().deleteColumn().run()} className="rounded-md px-2 py-1 hover:bg-stone-100 cursor-pointer">
            Delete column
          </button>
          <button type="button" onClick={() => chain().toggleHeaderRow().run()} className="rounded-md px-2 py-1 hover:bg-stone-100 cursor-pointer">
            Header row on/off
          </button>
          <button type="button" onClick={() => chain().deleteTable().run()} className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50 cursor-pointer">
            Delete table
          </button>
        </div>
      )}
      {state.image && (
        <div className="grid grid-cols-1 gap-2 border-t border-stone-100 px-3 py-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Alt text (for screen readers & Google)</span>
            <input
              value={state.imageAlt}
              onChange={(e) => editor.chain().updateAttributes("image", { alt: e.target.value }).run()}
              placeholder="Describe the image"
              className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold focus:border-[#00AC4E] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Caption (optional, shown below)</span>
            <input
              value={state.imageTitle}
              onChange={(e) => editor.chain().updateAttributes("image", { title: e.target.value || null }).run()}
              placeholder="Caption"
              className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold focus:border-[#00AC4E] focus:outline-none"
            />
          </label>
        </div>
      )}
    </div>
  );
}
