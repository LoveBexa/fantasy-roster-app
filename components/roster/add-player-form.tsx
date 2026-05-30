"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HeartDoodle, StarDoodle } from "@/components/doodles"
import {
  type Player,
  type PlayerStatus,
  type RelationshipStatus,
  PLAYER_STATUSES,
  RELATIONSHIP_STATUSES,
  EMOJI_OPTIONS,
} from "./roster-types"

interface AddPlayerFormProps {
  onAdd: (player: Omit<Player, "id" | "addedDate" | "lastUpdated">) => void
  onCancel: () => void
}

export function AddPlayerForm({ onAdd, onCancel }: AddPlayerFormProps) {
  const [nickname, setNickname] = useState("")
  const [description, setDescription] = useState("")
  const [emoji, setEmoji] = useState("😎")
  const [status, setStatus] = useState<PlayerStatus>("Active")
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>("Potential Partner")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    if (!nickname.trim()) return
    onAdd({
      nickname: nickname.trim(),
      description: description.trim() || "New player",
      emoji,
      status,
      relationshipStatus: status === "Ghosted" || status === "Removed" ? null : relationshipStatus,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-2xl font-bold text-primary">
          ADD NEW PLAYER
        </h2>
        <HeartDoodle className="size-6 text-primary" />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Nickname */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Nickname
          </label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Guitar Guy"
            className="mt-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PlayerStatus)}
            className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
          >
            {PLAYER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "Active" && "● "}
                {s === "Reserve" && "● "}
                {s === "Free Agent" && "● "}
                {s === "Ghosted" && "● "}
                {s === "Removed" && "● "}
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Relationship Status */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Relationship Status
          </label>
          <select
            value={relationshipStatus}
            onChange={(e) => setRelationshipStatus(e.target.value as RelationshipStatus)}
            disabled={status === "Ghosted" || status === "Removed"}
            className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground disabled:opacity-50"
          >
            {RELATIONSHIP_STATUSES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.emoji} {r.value}
              </option>
            ))}
          </select>
          {status !== "Ghosted" && status !== "Removed" && (
            <div className="mt-2 space-y-1 rounded-lg border border-border bg-background/50 p-3 text-xs">
              {RELATIONSHIP_STATUSES.map((r) => (
                <div key={r.value} className="flex items-start gap-2">
                  <span>{r.emoji}</span>
                  <span className="font-medium text-primary">{r.value}</span>
                  <span className="text-muted-foreground">{r.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Emoji Picker */}
      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Choose an Emoji
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`flex size-12 items-center justify-center rounded-lg border text-2xl transition-colors ${
                emoji === e
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="mt-2 text-sm text-primary hover:underline"
        >
          More emojis →
        </button>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Short Description
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Great listener, terrible texter"
          className="mt-2"
        />
      </div>

      {/* Notes */}
      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Notes (Optional)
        </label>
        <div className="relative mt-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 250))}
            placeholder="Add any tea... the vibes, the details, the red flags."
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
          <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {notes.length}/250
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <StarDoodle className="size-5 text-primary" />
        <Button variant="outline" onClick={onCancel}>
          CANCEL
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!nickname.trim()}
          className="bg-brand-green text-white hover:bg-brand-green/90"
        >
          ADD PLAYER
        </Button>
      </div>
    </div>
  )
}
