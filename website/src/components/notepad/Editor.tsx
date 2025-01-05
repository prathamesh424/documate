"use client";

import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bold, Italic, Strikethrough, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, Heading1, Heading2, Heading3, Pilcrow, ImageIcon, Undo, Redo, Scissors, Type, ArrowUpToLine, ArrowDownToLine, X } from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1 p-2 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-t-lg">
        <div className="flex gap-1 mr-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="text-white hover:bg-white/20"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="text-white hover:bg-white/20"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-1 mr-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleHeading({ level: i + 1 }).run()}
                  className={`text-white hover:bg-white/20 ${editor.isActive("heading", { level: i + 1 }) ? "bg-white/20" : ""}`}
                >
                  {i === 0 ? <Heading1 className="h-4 w-4" /> : i === 1 ? <Heading2 className="h-4 w-4" /> : <Heading3 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{`Heading ${i + 1}`}</TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`text-white hover:bg-white/20 ${editor.isActive("paragraph") ? "bg-white/20" : ""}`}
              >
                <Pilcrow className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Paragraph</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-1 mr-2">
          {[
            { action: "toggleBold", icon: Bold, label: "Bold" },
            { action: "toggleItalic", icon: Italic, label: "Italic" },
            { action: "toggleStrike", icon: Strikethrough, label: "Strikethrough" },
            { action: "toggleHighlight", icon: Highlighter, label: "Highlight" },
          ].map(({ action, icon: Icon, label }, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus()[action]().run()}
                  className={`text-white hover:bg-white/20 ${editor.isActive(label.toLowerCase()) ? "bg-white/20" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex gap-1 mr-2">
          {[
            { align: "left", icon: AlignLeft },
            { align: "center", icon: AlignCenter },
            { align: "right", icon: AlignRight },
            { align: "justify", icon: AlignJustify },
          ].map(({ align, icon: Icon }, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().setTextAlign(align).run()}
                  className={`text-white hover:bg-white/20 ${editor.isActive({ textAlign: align }) ? "bg-white/20" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{`Align ${align.charAt(0).toUpperCase() + align.slice(1)}`}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={addImage}
                className="text-white hover:bg-white/20"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Image</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

const SuggestionPopup = ({ suggestions, onSelect, onClose }) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-2 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-lg shadow-lg">
        {suggestions.map((suggestion, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSelect(suggestion.action)}
                className="text-white hover:bg-white/20"
              >
                <suggestion.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{suggestion.label}</TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

const Editor = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: "",
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const text = editor.state.doc.textBetween(from, to);
        setSelectedText(text);
        const { top, left } = editor.view.coordsAtPos(from);
        setSuggestionPosition({ top: top + 20, left });
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    },
  });

  const getSuggestions = (text) => {
    const suggestions = [
      { action: "shortenText", icon: Scissors, label: "Shorten text" },
      { action: "makeTitle", icon: Type, label: "Make title" },
      { action: "addEmphasis", icon: Bold, label: "Add emphasis" },
      { action: "makeLowercase", icon: ArrowDownToLine, label: "Make lowercase" },
      { action: "makeUppercase", icon: ArrowUpToLine, label: "Make uppercase" },
    ];

    return suggestions.filter(suggestion => {
      switch (suggestion.action) {
        case "shortenText":
          return text.length > 20;
        case "makeTitle":
          return text.split(" ").length > 1;
        case "addEmphasis":
          return !text.includes("*");
        case "makeLowercase":
          return text.toLowerCase() !== text;
        case "makeUppercase":
          return text.toUpperCase() !== text;
        default:
          return true;
      }
    });
  };

  const handleSuggestionSelect = (action) => {
    if (editor) {
      switch (action) {
        case "shortenText":
          editor.chain().focus().deleteRange({ from: editor.state.selection.from + 20, to: editor.state.selection.to }).run();
          break;
        case "makeTitle":
          editor.chain().focus().setHeading({ level: 2 }).run();
          break;
        case "addEmphasis":
          editor.chain().focus().toggleBold().run();
          break;
        case "makeLowercase":
          editor.chain().focus().insertContent(selectedText.toLowerCase()).run();
          break;
        case "makeUppercase":
          editor.chain().focus().insertContent(selectedText.toUpperCase()).run();
          break;
      }
    }
    setShowSuggestions(false);
  };

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden relative">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-4 min-h-[300px] prose max-w-none" />
      {showSuggestions && (
        <div style={{ position: 'absolute', top: suggestionPosition.top, left: suggestionPosition.left }}>
          <SuggestionPopup
            suggestions={getSuggestions(selectedText)}
            onSelect={handleSuggestionSelect}
            onClose={() => setShowSuggestions(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Editor;

