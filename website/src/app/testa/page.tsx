import MarkdownRenderer from '@/components/blog/markdown-renderer'

const YourComponent = () => {
  const markdownContent = `
# Welcome to My README

This is a sample README file rendered using the MarkdownRenderer component.

## Features

- Renders headings
- Supports **bold** and *italic* text
- Renders lists (ordered and unordered)
- Supports [links](https://example.com)
- Renders images: ![Alt text](/placeholder.svg?height=200&width=300)
- Supports code blocks with syntax highlighting:

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Table Example

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |

> This is a blockquote. It can span multiple lines and can contain other Markdown elements.

`

  return <MarkdownRenderer markdown={markdownContent} />
}

export default YourComponent