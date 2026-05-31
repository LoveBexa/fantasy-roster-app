"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  type Player,
  type PlayerStatus,
  type RelationshipStatus,
  PLAYER_STATUSES,
  RELATIONSHIP_STATUSES,
  EMOJI_OPTIONS,
} from "./roster-types"

interface EditPlayerDialogProps {
  player: Player
  onSave: (player: Player) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function EditPlayerDialog({
  player,
  onSave,
  onCancel,
  isSubmitting = false,
}: EditPlayerDialogProps) {
  const [nickname, setNickname] = useState(player.nickname)
  const [description, setDescription] = useState(player.description)
  const [emoji, setEmoji] = useState(player.emoji)
  const [status, setStatus] = useState<PlayerStatus>(player.status)
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus | null>(
    player.relationshipStatus
  )
  const [notes, setNotes] = useState(player.notes || "")

  const handleSave = async () => {
    if (!nickname.trim()) return
    await onSave({
      ...player,
      nickname: nickname.trim(),
      description: description.trim(),
      emoji,
      status,
      relationshipStatus:
        status === "Ghosted" || status === "Removed" ? null : relationshipStatus,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">
            Edit Player
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Emoji + Nickname */}
          <div className="space-y-4">
            <div className="shrink-0">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Emoji
              </label>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border bg-background/50 p-2">
                <div className="flex flex-wrap gap-1">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`flex size-9 items-center justify-center rounded border text-xl ${
                        emoji === e
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nickname
              </label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              {PLAYER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Status */}
          {status !== "Ghosted" && status !== "Removed" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Relationship Status
              </label>
              <select
                value={relationshipStatus || "Potential Partner"}
                onChange={(e) =>
                  setRelationshipStatus(e.target.value as RelationshipStatus)
                }
                className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                {RELATIONSHIP_STATUSES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.emoji} {r.value}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 250))}
              rows={2}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleSave()}
            disabled={!nickname.trim() || isSubmitting}
            className="bg-primary text-primary-foreground"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
