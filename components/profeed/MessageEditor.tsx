"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { Editor } from "@tiptap/core";

import { cn } from "@/lib/cn";

/** TipTap will store href; bare domains get https so links work in the browser. */
function normalizeLinkHref(input: string): string {
  const t = input.trim();
  if (!t) return t;
  if (/^(https?:|mailto:|tel:)/i.test(t)) return t;
  if (
    t.includes("://") ||
    t.startsWith("/") ||
    t.startsWith("#") ||
    t.startsWith("?")
  )
    return t;
  return `https://${t.replace(/^\/+/, "")}`;
}

type Props = {
  value: string;
  onChangeHtml: (html: string) => void;
  disabled?: boolean;
};

export type MessageEditorHandle = {
  insertText: (t: string) => void;
  getHtml: () => string;
};

const barBtn =
  "rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 data-[active=true]:bg-muted dark:hover:bg-muted/80 dark:data-[active=true]:bg-muted";

/**
 * TipTap rich text for feedback message (HTML stored; sanitized server-side).
 */
export const MessageEditor = forwardRef<MessageEditorHandle, Props>(
  function MessageEditor({ value, onChangeHtml, disabled }, ref) {
    const editorRef = useRef<Editor | null>(null);
    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          bulletList: { HTMLAttributes: { class: "list-disc pl-4" } },
          orderedList: { HTMLAttributes: { class: "list-decimal pl-4" } },
          codeBlock: {
            HTMLAttributes: {
              class: "rounded-md bg-muted p-2 font-mono text-xs dark:bg-muted",
            },
          },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-indigo-600 underline dark:text-indigo-400",
            rel: "noopener noreferrer",
          },
        }),
        Placeholder.configure({
          placeholder: "Describe your feedback…",
        }),
      ],
      content: value || "",
      editable: !disabled,
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm dark:prose-invert max-w-none min-h-[120px] px-3 py-2",
            "rounded-xl border border-border/80 bg-card text-foreground dark:bg-card/90 dark:text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring/30 ",
          ),
        },
      },
      onUpdate: ({ editor: ed }) => {
        editorRef.current = ed;
        onChangeHtml(ed.getHTML());
      },
      onCreate: ({ editor: ed }) => {
        editorRef.current = ed;
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        insertText: (t: string) => {
          const ed = editorRef.current;
          if (!ed) return;
          ed.chain().focus().insertContent(` ${t} `).run();
          onChangeHtml(ed.getHTML());
        },
        getHtml: () => editorRef.current?.getHTML() ?? "",
      }),
      [onChangeHtml],
    );

    useEffect(() => {
      if (!editor || disabled === undefined) return;
      editor.setEditable(!disabled);
    }, [editor, disabled]);

    useEffect(() => {
      if (!editor || !value) return;
      if (value === editor.getHTML()) return;
      editor.commands.setContent(value, false);
    }, [editor, value]);

    useEffect(() => {
      if (editor) editorRef.current = editor;
    }, [editor]);

    if (!editor) {
      return (
        <div className="min-h-[120px] rounded-xl border border-border/80 bg-muted/50 px-3 py-8 text-center text-sm text-muted-foreground">
          Initializing editor…
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Message</p>
        <div
          className="flex flex-wrap gap-1 rounded-t-xl border border-b-0 border-border/80 bg-muted/90 px-2 py-1.5 dark:border-border dark:bg-muted/50"
          aria-hidden={disabled}
        >
          <button
            type="button"
            className={barBtn}
            data-active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </button>
          <button
            type="button"
            className={barBtn}
            data-active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </button>
          <button
            type="button"
            className={barBtn}
            data-active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            Underline
          </button>
          <button
            type="button"
            className={barBtn}
            data-active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            List
          </button>
          <button
            type="button"
            className={barBtn}
            data-active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </button>
          <button
            type="button"
            className={barBtn}
            data-active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            Code
          </button>
          <button
            type="button"
            className={barBtn}
            data-active={editor.isActive("link")}
            onClick={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
                return;
              }
              // extendMarkRange("link") is for editing a link; plain selection needs setLink only.
              const raw = window.prompt(
                "Link URL (https is added if you omit it):",
                "https://",
              );
              if (raw == null) return;
              const href = normalizeLinkHref(raw);
              if (!href) return;
              editor.chain().focus().setLink({ href }).run();
            }}
          >
            Link
          </button>
        </div>
        <div className={disabled ? "pointer-events-none opacity-50" : ""}>
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  },
);
