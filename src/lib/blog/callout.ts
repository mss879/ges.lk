import { Node, mergeAttributes } from "@tiptap/core";

export const CALLOUT_VARIANTS = ["tip", "note", "warning"] as const;
export type CalloutVariant = (typeof CALLOUT_VARIANTS)[number];

export const CALLOUT_LABELS: Record<CalloutVariant, string> = {
  tip: "Professional Tip",
  note: "Note",
  warning: "Engineering Warning",
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      /** Wraps the selected blocks in a callout box. */
      setCallout: (variant?: CalloutVariant) => ReturnType;
      /** Changes the variant of the callout the cursor is in. */
      updateCallout: (variant: CalloutVariant) => ReturnType;
      /** Removes the callout box around the cursor, keeping its content. */
      unsetCallout: () => ReturnType;
    };
  }
}

/**
 * A highlighted box (tip / note / warning) holding ordinary paragraphs and
 * lists — the editor's version of the old `> [!TIP]` Markdown callouts.
 * Stored as `<div data-callout="tip">…</div>`.
 */
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: "tip",
        parseHTML: (element) => {
          const value = element.getAttribute("data-callout");
          return (CALLOUT_VARIANTS as readonly string[]).includes(value ?? "") ? value : "tip";
        },
        renderHTML: (attributes) => ({ "data-callout": attributes.variant }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-callout]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { class: "callout" }), 0];
  },

  addCommands() {
    return {
      setCallout:
        (variant = "tip") =>
        ({ commands }) =>
          commands.wrapIn(this.name, { variant }),
      updateCallout:
        (variant) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { variant }),
      unsetCallout:
        () =>
        ({ commands }) =>
          commands.lift(this.name),
    };
  },
});
