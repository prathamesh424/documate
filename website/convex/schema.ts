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

    categories: defineTable({
      id: v.number(),  
      type: v.string(), 
      name: v.string(), 
      websiteCount: v.optional(v.number()), // Optional: Number of websites in this category
      lastVisited: v.optional(v.string()), // Optional: Timestamp of last visit
      parentId: v.optional(v.number()), // Optional: Reference to parent category ID
      subCategories: v.optional(
        v.array(
          v.object({
            id: v.number(), // Subcategory ID
            type: v.string(), // Type of the subcategory
            name: v.string(), // Name of the subcategory
            websiteCount: v.optional(v.number()), // Optional: Number of websites
            lastVisited: v.optional(v.string()), // Optional: Last visited timestamp
          })
        )
      ), // Optional: Array of subcategory objects
    }),
    // Define the structure of broader categories
    broaderCategories: defineTable({
      id: v.string(), // Unique string identifier for broader categories
      name: v.string(), // Name of the broader category
      categories: v.array(v.number()), // Array of category IDs under this broader category
    }),

    apiKeys: defineTable({
      email: v.string(),
      keys: v.array(
        v.object({
          provider: v.string(),
          key: v.string(), 
          isDefault: v.boolean(),
          isEnabled: v.boolean(),
        })
      ),
    }).index("by_email", ["email"]),


    userSecrets: defineTable({
      email: v.string(),
      encryptedToken: v.string(),
    }),
    editorContents: defineTable({
      content: v.string(),
      createdAt: v.string(),
    }),
});
