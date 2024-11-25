import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    forms: defineTable({
        createdBy: v.string(),
        description: v.optional(v.string()),
        name: v.optional(v.string()),
        slug: v.string(),
      }).index("by_slug", ["slug"]),
    form_responses: defineTable({
      formId: v.id("forms"),
      slug: v.optional(v.string()),
      values: v.array(
        v.object({ name: v.string(), value: v.string() })
      ),
    }).index("by_formId", ["formId"]),
    form_fields: defineTable({
      formId: v.string(),
      name: v.string(),
      order: v.float64(),
      selectOptions: v.optional(v.array(v.string())),
      type: v.string(),
    }),
    highlights: defineTable({
      id: v.string(),
      title: v.string(),
      description: v.string(),
      timestamp:v.string(),
      website: v.string(),
    }),
    articles: defineTable({
      id: v.string(), // Unique identifier for each article
      title: v.string(), // Article title
      author: v.string(), // Article author
      date: v.string(), // Article date in ISO format
      content: v.array(v.any()), // List of content blocks
      markdown: v.optional(v.string()), // Optional markdown content
    }),
    
    // Define the structure of content blocks
    contentBlocks: defineTable({
      id: v.string(), // Unique identifier for each block
      type: v.string(), // Type of content: paragraph, heading, table, code, image
      text: v.optional(v.string()), // Optional text for paragraphs, headings
      level: v.optional(v.number()), // Optional level for headings
      data: v.optional(v.array(v.any())), // Optional data for tables
      language: v.optional(v.string()), // Optional language for code
      code: v.optional(v.string()), // Optional code snippet
      src: v.optional(v.string()), // Optional image source
      alt: v.optional(v.string()), // Optional image alt text
      caption: v.optional(v.string()), // Optional image caption
      originDataId: v.string(), // Reference to highlights table
    }),
    privacy_policy  : defineTable({
      
    })
});