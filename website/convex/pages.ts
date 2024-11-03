
// convex/mutations.ts
import { mutation, query } from "./_generated/server";
import { v4 as uuid } from "uuid"; // For generating unique IDs
import { v } from "convex/values";
export interface Highlight {
    title: string;       // Title of the highlight
    description: string; // Description of the highlight
    timestamp: string;   // Timestamp of when the highlight was created
    website: string;     // Website URL associated with the highlight
  }
// Mutation to add a highlight
// Mutation to add a highlight
export const addHighlight = mutation({
  args: {
    title: v.string(),        // Validate title as a string
    description: v.string(),  // Validate description as a string
    timestamp: v.string(),    // Validate timestamp as a string
    website: v.string(),      // Validate website as a string
  },
  handler: async (ctx, args) => {
    const highlightId = uuid(); // Generate a unique ID for the highlight

    // Insert the highlight into the database
    await ctx.db.insert("highlights", {
      id: highlightId,
      title: args.title,
      description: args.description,
      timestamp: args.timestamp,
      website: args.website,
    });

    return highlightId; // Return the highlight ID
  },
});
// Mutation to add an article
export const addArticle = mutation({
    args: {
      title: v.string(), // Validate title as a string
      author: v.string(), // Validate author as a string
      date: v.string(), // Validate date as a string
      content: v.array(v.object({ // Validate content as an array of objects
        id: v.string(), // Each block should have a string ID
        originDataId: v.string(), // Each block should reference the highlight ID
        type: v.string(), // Validate type of content (e.g., paragraph, heading)
        text: v.string(), // Validate text for the content block
        // Additional fields can be added here if needed
        language: v.optional(v.string()), // Optional field for code blocks
        code: v.optional(v.string()), // Optional field for code blocks
        data: v.optional(v.array(v.array(v.string()))), // Optional for tables
        src: v.optional(v.string()), // Optional for images
        alt: v.optional(v.string()), // Optional for images
        caption: v.optional(v.string()), // Optional for images
      })),
    },
    handler: async (ctx, args) => {
      // First, insert all content blocks and collect their IDs
      const contentBlockIds = await Promise.all(
        args.content.map(async (block) => {
          const blockId = uuid(); // Generate a unique ID for the content block
  
          // Insert the content block into the database
          await ctx.db.insert("contentBlocks", {
            id: blockId,
            originDataId: block.originDataId,
            type: block.type,
            text: block.text,
            language: block.language,
            code: block.code,
            data: block.data,
            src: block.src,
            alt: block.alt,
            caption: block.caption,
          });
  
          return blockId; // Return the ID of the inserted content block
        })
      );
  
      // Now, create the article with the collected content block IDs
      const articleId = uuid(); // Generate a unique ID for the article
      await ctx.db.insert("articles", {
        id: articleId,
        title: args.title,
        author: args.author,
        date: args.date,
        content: contentBlockIds, // Use the IDs of the inserted content blocks
      });
  
      return articleId; // Return the article ID
    },
  });
  export const addContentBlock = mutation({
    args: {
      originDataId: v.string(), // Validate originDataId as a string
      type: v.string(),         // Validate type of content (e.g., paragraph, heading, etc.)
      text: v.optional(v.string()), // Optional text for paragraphs and headings
      language: v.optional(v.string()), // Optional language for code blocks
      code: v.optional(v.string()), // Optional code snippet for code blocks
      data: v.optional(v.array(v.array(v.string()))), // Optional for tables
      src: v.optional(v.string()), // Optional image source for images
      alt: v.optional(v.string()), // Optional alt text for images
      caption: v.optional(v.string()), // Optional caption for images
    },
    handler: async (ctx, args) => {
      const blockId = uuid(); // Generate a unique ID for the content block
  
      // Insert the content block into the database
      await ctx.db.insert("contentBlocks", {
        id: blockId,
        originDataId: args.originDataId,
        type: args.type,
        text: args.text,
        language: args.language,
        code: args.code,
        data: args.data,
        src: args.src,
        alt: args.alt,
        caption: args.caption,
      });
  
      return blockId; // Return the ID of the newly inserted content block
    },
  });

  export const getPages = query({
    args: { author: v.string() },
    handler: async (ctx,args) => {
      return await ctx.db.query('articles').filter((q) => q.eq(q.field("author"), args.author)).collect();
    },
  });
  
const prompt_text=`
You are tasked with transforming the provided data into a specific structured format for an article. The desired format is as follows:

{
  title: "Article Title",
  author: "Author Name",
  date: "Publication Date",
  content: [
    { id: "1", type: "paragraph", text: "Paragraph text here.", originDataId: "originalDataId1" },
    { id: "2", type: "heading", level: 2, text: "Heading text here.", originDataId: "originalDataId2" },
    { id: "3", type: "paragraph", text: "Another paragraph here.", originDataId: "originalDataId3" },
    { id: "4", type: "table", data: [["Header 1", "Header 2"], ["Row 1 Col 1", "Row 1 Col 2"]], originDataId: "originalDataId4" },
    { id: "5", type: "code", language: "languageType", code: code snippet here, originDataId: "originalDataId5" }
  ]
};
Instructions:
Extract the Key Information:

From the given input data, identify the title, author, and publication date.
The title is derived from the title field in the input.
The author can be inferred from the content or can be a placeholder if not explicitly mentioned.
The publication date can be extracted from the timestamp field, formatted appropriately.
Content Structuring:

The content should be an array of objects, where each object represents a distinct part of the article:
Paragraphs: Represented with type: "paragraph" and containing text from the description field of each entry.
Headings: Use type: "heading" with appropriate levels (e.g., level 1 or level 2) for the titles or significant sections in the input data.
Tables: If there are any structured lists or data, they should be formatted as tables.
Code Blocks: If there's any code snippet provided, it should be represented with type: "code", including the language if applicable.
Example Input Data: The input data is as follows:

[
  {
    "description": "Voice Cloning... datasets...",
    "id": "jashwanth0712@gmail.com",
    "timestamp": "2024-11-03T05:57:19.651Z",
    "title": "paperswithcode.com",
    "website": "https://paperswithcode.com/task/voice-cloning"
  },
  {
    "description": "Last week we hit a major milestone in AI voice cloning...",
    "id": "jashwanth0712@gmail.com",
    "timestamp": "2024-11-03T05:57:03.774Z",
    "title": "medium.com",
    "website": "https://medium.com/@todasco/deep-fakes-for-all-the-proliferation-of-ai-voice-cloning-ecee0a461dac"
  }
]
Expected Output: The output should match the specified JavaScript structure for initialArticleContent with the appropriate content from the input.

Your Task:
Convert the provided input data into the specified structure while adhering to the instructions outlined above. Make sure to include a logical flow of paragraphs and headings based on the content provided. , the input data is :- 


`
