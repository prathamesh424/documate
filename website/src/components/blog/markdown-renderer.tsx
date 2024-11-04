'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'

interface MarkdownRendererProps {
  markdown: string
}

export default function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold mt-6 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-2xl font-medium mt-4 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-xl font-medium mt-3 mb-2" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-lg font-medium mt-2 mb-1" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-base font-medium mt-2 mb-1" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic" {...props} />
          ),
          img: ({ node, ...props }) => (
            <div className="mb-4">
              <Image
                src={props.src || ''}
                alt={props.alt || ''}
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="rounded-md mb-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>
                {children}
              </code>
            )
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-300" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-gray-50" {...props} />,
          th: ({ node, ...props }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}