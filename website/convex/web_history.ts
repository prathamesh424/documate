import { query, mutation } from './_generated/server'; 
import { v } from 'convex/values';

export const uploadCategoriesAndBroaderCategories = mutation({
  args: {
    newCategories: v.array(
      v.object({
        id: v.number(),
        type: v.string(),
        name: v.string(),
        websiteCount: v.optional(v.number()),
        lastVisited: v.optional(v.string()),
        parentId: v.optional(v.number()),
      })
    ),
    newBroaderCategories: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        categories: v.array(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
     const categoryMap: Record<number, any> = {};

     for (const category of args.newCategories) {
      if (category.parentId) {
         const parentCategory = await ctx.db
          .query('categories')
          .filter((q) => q.eq(q.field('id'), category.parentId))
          .unique();

        if (parentCategory) {
           const subCategories = [
            ...(parentCategory.subCategories || []),
            {
              id: category.id,
              type: category.type,
              name: category.name,
              websiteCount: category.websiteCount,
              lastVisited: category.lastVisited,
            },
          ];
          
          const res  = await ctx.db.patch(parentCategory._id, { subCategories }); 
        }
      } else {
        const insertedCategory = await ctx.db.insert('categories', category);
        categoryMap[category.id] = insertedCategory;
      }
    }
    for (const broaderCategory of args.newBroaderCategories) {
      await ctx.db.insert('broaderCategories', broaderCategory);
    }
  },
});





export const fetchCategoriesAndBroaderCategories = query({
  args: {},
  handler: async (ctx) => {
    const allCategories = await ctx.db.query('categories').collect();
    const recentCategories = allCategories.filter(category => category.type === 'recent');
    const mostVisitedCategories = allCategories.filter(category => category.type === 'mostVisited');
    const broaderCategories = await ctx.db.query('broaderCategories').collect();
    return {
      recentCategories,
      mostVisitedCategories,
      broaderCategories,
    };
  },
});

