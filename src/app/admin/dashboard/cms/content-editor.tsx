"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FileEdit, Save, RotateCcw, Loader2, Hash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ContentItem = {
  id: string;
  key: string;
  value: string;
  category: string;
};

type Props = {
  items: ContentItem[];
  categoryLabels: Record<string, string>;
  categoryOrder: string[];
};

export function ContentEditor({ items, categoryLabels, categoryOrder }: Props) {
  // Per-item draft overrides. When defined, the UI shows the draft value.
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  // Per-item "committed" value — what the server has saved. Overrides the
  // initial `item.value` after a successful save so the UI reflects the
  // latest persisted state without requiring a refetch.
  const [committed, setCommitted] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    for (const it of items) {
      if (!map[it.category]) map[it.category] = [];
      map[it.category].push(it);
    }
    const orderedCats = [
      ...categoryOrder.filter((c) => map[c]),
      ...Object.keys(map).filter((c) => !categoryOrder.includes(c)),
    ];
    return orderedCats.map((c) => ({
      category: c,
      label: categoryLabels[c] ?? c,
      items: map[c],
    }));
  }, [items, categoryLabels, categoryOrder]);

  function committedValue(item: ContentItem): string {
    return committed[item.id] ?? item.value;
  }
  function displayValue(item: ContentItem): string {
    return drafts[item.id] ?? committedValue(item);
  }
  function isDirty(item: ContentItem): boolean {
    return displayValue(item) !== committedValue(item);
  }
  const dirtyCount = items.filter(isDirty).length;

  function setDraft(id: string, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: value }));
  }
  function revert(item: ContentItem) {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
  }

  async function saveItem(item: ContentItem) {
    const value = displayValue(item);
    setSavingId(item.id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: item.key,
          value,
          category: item.category,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setCommitted((prev) => ({ ...prev, [item.id]: value }));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      toast.success(`Saved "${item.key}"`);
    } catch (e) {
      console.error(e);
      toast.error("Could not save. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  async function saveAll() {
    const dirtyItems = items.filter(isDirty);
    if (dirtyItems.length === 0) {
      toast.info("Nothing to save.");
      return;
    }
    let ok = 0;
    let failed = 0;
    for (const it of dirtyItems) {
      try {
        const res = await fetch("/api/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: it.key,
            value: displayValue(it),
            category: it.category,
          }),
        });
        if (!res.ok) throw new Error("Save failed");
        setCommitted((prev) => ({ ...prev, [it.id]: displayValue(it) }));
        setDrafts((prev) => {
          const next = { ...prev };
          delete next[it.id];
          return next;
        });
        ok += 1;
      } catch (e) {
        console.error(e);
        failed += 1;
      }
    }
    if (failed === 0) {
      toast.success(`Saved ${ok} item${ok === 1 ? "" : "s"}.`);
    } else {
      toast.error(`Saved ${ok}, ${failed} failed.`);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileEdit className="size-5 text-emerald-600" />
                Content Management
              </CardTitle>
              <CardDescription>
                Edit site-wide text. Changes go live on the next public page
                load.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {dirtyCount > 0 && (
                <Badge className="bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/30">
                  {dirtyCount} unsaved
                </Badge>
              )}
              <Button
                onClick={saveAll}
                disabled={dirtyCount === 0}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="size-4" />
                Save all
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grouped editors */}
      {grouped.map((group) => (
        <Card key={group.category}>
          <CardHeader>
            <CardTitle className="text-base">{group.label}</CardTitle>
            <CardDescription>
              {group.items.length} field{group.items.length === 1 ? "" : "s"} ·
              category:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                {group.category}
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {group.items.map((item) => {
              const val = displayValue(item);
              const dirty = isDirty(item);
              const isLong = val.length > 80 || val.includes("\n");
              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-lg border bg-card p-4 transition-colors",
                    dirty && "border-amber-300 bg-amber-50/40"
                  )}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <label
                      htmlFor={`content-${item.id}`}
                      className="flex items-center gap-1.5 text-sm font-medium leading-none select-none"
                    >
                      <Hash className="size-3 text-muted-foreground" />
                      <code className="text-xs font-medium text-foreground">
                        {item.key}
                      </code>
                    </label>
                    {dirty && (
                      <Badge
                        variant="outline"
                        className="border-amber-300 bg-amber-100 text-amber-800"
                      >
                        Unsaved
                      </Badge>
                    )}
                  </div>
                  {isLong ? (
                    <Textarea
                      id={`content-${item.id}`}
                      value={val}
                      onChange={(e) => setDraft(item.id, e.target.value)}
                      rows={Math.min(8, Math.max(3, val.split("\n").length + 1))}
                      className="min-h-[80px] font-mono text-sm"
                    />
                  ) : (
                    <Input
                      id={`content-${item.id}`}
                      value={val}
                      onChange={(e) => setDraft(item.id, e.target.value)}
                      className="font-mono text-sm"
                    />
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {val.length} characters
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!dirty || savingId === item.id}
                        onClick={() => revert(item)}
                      >
                        <RotateCcw className="size-3.5" />
                        Revert
                      </Button>
                      <Button
                        size="sm"
                        disabled={!dirty || savingId === item.id}
                        onClick={() => saveItem(item)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {savingId === item.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Save className="size-3.5" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
