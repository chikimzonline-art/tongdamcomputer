"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, GripVertical, Eye, EyeOff, X } from "lucide-react";
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
import {
  VENTURE_ICONS,
  VENTURE_ACCENTS,
  VENTURE_ICON_OPTIONS,
  VENTURE_ACCENT_OPTIONS,
} from "@/lib/venture-config";

type VentureData = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  badge: string;
  features: string[];
  accent: string;
  sortOrder: number;
  isActive: boolean;
};

type Props = {
  ventures: VentureData[];
};

export function VenturesEditor({ ventures: initial }: Props) {
  const [ventures, setVentures] = useState<VentureData[]>(initial);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  function updateField(id: string, field: keyof VentureData, value: unknown) {
    setVentures((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  }

  function updateFeature(id: string, index: number, value: string) {
    setVentures((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const features = [...v.features];
        features[index] = value;
        return { ...v, features };
      })
    );
  }

  function addFeature(id: string) {
    setVentures((prev) =>
      prev.map((v) => (v.id === id ? { ...v, features: [...v.features, ""] } : v))
    );
  }

  function removeFeature(id: string, index: number) {
    setVentures((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const features = v.features.filter((_, i) => i !== index);
        return { ...v, features };
      })
    );
  }

  async function saveVenture(v: VentureData) {
    setSavingId(v.id);
    try {
      const res = await fetch("/api/admin/ventures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: v.id,
          title: v.title,
          description: v.description,
          href: v.href,
          icon: v.icon,
          badge: v.badge,
          features: v.features,
          accent: v.accent,
          sortOrder: v.sortOrder,
          isActive: v.isActive,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(`Saved "${v.title}"`);
    } catch {
      toast.error("Failed to save venture");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteVenture(id: string) {
    try {
      const res = await fetch(`/api/admin/ventures?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setVentures((prev) => prev.filter((v) => v.id !== id));
      toast.success("Venture deleted");
    } catch {
      toast.error("Failed to delete venture");
    }
  }

  async function toggleActive(v: VentureData) {
    const newValue = !v.isActive;
    updateField(v.id, "isActive", newValue);
    try {
      const res = await fetch("/api/admin/ventures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: v.id, isActive: newValue }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(newValue ? "Venture shown" : "Venture hidden");
    } catch {
      toast.error("Failed to update");
      // Revert on failure
      updateField(v.id, "isActive", !newValue);
    }
  }

  async function addNew(data: {
    title: string;
    href: string;
    accent: string;
    icon: string;
  }) {
    try {
      const res = await fetch("/api/admin/ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          href: data.href,
          accent: data.accent,
          icon: data.icon,
          description: "",
          badge: "",
          features: [],
          sortOrder: ventures.length + 1,
          isActive: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const json = await res.json();
      setVentures((prev) => [
        ...prev,
        {
          id: json.item.id,
          title: json.item.title,
          description: json.item.description,
          href: json.item.href,
          icon: json.item.icon,
          badge: json.item.badge,
          features: [],
          accent: json.item.accent,
          sortOrder: json.item.sortOrder,
          isActive: json.item.isActive,
        },
      ]);
      toast.success("Venture created");
      setAdding(false);
    } catch {
      toast.error("Failed to create venture");
    }
  }

  return (
    <div className="space-y-4">
      {/* Add new venture button */}
      <div className="flex justify-end">
        <Button onClick={() => setAdding(true)} className="gap-2">
          <Plus className="size-4" />
          Add New Venture
        </Button>
      </div>

      {/* Add new dialog */}
      {adding && (
        <AddVentureDialog
          onCancel={() => setAdding(false)}
          onCreate={addNew}
        />
      )}

      {/* Venture cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {ventures.map((v) => {
          const Icon = VENTURE_ICONS[v.icon] ?? VENTURE_ICONS.Computer;
          const accent = VENTURE_ACCENTS[v.accent] ?? VENTURE_ACCENTS.emerald;
          return (
            <Card key={v.id} className={!v.isActive ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="size-4 text-muted-foreground" />
                  <span className={`flex size-8 items-center justify-center rounded-lg ${accent.iconBg} ${accent.iconText}`}>
                    <Icon className="size-4" />
                  </span>
                  <CardTitle className="text-base">
                    {v.title || "Untitled"}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={v.isActive}
                    onCheckedChange={() => toggleActive(v)}
                    aria-label="Toggle visibility"
                  />
                  {v.isActive ? (
                    <Eye className="size-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="size-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Title */}
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={v.title}
                    onChange={(e) => updateField(v.id, "title", e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Badge */}
                <div>
                  <Label className="text-xs">Badge (top-right pill)</Label>
                  <Input
                    value={v.badge}
                    onChange={(e) => updateField(v.id, "badge", e.target.value)}
                    className="mt-1"
                    placeholder="e.g. Authorized CSP • UCO Bank"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={v.description}
                    onChange={(e) => updateField(v.id, "description", e.target.value)}
                    className="mt-1 min-h-[70px]"
                  />
                </div>

                {/* Link + Sort order */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs">Link (route)</Label>
                    <Input
                      value={v.href}
                      onChange={(e) => updateField(v.id, "href", e.target.value)}
                      className="mt-1"
                      placeholder="/services/computer-works"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Sort order</Label>
                    <Input
                      type="number"
                      value={v.sortOrder}
                      onChange={(e) => updateField(v.id, "sortOrder", Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Icon + Accent */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs">Icon</Label>
                    <Select
                      value={v.icon}
                      onValueChange={(val) => updateField(v.id, "icon", val)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENTURE_ICON_OPTIONS.map((key) => {
                          const I = VENTURE_ICONS[key];
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
                    <Label className="text-xs">Accent color</Label>
                    <Select
                      value={v.accent}
                      onValueChange={(val) => updateField(v.id, "accent", val)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENTURE_ACCENT_OPTIONS.map((key) => (
                          <SelectItem key={key} value={key}>
                            {VENTURE_ACCENTS[key].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Features (bullet points)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addFeature(v.id)}
                      className="h-7 gap-1 text-xs"
                    >
                      <Plus className="size-3" />
                      Add
                    </Button>
                  </div>
                  <div className="mt-1 space-y-2">
                    {v.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={f}
                          onChange={(e) => updateFeature(v.id, i, e.target.value)}
                          placeholder="Feature text..."
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFeature(v.id, i)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))}
                    {v.features.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No features yet — click &ldquo;Add&rdquo; to create one.
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t pt-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete venture?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove &ldquo;{v.title}&rdquo; from the
                          home page. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteVenture(v.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    size="sm"
                    onClick={() => saveVenture(v)}
                    disabled={savingId === v.id}
                    className="gap-1"
                  >
                    <Save className="size-4" />
                    {savingId === v.id ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {ventures.length === 0 && !adding && (
        <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
          No ventures yet. Click &ldquo;Add New Venture&rdquo; to create one.
        </div>
      )}
    </div>
  );
}

/** Inline form for creating a new venture */
function AddVentureDialog({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (data: { title: string; href: string; accent: string; icon: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [href, setHref] = useState("/");
  const [accent, setAccent] = useState("emerald");
  const [icon, setIcon] = useState("Computer");

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="text-base">New Venture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
            placeholder="e.g. Computer Works"
            autoFocus
          />
        </div>
        <div>
          <Label className="text-xs">Link (route)</Label>
          <Input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            className="mt-1"
            placeholder="/services/..."
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
                {VENTURE_ICON_OPTIONS.map((key) => {
                  const I = VENTURE_ICONS[key];
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
                {VENTURE_ACCENT_OPTIONS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {VENTURE_ACCENTS[key].label}
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
            onClick={() => onCreate({ title, href, accent, icon })}
            disabled={!title.trim()}
          >
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
