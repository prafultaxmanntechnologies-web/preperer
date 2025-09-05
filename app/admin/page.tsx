"use client"

import type React from "react"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TOPICS } from "@/lib/topics"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [logged, setLogged] = useState(false)
  const [topicFilter, setTopicFilter] = useState<string>("all")

  const { data, mutate } = useSWR(
    logged ? `/api/submissions?status=pending${topicFilter !== "all" ? `&topic=${topicFilter}` : ""}` : null,
    fetcher,
  )

  useEffect(() => {
    // ping to check cookie
    fetch("/api/submissions?status=pending").then((r) => {
      if (r.status !== 401) setLogged(true)
    })
  }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      setLogged(true)
      toast({ title: "Logged in", description: "Admin session started." })
      mutate()
    } else {
      toast({ title: "Invalid credentials", description: "Please check email/password." })
    }
  }

  async function act(url: string, id: string) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      mutate()
    } else {
      toast({ title: "Action failed", description: await res.text() })
    }
  }

  if (!logged) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-xl font-semibold font-mono">Admin Login</h1>
        <form onSubmit={login} className="mt-6 space-y-4 rounded-lg border border-dashed p-4">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@prep" />
          </div>
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="apply@123"
            />
          </div>
          <div className="flex items-center justify-end">
            <Button type="submit">Sign in</Button>
          </div>
          <p className="text-xs text-muted-foreground">Use admin@prep / apply@123</p>
        </form>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold font-mono">Pending Submissions</h1>
        <Select value={topicFilter} onValueChange={setTopicFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All topics</SelectItem>
            {Object.values(TOPICS).map((t) => (
              <SelectItem key={t.key} value={t.key}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => mutate()}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {(data?.items ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending submissions.</p>
        ) : (
          (data.items as any[]).map((s) => (
            <Card key={s.id} className="border-l-2 border-l-primary">
              <CardHeader>
                <CardTitle className="text-sm font-mono">{s.topic.toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">Question</div>
                  <div className="font-medium">{s.question}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Answer</div>
                  <pre className="whitespace-pre-wrap text-sm">{s.answer}</pre>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => act("/api/admin/reject", s.id)}>
                    Reject
                  </Button>
                  <Button onClick={() => act("/api/admin/approve", s.id)}>Approve</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
