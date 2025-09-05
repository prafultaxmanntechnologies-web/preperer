"use client"

import { useMemo, useState } from "react"
import type { QAItem } from "@/lib/parse-qa"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Props = {
  items: QAItem[]
}

export default function QAList({ items }: Props) {
  const [query, setQuery] = useState("")
  const normalized = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!normalized) return items
    return items.filter((it) => {
      return it.question.toLowerCase().includes(normalized) || it.answerMarkdown.toLowerCase().includes(normalized)
    })
  }, [items, normalized])

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-4">
        <label className="mb-1 block text-xs font-mono text-muted-foreground">Search</label>
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions or answers..."
            aria-label="Search questions or answers"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="mt-2 text-xs text-muted-foreground">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </header>

      <Accordion type="multiple" className="w-full">
        {filtered.map((it) => (
          <AccordionItem key={it.id} value={it.id} className="border-b border-border">
            <AccordionTrigger className="text-left text-pretty">
              <span className="mr-2 inline-block min-w-6 text-muted-foreground">{it.number ?? ""}</span>
              {it.question}
            </AccordionTrigger>
            <AccordionContent>
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{it.answerMarkdown}</ReactMarkdown>
              </article>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
