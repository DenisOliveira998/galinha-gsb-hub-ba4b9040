/**
 * RichTextEditor — editor WYSIWYG completo baseado em TipTap.
 * Usado nos campos de texto do /admin/settings e formulários de conteúdo.
 */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/core";
import { useCallback, useRef, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Minus, Undo2, Redo2,
  Link2, Link2Off, Image as ImageIcon, Youtube as YoutubeIcon,
  Table as TableIcon, Highlighter, Subscript as SubIcon,
  Superscript as SupIcon, Code, Code2, Trash2, ChevronDown,
} from "lucide-react";

/* ─── FontSize como extensão de TextStyle ─────────────────────────── */
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() { return { types: ["textStyle"] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => el.style.fontSize || null,
          renderHTML: (attrs) => attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }: any) =>
        chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }: any) =>
        chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    } as any;
  },
});

/* ─── constantes ──────────────────────────────────────────────────── */
const FONT_SIZES = ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px", "64px"];
const FONT_FAMILIES = [
  { label: "Padrão", value: "" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Fraunces", value: "Fraunces, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Arial", value: "Arial, sans-serif" },
];

/* ─── helpers ─────────────────────────────────────────────────────── */
function Divider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-border" />;
}
function Btn({
  onClick, active, disabled, title, children,
}: { onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm transition
        ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
        ${disabled ? "pointer-events-none opacity-30" : ""}`}
    >
      {children}
    </button>
  );
}

/* ─── Toolbar ─────────────────────────────────────────────────────── */
function Toolbar({ editor, onImageUpload }: { editor: ReturnType<typeof useEditor>; onImageUpload: () => void }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorRef = useRef<HTMLInputElement>(null);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);

  if (!editor) return null;

  const addLink = () => {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL do link:", prev);
    if (url === null) return;
    if (!url) { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL da imagem:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("URL do vídeo YouTube:");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const addTable = () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5">
      {/* Histórico */}
      <Btn title="Desfazer" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Refazer" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 className="h-3.5 w-3.5" />
      </Btn>
      <Divider />

      {/* Formatação básica */}
      <Btn title="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Itálico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Sublinhado" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Tachado" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Código inline" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Subscrito" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
        <SubIcon className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Sobrescrito" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
        <SupIcon className="h-3.5 w-3.5" />
      </Btn>
      <Divider />

      {/* Títulos */}
      {([1, 2, 3] as const).map((n) => (
        <Btn key={n} title={`Título H${n}`} active={editor.isActive("heading", { level: n })}
          onClick={() => editor.chain().focus().toggleHeading({ level: n }).run()}>
          <span className="text-[11px] font-bold">H{n}</span>
        </Btn>
      ))}
      <Divider />

      {/* Fonte */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setShowFontFamily((v) => !v); setShowFontSize(false); }}
          className="flex h-7 items-center gap-1 rounded-md px-2 text-xs hover:bg-muted"
          title="Família de fonte"
        >
          Fonte <ChevronDown className="h-3 w-3" />
        </button>
        {showFontFamily && (
          <div className="absolute top-full left-0 z-50 mt-1 min-w-[11rem] rounded-xl border border-border bg-card p-1 shadow-lg">
            {FONT_FAMILIES.map((f) => (
              <button key={f.value} type="button" onMouseDown={(e) => { e.preventDefault(); if (f.value) editor.chain().focus().setFontFamily(f.value).run(); else editor.chain().focus().unsetFontFamily().run(); setShowFontFamily(false); }}
                className="block w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-muted"
                style={{ fontFamily: f.value || undefined }}>
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tamanho */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setShowFontSize((v) => !v); setShowFontFamily(false); }}
          className="flex h-7 items-center gap-1 rounded-md px-2 text-xs hover:bg-muted"
          title="Tamanho de fonte"
        >
          Tam. <ChevronDown className="h-3 w-3" />
        </button>
        {showFontSize && (
          <div className="absolute top-full left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg">
            {FONT_SIZES.map((s) => (
              <button key={s} type="button" onMouseDown={(e) => { e.preventDefault(); (editor.chain().focus() as any).setFontSize(s).run(); setShowFontSize(false); }}
                className="block w-full rounded-lg px-3 py-1 text-left text-sm hover:bg-muted"
                style={{ fontSize: s }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <Divider />

      {/* Cor do texto */}
      <div className="relative flex items-center">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); colorRef.current?.click(); }}
          title="Cor do texto"
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
        >
          <span className="relative flex h-4 w-4 items-center justify-center text-[11px] font-bold"
            style={{ color: editor.getAttributes("textStyle").color ?? "currentColor" }}>
            A
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
              style={{ background: editor.getAttributes("textStyle").color ?? "currentColor" }} />
          </span>
        </button>
        <input
          ref={colorRef}
          type="color"
          className="absolute h-0 w-0 opacity-0"
          defaultValue="#000000"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
        <Btn title="Remover cor" onClick={() => editor.chain().focus().unsetColor().run()}>
          <Trash2 className="h-3 w-3" />
        </Btn>
      </div>

      {/* Realce */}
      <Btn title="Realçar texto" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()}>
        <Highlighter className="h-3.5 w-3.5" />
      </Btn>
      <Divider />

      {/* Alinhamento */}
      <Btn title="Alinhar à esquerda" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Centralizar" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Alinhar à direita" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRight className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Justificado" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
        <AlignJustify className="h-3.5 w-3.5" />
      </Btn>
      <Divider />

      {/* Listas */}
      <Btn title="Lista com marcadores" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Citação" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Bloco de código" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Linha horizontal" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-3.5 w-3.5" />
      </Btn>
      <Divider />

      {/* Link */}
      <Btn title="Inserir/editar link" active={editor.isActive("link")} onClick={addLink}>
        <Link2 className="h-3.5 w-3.5" />
      </Btn>
      <Btn title="Remover link" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")}>
        <Link2Off className="h-3.5 w-3.5" />
      </Btn>

      {/* Imagem */}
      <Btn title="Inserir imagem por URL" onClick={addImage}>
        <ImageIcon className="h-3.5 w-3.5" />
      </Btn>

      {/* YouTube */}
      <Btn title="Inserir vídeo do YouTube" onClick={addYoutube}>
        <YoutubeIcon className="h-3.5 w-3.5" />
      </Btn>

      {/* Tabela */}
      <Btn title="Inserir tabela" onClick={addTable}>
        <TableIcon className="h-3.5 w-3.5" />
      </Btn>
      {editor.isActive("table") && (
        <>
          <Btn title="Adicionar coluna depois" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            <span className="text-[10px]">+C</span>
          </Btn>
          <Btn title="Remover coluna" onClick={() => editor.chain().focus().deleteColumn().run()}>
            <span className="text-[10px]">-C</span>
          </Btn>
          <Btn title="Adicionar linha depois" onClick={() => editor.chain().focus().addRowAfter().run()}>
            <span className="text-[10px]">+L</span>
          </Btn>
          <Btn title="Remover linha" onClick={() => editor.chain().focus().deleteRow().run()}>
            <span className="text-[10px]">-L</span>
          </Btn>
          <Btn title="Deletar tabela" onClick={() => editor.chain().focus().deleteTable().run()}>
            <Trash2 className="h-3 w-3" />
          </Btn>
        </>
      )}
    </div>
  );
}

/* ─── RichTextEditor (exported) ───────────────────────────────────── */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite aqui…",
  minHeight = 160,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ controls: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none px-4 py-3",
        style: `min-height:${minHeight}px`,
      },
    },
  });

  const handleUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [editor]);

  const count = editor?.storage.characterCount.characters() ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring">
      <Toolbar editor={editor} onImageUpload={handleUpload} />
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
        <span>{count} caractere{count !== 1 ? "s" : ""}</span>
        <span className="opacity-60">Ctrl+Z desfaz · Ctrl+B negrito · Ctrl+I itálico</span>
      </div>
      <style>{`
        .tiptap p.is-editor-empty:first-child::before{content:attr(data-placeholder);color:var(--color-muted-foreground);float:left;height:0;pointer-events:none}
        .tiptap:focus{outline:none}
        .tiptap h1{font-size:1.75rem;font-weight:700;margin:.75rem 0 .5rem}
        .tiptap h2{font-size:1.4rem;font-weight:700;margin:.75rem 0 .4rem}
        .tiptap h3{font-size:1.15rem;font-weight:600;margin:.6rem 0 .3rem}
        .tiptap ul,.tiptap ol{padding-left:1.5rem;margin:.4rem 0}
        .tiptap ul li{list-style:disc}
        .tiptap ol li{list-style:decimal}
        .tiptap blockquote{border-left:3px solid var(--color-primary);padding-left:1rem;opacity:.8;margin:.5rem 0}
        .tiptap pre{background:var(--color-muted);border-radius:.75rem;padding:.75rem 1rem;font-size:.8rem;overflow-x:auto;margin:.4rem 0}
        .tiptap code{background:var(--color-muted);border-radius:.3rem;padding:.1rem .3rem;font-size:.85em}
        .tiptap img{max-width:100%;height:auto;border-radius:.75rem;margin:.5rem 0}
        .tiptap iframe{width:100%;aspect-ratio:16/9;border:none;border-radius:.75rem;margin:.5rem 0}
        .tiptap table{border-collapse:collapse;width:100%;margin:.5rem 0}
        .tiptap th,.tiptap td{border:1px solid var(--color-border);padding:.4rem .6rem;text-align:left;font-size:.85rem}
        .tiptap th{background:var(--color-muted);font-weight:600}
        .tiptap a{color:var(--color-primary);text-decoration:underline}
        .tiptap mark{background:rgba(255,220,0,.35);border-radius:.2rem;padding:.05rem .2rem}
        .tiptap hr{border:none;border-top:1px solid var(--color-border);margin:1rem 0}
      `}</style>
    </div>
  );
}
