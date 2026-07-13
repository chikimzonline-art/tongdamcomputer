"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, X, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  AFFILIATION_ICONS,
  AFFILIATION_ACCENTS,
  AFFILIATION_ICON_OPTIONS,
  AFFILIATION_ACCENT_OPTIONS,
  DEFAULT_AFFILIATION_ACCENT,
} from "@/lib/affiliation-config";

type AffiliationData = {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  accent: string;
  sortOrder: number;
  isActive: boolean;
};

type Props = {
  affiliations: AffiliationData[];
};

export function AffiliationsEditor({ affiliations: initial }: Props) {
  const [affiliations, setAffiliations] = useState<AffiliationData[]>(initial);
  const [drafts, setDrafts] = useState<Record<string, Partial<AffiliationData>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  function display(a: AffiliationData): AffiliationData {
    const d = drafts[a.id];
    return d ? { ...a, ...d } : a;
  }
  function isDirty(a: AffiliationData): boolean {
    const d = drafts[a.id];
    if (!d) return false;
    return (Object.keys(d) as (keyof AffiliationData)[]).some(
      (k) => d[k] !== a[k]
    );
  }
  function setField(id: string, field: keyof AffiliationData, value: unknown) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [field]: value },
    }));
  }
  function revert(a: AffiliationData) {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[a.id];
      return next;
    });
  }

  async function save(a: AffiliationData) {
    const d = drafts[a.id];
    if (!d) return;
    setSavingId(a.id);
    try {
      const res = await fetch("/api/admin/affiliations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, ...d }),
      });
      if (!res.ok) throw new Error("Save failed");
      const merged = { ...a, ...d };
      setAffiliations((prev) =>
        prev.map((x) => (x.id === a.id ? merged : x))
      );
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[a.id];
        return next;
      });
      toast.success(`Saved "${merged.name}"`);
    } catch {
      toast.error("Failed to save affiliation");
    } finally {
      setSavingId(null);
    }
  }

  async function toggleActive(a: AffiliationData) {
    const newValue = !a.isActive;
    setField(a.id, "isActive", newValue);
    try {
      const res = await fetch("/api/admin/affiliations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, isActive: newValue }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setAffiliations((prev) =>
        prev.map((x) => (x.id === a.id ? { ...x, isActive: newValue } : x))
      );
      toast.success(newValue ? "Affiliation shown" : "Affiliation hidden");
    } catch {
      toast.error("Failed to update");
      setField(a.id, "isActive", !newValue);
    }
  }

  async function deleteAffiliation(a: AffiliationData) {
    setDeletingId(a.id);
    try {
      const res = await fetch(`/api/admin/affiliations?id=${a.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setAffiliations((prev) => prev.filter((x) => x.id !== a.id));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[a.id];
        return next;
      });
      toast.success(`Deleted "${a.name}"`);
    } catch {
      toast.error("Failed to delete affiliation");
    } finally {
      setDeletingId(null);
    }
  }

  async function createNew(data: {
    name: string;
    category: string;
    description: string;
    icon: string;
    accent: string;
  }) {
    try {
      const res = await fetch("/api/admin/affiliations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          category: data.category,
          description: data.description,
          icon: data.icon,
          accent: data.accent,
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const json = await res.json();
      const item = json.item as AffiliationData;
      setAffiliations((prev) => [...prev, item]);
      toast.success(`Created "${item.name}"`);
      setAdding(false);
    } catch {
      toast.error("Failed to create affiliation");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setAdding(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="size-4" />
          Add New Affiliation
        </Button>
      </div>

      {adding && (
        <AddAffiliationForm onCancel={() => setAdding(false)} onCreate={createNew} />
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {affiliations.map((raw) => {
          const a = display(raw);
          const dirty = isDirty(raw);
          const Icon = AFFILIATION_ICONS[a.icon] ?? AFFILIATION_ICONS.BadgeCheck;
          const accentCfg = AFFILIATION_ACCENTS[a.accent] ?? DEFAULT_AFFILIATION_ACCENT;
          return (
            <Card key={raw.id} className={cn(!a.isActive && "opacity-60")}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="size-4 text-muted-foreground" />
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                      accentCfg.gradient
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <CardTitle className="text-base">{a.name || "Untitled"}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={a.isActive}
                    onCheckedChange={() => toggleActive(raw)}
                    aria-label="Toggle visibility"
                  />
                  {a.isActive ? (
                    <Eye className="size-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="size-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={a.name}
                    onChange={(e) => setField(raw.id, "name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Category</Label>
                  <Input
                    value={a.category}
                    onChange={(e) => setField(raw.id, "category", e.target.value)}
                    className="mt-1"
                    placeholder="e.g. Banking Partner"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={a.description}
                    onChange={(e) => setField(raw.id, "description", e.target.value)}
                    className="mt-1 min-h-[70px]"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <Label className="text-xs">Icon</Label>
                    <Select
                      value={a.icon}
                      onValueChange={(v) => setField(raw.id, "icon", v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AFFILIATION_ICON_OPTIONS.map((key) => {
                          const I = AFFILIATION_ICONS[key];
                          return (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center gap-2">
                                <I className="size-4" />
                                {key}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Accent</Label>
                    <Select
                      value={a.accent}
                      onValueChange={(v) => setField(raw.id, "accent", v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AFFILIATION_ACCENT_OPTIONS.map((key) => (
                          <SelectItem key={key} value={key}>
                            {AFFILIATION_ACCENTS[key].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Sort order</Label>
                    <Input
                      type="number"
                      value={a.sortOrder}
                      onChange={(e) => setField(raw.id, "sortOrder", Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === raw.id}
                        className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        {deletingId === raw.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete affiliation?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove &ldquo;{a.name}&rdquo; from
                          the home page carousel. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteAffiliation(raw)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!dirty || savingId === raw.id}
                      onClick={() => revert(raw)}
                    >
                      Revert
                    </Button>
                    <Button
                      size="sm"
                      disabled={!dirty || savingId === raw.id}
                      onClick={() => save(raw)}
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {savingId === raw.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Save className="size-3.5" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {affiliations.length === 0 && !adding && (
        <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
          No affiliations yet. Click &ldquo;Add New Affiliation&rdquo; to create one.
        </div>
      )}
    </div>
  );
}

/** Inline form for creating a new affiliation */
function AddAffiliationForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (data: {
    name: string;
    category: string;
    description: string;
    icon: string;
    accent: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("BadgeCheck");
  const [accent, setAccent] = useState("emerald");

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">New Affiliation</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onCancel}
            aria-label="Cancel"
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs">Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              placeholder="e.g. Marriott International"
              autoFocus
            />
          </div>
          <div>
            <Label className="text-xs">Category *</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1"
              placeholder="e.g. Premier Placement Partner"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 min-h-[60px]"
            placeholder="Short description..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AFFILIATION_ICON_OPTIONS.map((key) => {
                  const I = AFFILIATION_ICONS[key];
                  return (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <I className="size-4" />
                        {key}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Accent</Label>
            <Select value={accent} onValueChange={setAccent}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AFFILIATION_ACCENT_OPTIONS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {AFFILIATION_ACCENTS[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => onCreate({ name, category, description, icon, accent })}
            disabled={!name.trim() || !category.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
