"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { HeartDoodle, StarDoodle } from "@/components/doodles"
import { createClient } from "@/lib/supabase/client"
import {
  createRosterPlayer,
  deleteRosterPlayer,
  fetchRosterPlayers,
  updateRosterPlayer,
} from "@/lib/roster/players"
import {
  type Player,
  type PlayerStatus,
  PLAYER_STATUSES,
  RELATIONSHIP_STATUSES,
} from "./roster-types"
import { AddPlayerForm } from "./add-player-form"
import { EditPlayerDialog } from "./edit-player-dialog"
import { DeletePlayerDialog } from "./delete-player-dialog"

type SortOption = "lastUpdated" | "added" | "nickname"

export function RosterTable() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filter, setFilter] = useState<PlayerStatus | "All">("All")
  const [sortBy, setSortBy] = useState<SortOption>("lastUpdated")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadPlayers = useCallback(async () => {
    const supabase = createClient()
    setError(null)
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setPlayers([])
        setError("Sign in to view your roster.")
        return
      }

      const rows = await fetchRosterPlayers(supabase)
      setPlayers(rows)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load roster players."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPlayers()
  }, [loadPlayers])

  const filteredPlayers = players.filter(
    (p) => filter === "All" || p.status === filter
  )

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === "nickname") return a.nickname.localeCompare(b.nickname)
    if (sortBy === "added") {
      return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    }
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  })

  const handleAddPlayer = async (
    player: Omit<Player, "id" | "addedDate" | "lastUpdated">
  ) => {
    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Sign in to add players.")
        return
      }

      await createRosterPlayer(supabase, user.id, player)
      setShowAddForm(false)
      await loadPlayers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add player.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditPlayer = async (updated: Player) => {
    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      await updateRosterPlayer(supabase, updated)
      setEditingPlayer(null)
      await loadPlayers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update player.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePlayer = async (id: string) => {
    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      await deleteRosterPlayer(supabase, id)
      setDeletingPlayer(null)
      await loadPlayers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete player.")
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: PlayerStatus) => {
    switch (status) {
      case "Active":
        return "bg-card border-foreground/30 text-foreground"
      case "Reserve":
        return "bg-card border-brand-green text-brand-green"
      case "Free Agent":
        return "bg-card border-primary text-primary"
      case "Ghosted":
        return "bg-card border-muted-foreground text-muted-foreground"
      case "Removed":
        return "bg-card border-primary text-primary"
    }
  }

  const getRelationshipInfo = (status: Player["relationshipStatus"]) => {
    if (!status) return null
    return RELATIONSHIP_STATUSES.find((r) => r.value === status)
  }

  return (
    <section aria-labelledby="roster-heading" className="space-y-6">
      <PageHeader
        id="roster-heading"
        title="MY ROSTERS"
        subtitle="You're the coach. Build your roster. Track the potential."
        icon={<HeartDoodle className="size-8 text-primary" />}
        action={
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={isSaving}
            className="rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            {showAddForm ? "✕ CLOSE" : "+ ADD PLAYER"}
          </Button>
        }
      />

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {showAddForm && (
        <AddPlayerForm
          onAdd={handleAddPlayer}
          onCancel={() => setShowAddForm(false)}
          isSubmitting={isSaving}
        />
      )}

      {editingPlayer && (
        <EditPlayerDialog
          player={editingPlayer}
          onSave={handleEditPlayer}
          onCancel={() => setEditingPlayer(null)}
          isSubmitting={isSaving}
        />
      )}

      {deletingPlayer && (
        <DeletePlayerDialog
          player={deletingPlayer}
          onDelete={handleDeletePlayer}
          onCancel={() => setDeletingPlayer(null)}
          isSubmitting={isSaving}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/60 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            FILTER BY STATUS
          </span>
          <div className="flex gap-2">
            {(["All", ...PLAYER_STATUSES] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === status
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          >
            <option value="lastUpdated">Last Updated</option>
            <option value="added">Date Added</option>
            <option value="nickname">Nickname</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_auto] gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Nickname</span>
          <span>Status</span>
          <span>Relationship Status</span>
          <span>Added</span>
          <span>Last Updated</span>
          <span>Actions</span>
        </div>

        {isLoading ? (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">
            Loading roster...
          </p>
        ) : sortedPlayers.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">
            No players yet. Add your first roster player above.
          </p>
        ) : (
          sortedPlayers.map((player) => {
            const relationshipInfo = getRelationshipInfo(player.relationshipStatus)

            return (
              <div
                key={player.id}
                className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_auto] items-center gap-4 border-b border-border/50 px-6 py-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  {player.photoUrl ? (
                    <Image
                      src={player.photoUrl}
                      alt={player.nickname}
                      width={48}
                      height={48}
                      className="size-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{player.emoji}</span>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {player.nickname}
                      </span>
                      {player.status === "Active" &&
                        player.relationshipStatus === "Potential Partner" && (
                          <StarDoodle className="size-4 text-amber-500" />
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {player.description}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">
                      ID: {player.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                    player.status
                  )}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      player.status === "Active"
                        ? "bg-foreground"
                        : player.status === "Reserve"
                          ? "bg-brand-green"
                          : player.status === "Free Agent"
                            ? "bg-primary"
                            : player.status === "Ghosted"
                              ? "bg-muted-foreground"
                              : "bg-primary"
                    }`}
                  />
                  {player.status}
                </span>

                <div>
                  {relationshipInfo ? (
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{relationshipInfo.emoji}</span>
                      <div>
                        <p className="font-medium text-foreground">
                          {relationshipInfo.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {relationshipInfo.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">— {player.status}</span>
                  )}
                </div>

                <span className="text-sm text-foreground">{player.addedDate}</span>
                <span className="text-sm text-foreground">{player.lastUpdated}</span>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isSaving}
                    onClick={() => setEditingPlayer(player)}
                    aria-label={`Edit ${player.nickname}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isSaving}
                    onClick={() => setDeletingPlayer(player)}
                    aria-label={`Delete ${player.nickname}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <StarDoodle className="size-4" />
        <span className="font-script text-lg">Healthy rosters. Happy hearts.</span>
      </div>
    </section>
  )
}
