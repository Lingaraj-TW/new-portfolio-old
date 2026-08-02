"use client";

import Placeholder from "@tiptap/extension-placeholder";
import UnderlineExtension from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Mic,
  MicOff,
  Underline as UnderlineIcon,
  type LucideIcon,
} from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const toolbarBtnClassName =
  "rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground data-[active=true]:bg-accent/10 data-[active=true]:text-accent";

type ToolbarAction = "bold" | "italic" | "underline" | "bulletList" | "orderedList";

export type ContactMessageEditorHandle = {
  getHtml: () => string;
  getText: () => string;
  clear: () => void;
};

type ContactMessageEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  start: () => void;
  abort: () => void;
};

type SpeechRecognitionCtor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const ContactMessageEditor = forwardRef<
  ContactMessageEditorHandle,
  ContactMessageEditorProps
>(function ContactMessageEditor({ value, onChange, disabled }, ref) {
  const [isListening, setIsListening] = useState(false);
  const [, setToolbarTick] = useState(0);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      UnderlineExtension,
      Placeholder.configure({
        placeholder: "Tell me about the role, timeline, or project...",
      }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      getHtml: () => editor?.getHTML() ?? "",
      getText: () => editor?.getText() ?? "",
      clear: () => {
        editor?.commands.setContent("");
        onChange("");
      },
    }),
    [editor, onChange],
  );

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      editor?.destroy();
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const refresh = () => setToolbarTick((n) => n + 1);
    editor.on("selectionUpdate", refresh);
    editor.on("transaction", refresh);
    return () => {
      editor.off("selectionUpdate", refresh);
      editor.off("transaction", refresh);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || disabled === undefined) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value === current) return;
    if (!value && current === "<p></p>") return;
    editor.commands.setContent(value || "", false);
  }, [editor, value]);

  const startListening = () => {
    if (!editor || disabled) return;
    const SpeechRecognition = getSpeechRecognitionCtor();
    if (!SpeechRecognition) return;

    recognitionRef.current?.abort();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        editor.chain().focus().insertContent(`${transcript} `).run();
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const runToolbarAction = (action: ToolbarAction) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    switch (action) {
      case "bold":
        chain.toggleBold().run();
        break;
      case "italic":
        chain.toggleItalic().run();
        break;
      case "underline":
        chain.toggleUnderline().run();
        break;
      case "bulletList":
        chain.toggleBulletList().run();
        break;
      case "orderedList":
        chain.toggleOrderedList().run();
        break;
    }
  };

  if (!editor) {
    return (
      <div className="min-h-[160px] rounded-xl border border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
        Loading editor…
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-background transition-all focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/30"
      id="contact-message"
    >
      <div className="flex items-center gap-0.5 border-b border-border px-2 py-1.5">
        <ToolbarButton
          icon={Bold}
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => runToolbarAction("bold")}
          disabled={disabled}
        />
        <ToolbarButton
          icon={Italic}
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => runToolbarAction("italic")}
          disabled={disabled}
        />
        <ToolbarButton
          icon={UnderlineIcon}
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => runToolbarAction("underline")}
          disabled={disabled}
        />
        <ToolbarButton
          icon={List}
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => runToolbarAction("bulletList")}
          disabled={disabled}
        />
        <ToolbarButton
          icon={ListOrdered}
          label="Ordered list"
          active={editor.isActive("orderedList")}
          onClick={() => runToolbarAction("orderedList")}
          disabled={disabled}
        />
        <button
          type="button"
          title="Voice input"
          disabled={disabled}
          onClick={startListening}
          className={`ml-auto rounded p-1.5 transition-colors hover:bg-accent/10 disabled:opacity-50 ${
            isListening
              ? "text-[#EC4899] animate-pulse"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" aria-hidden />
          ) : (
            <Mic className="h-4 w-4" aria-hidden />
          )}
          <span className="sr-only">Voice input</span>
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 text-sm text-foreground focus:outline-none [&_.tiptap]:min-h-[160px] [&_.tiptap]:outline-none"
      />
    </div>
  );
});

function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      disabled={disabled}
      data-active={active}
      onClick={onClick}
      className={toolbarBtnClassName}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span className="sr-only">{label}</span>
    </button>
  );
}
