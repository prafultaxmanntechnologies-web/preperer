export type QAItem = {
  id: string
  number?: number
  question: string
  answerMarkdown: string
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)
}

/**
 * Parse README markdown for "N. ### Question" headings
 * and collect the following lines as the answer until the next matching heading.
 */
export function parseQA(markdown: string): QAItem[] {
  const lines = markdown.split(/\r?\n/)
  const qa: QAItem[] = []

  let current: { number?: number; question: string; startIndex: number } | null = null
  let answerLines: string[] = []

  const headingRe = /^(\d+)\.\s+###\s+(.*)$/

  const flush = () => {
    if (current) {
      qa.push({
        id: `q-${current.number ?? qa.length + 1}-${slugify(current.question)}`,
        number: current.number,
        question: current.question.trim(),
        answerMarkdown: answerLines.join("\n").trim(),
      })
    }
    current = null
    answerLines = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(headingRe)
    if (m) {
      // Encountered a new question - flush previous
      flush()
      current = { number: Number(m[1]), question: m[2], startIndex: i }
      // Skip the heading line; answers start after this
      continue
    }
    // Accumulate as part of the current answer if we are inside one
    if (current) {
      answerLines.push(line)
    }
  }
  // Final flush
  flush()

  // Filter out empty entries just in case
  return qa.filter((x) => x.question && x.answerMarkdown)
}
