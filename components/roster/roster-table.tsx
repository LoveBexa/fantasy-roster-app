"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeartDoodle, StarDoodle } from "@/components/doodles"
import {
  type Player,
  type PlayerStatus,
  PLAYER_STATUSES,
  RELATIONSHIP_STATUSES,
} from "./roster-types"
import { AddPlayerForm } from "./add-player-form"
import { EditPlayerDialog } from "./edit-player-dialog"
import { DeletePlayerDialog } from "./delete-player-dialog"

const initialPlayers: Player[] = [
  {
    id: "1",
    nickname: "Sunshine",
    description: "Top tier potential",
    emoji: "😎",
    status: "Active",
    relationshipStatus: "Potential Partner",
    addedDate: "May 10, 2026",
    lastUpdated: "May 18, 2026",
  },
  {
    id: "2",
    nickname: "Midnight Text",
    description: "Fun but inconsistent",
    emoji: "🤩",
    status: "Active",
    relationshipStatus: "Situationship",
    addedDate: "May 6, 2026",
    lastUpdated: "May 18, 2026",
  },
  {
    id: "3",
    nickname: "Cinema",
    description: "Good vibes only",
    emoji: "🍿",
    status: "Reserve",
    relationshipStatus: "Casual",
    addedDate: "Apr 28, 2026",
    lastUpdated: "May 15, 2026",
  },
  {
    id: "4",
    nickname: "Heatwave",
    description: "Chemistry insane",
    emoji: "🔥",
    status: "Active",
    relationshipStatus: "FWB",
    addedDate: "May 1, 2026",
    lastUpdated: "May 17, 2026",
  },
  {
    id: "5",
    nickname: "Breadcrumb",
    description: "Just enough to stay",
    emoji: "🧵",
    status: "Reserve",
    relationshipStatus: "Breadcrumber",
    addedDate: "Apr 20, 2026",
    lastUpdated: "May 13, 2026",
  },
  {
    id: "6",
    nickname: "Echo",
    description: "Always watching",
    emoji: "🪃",
    status: "Free Agent",
    relationshipStatus: "Orbiter",
    addedDate: "May 3, 2026",
    lastUpdated: "May 11, 2026",
  },
  {
    id: "7",
    nickname: "Vanished",
    description: "Poof.",
    emoji: "👻",
    status: "Ghosted",
    relationshipStatus: null,
    addedDate: "Apr 15, 2026",
    lastUpdated: "May 5, 2026",
  },
  {
    id: "8",
    nickname: "No Thanks",
    description: "Not my type",
    emoji: "❌",
    status: "Removed",
    relationshipStatus: null,
    addedDate: "Apr 1, 2026",
    lastUpdated: "Apr 30, 2026",
  },
]

type SortOption = "lastUpdated" | "added" | "nickname"

export function RosterTable() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [filter, setFilter] = useState<PlayerStatus | "All">("All")
  const [sortBy, setSortBy] = useState<SortOption>("lastUpdated")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null)

  const filteredPlayers = players.filter(
    (p) => filter === "All" || p.status === filter
  )

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === "nickname") return a.nickname.localeCompare(b.nickname)
    if (sortBy === "added") return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  })

  const handleAddPlayer = (player: Omit<Player, "id" | "addedDate" | "lastUpdated">) => {
    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    setPlayers([
      ...players,
      { ...player, id: crypto.randomUUID(), addedDate: now, lastUpdated: now },
    ])
    setShowAddForm(false)
  }

  const handleEditPlayer = (updated: Player) => {
    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    setPlayers(
      players.map((p) =>
        p.id === updated.id ? { ...updated, lastUpdated: now } : p
      )
    )
    setEditingPlayer(null)
  }

  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id))
    setDeletingPlayer(null)
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
        return "bg-primary/10 border-primary text-primary"
    }
  }

  const getRelationshipInfo = (status: Player["relationshipStatus"]) => {
    if (!status) return null
    return RELATIONSHIP_STATUSES.find((r) => r.value === status)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-5xl font-bold tracking-tight text-primary">
              MY ROSTERS
            </h1>
            <HeartDoodle className="size-8 text-primary" />
          </div>
          <p className="mt-2 font-script text-xl text-muted-foreground">
            You&apos;re the coach. Build your roster. Track the potential.
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {showAddForm ? "✕ CLOSE" : "+ ADD PLAYER"}
        </Button>
      </div>


      {/* Add Player Form */}
      {showAddForm && (
        <AddPlayerForm
          onAdd={handleAddPlayer}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Dialog */}
      {editingPlayer && (
        <EditPlayerDialog
          player={editingPlayer}
          onSave={handleEditPlayer}
          onCancel={() => setEditingPlayer(null)}
        />
      )}

      {/* Delete Dialog */}
      {deletingPlayer && (
        <DeletePlayerDialog
          player={deletingPlayer}
          onDelete={handleDeletePlayer}
          onCancel={() => setDeletingPlayer(null)}
        />
      )}

      
      {/* Filters & Sort */}
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

      {/* Table */}
      <div className="rounded-xl border border-border bg-card/40">
        <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_auto] gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Nickname</span>
          <span>Status</span>
          <span>Relationship Status</span>
          <span>Added</span>
          <span>Last Updated</span>
          <span>Actions</span>
        </div>

        {sortedPlayers.map((player) => {
          const relationshipInfo = getRelationshipInfo(player.relationshipStatus)
          return (
            <div
              key={player.id}
              className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_auto] items-center gap-4 border-b border-border/50 px-6 py-4 last:border-0"
            >
              {/* Nickname */}
              <div className="flex items-center gap-3">
                <span className="text-3xl">{player.emoji}</span>
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
                </div>
              </div>

              {/* Status */}
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

              {/* Relationship Status */}
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
                  <span className="text-muted-foreground">
                    — {player.status}
                  </span>
                )}
              </div>

              {/* Dates */}
              <span className="text-sm text-foreground">{player.addedDate}</span>
              <span className="text-sm text-foreground">{player.lastUpdated}</span>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingPlayer(player)}
                  aria-label={`Edit ${player.nickname}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingPlayer(player)}
                  aria-label={`Delete ${player.nickname}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer text */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <StarDoodle className="size-4" />
        <span className="font-script text-lg">Healthy rosters. Happy hearts.</span>
      </div>

    </div>
  )
}
