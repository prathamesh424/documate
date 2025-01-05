import { mutation } from "convex/server";

export const saveContent = mutation(async ({ db }, { content }: { content: string }) => {
  return db.insert("editorContents", {
    content,
    createdAt: new Date().toISOString(),
  });
});
