import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

export async function POST(req: Request) {
  const body = await req.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID! },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: content,
                },
              },
            ],
          },
        },
      ],
    });

    return NextResponse.json({ message: 'Page created successfully', response }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating page', error: error.message }, { status: 500 });
  }
}
