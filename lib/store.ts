// In-memory store for submissions. Ephemeral and resets on redeploy or server restart.

export type SubmissionStatus = "pending" | "approved" | "rejected"
export type Submission = {
  id: string
  topic: "react" | "angular" | "javascript" | "node" | "system-design"
  question: string
  answer: string
  status: SubmissionStatus
  createdAt: number
}

const submissions: Submission[] = []

function genId() {
  // simple unique id
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const Store = {
  add(input: Omit<Submission, "id" | "status" | "createdAt">) {
    const item: Submission = {
      id: genId(),
      createdAt: Date.now(),
      status: "pending",
      ...input,
    }
    submissions.push(item)
    return item
  },
  list(opts?: { status?: SubmissionStatus; topic?: Submission["topic"] }) {
    return submissions
      .filter((s) => (opts?.status ? s.status === opts.status : true))
      .filter((s) => (opts?.topic ? s.topic === opts.topic : true))
      .sort((a, b) => b.createdAt - a.createdAt)
  },
  approve(id: string) {
    const item = submissions.find((s) => s.id === id)
    if (item) item.status = "approved"
    return item
  },
  reject(id: string) {
    const item = submissions.find((s) => s.id === id)
    if (item) item.status = "rejected"
    return item
  },
}
