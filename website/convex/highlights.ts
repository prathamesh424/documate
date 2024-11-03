import { query, mutation } from './_generated/server';
import { ConvexError, v } from 'convex/values';

// Mutation to add a highlight
export const addHighlight = mutation({
  args: {
    id: v.number(),
    title: v.string(),
    description: v.string(),
    timestamp:v.string(),
    website: v.string(),
  },
  handler: async (ctx, args) => {
    const newHighlightId = await ctx.db.insert('highlights', {
      id: args.id,
      title: args.title,
      description: args.description,
      timestamp: args.timestamp,
      website: args.website,
    });
    return newHighlightId;
  },
});

// Query to get all highlights
export const getHighlights = query({
  handler: async (ctx) => {
    return await ctx.db.query('highlights').collect();
  },
});

// Mutation to delete a highlight based on _id
export const deleteHighlights = mutation({
  args: { ids: v.array(v.id("highlights")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.delete(id);
    }
  },
});


