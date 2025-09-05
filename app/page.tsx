import { parseQA } from "@/lib/parse-qa"
import Link from "next/link"
import { TOPICS } from "@/lib/topics"

const README_URLS = [
  "https://raw.githubusercontent.com/prafulk9155/reactjs-interview-questions/master/README.md",
  "https://raw.githubusercontent.com/prafulk9155/reactjs-interview-questions/main/README.md",
]

async function fetchReadme(): Promise<string> {
  for (const url of README_URLS) {
    try {
      const res = await fetch(url, { cache: "no-store" })
      if (res.ok) {
        return await res.text()
      }
    } catch {
      // try next
    }
  }
  throw new Error("Unable to load README.md from GitHub")
}

export default async function Page() {
  const markdown = await fetchReadme()
  const items = parseQA(markdown)

  const entries = Object.entries(TOPICS) as [keyof typeof TOPICS, (typeof TOPICS)[keyof typeof TOPICS]][]

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded border border-dashed px-2 py-1 text-xs text-muted-foreground">
          <span className="font-mono">Interview Prep</span>
          <span className="text-primary">v1.0</span>
        </div>
        <h1 className="mt-3 text-pretty text-3xl font-semibold font-mono">Coder Q&A Library</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          One-source format pulled directly from public GitHub repositories. Add your own questions and get them
          approved to appear across topics.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Link href="/submit" className="rounded-md border px-3 py-2 text-sm hover:bg-accent">
            Submit a question
          </Link>
          <Link href="/admin" className="rounded-md border px-3 py-2 text-sm hover:bg-accent">
            Admin
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([key, t]) => (
          <Link
            key={key}
            href={`/t/${key}`}
            className="group block rounded-lg border border-primary/30 bg-background p-4 transition hover:border-primary"
          >
            <div className="mb-2 inline-flex items-center gap-2 rounded border border-dashed px-2 py-1 text-[10px] font-mono text-muted-foreground">
              <span>{key.toUpperCase()}</span>
            </div>
            <h2 className="text-lg font-semibold">{t.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
            <div className="mt-3 text-xs text-primary">Open Q&A →</div>
          </Link>
        ))}
      </section>

      <footer className="mt-10 text-xs text-muted-foreground">
        Source of truth: GitHub README + approved community submissions.
      </footer>
    </main>
  )
}
