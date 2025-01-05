/*

import "server-only";
import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/*
export const fatchPages = React.cache(() => {
  return notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Status",
      select: {
        equals: "Live",
      },
    },
  });
});

export const fetchBySlug = React.cache((slug: string) => {
  return notion.databases
    .query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: "slug",
        rich_text: {
          equals: slug,
        },
      },
    })
    .then((res) => res.results[0] as PageObjectResponse | undefined);
});

export const fetchPaageBlocks = React.cache((pageId:string) => {
    return notion.blocks.children.list({
        block_id:pageId,
    })
    .then((res) => res.results as BlockObjectResponse[]);
})
*/

/*
// read operation
export const getDatabase = async () => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
    });
    return response.results
  } catch (error) {
    console.error("Error fetching database:", error);
    throw error;
  }
};
*/



import { Client } from "@notionhq/client";

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_TOKEN, // Token from environment variables
});

// Centralize the database ID
export const databaseId = process.env.NOTION_DATABASE_ID;

if (!databaseId) {
  throw new Error("NOTION_DATABASE_ID is not set in environment variables");
}
