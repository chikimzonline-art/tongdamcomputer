"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadButton as UTUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/uploadthing";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  X,
  FolderOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { VALUE_ICONS, VALUE_ICON_OPTIONS } from "@/lib/value-config";
import { ExistingFilePicker } from "@/components/admin/existing-file-picker";

type MilestoneData = {
  id: string;
  year: string;
  title: string;
  detail: string;
  sortOrder: number;
  isActive: boolean;
};

type CoreValueData = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
};

type Props = {
  content: Record<string, string>;
  milestones: MilestoneData[];
  coreValues: CoreValueData[];
};

// Fields shown in the text-content section
const TEXT_FIELDS: { key: string; label: string; type: "input" | "textarea"; rows?: number; placeholder?: string }[] = [
  { key: "about.heroTitle", label: "Hero Title", type: "input", placeholder: "About Tongdam Computers" },
  { key: "about.heroSubtitle", label: "Hero Subtitle", type: "input", placeholder: "A local initiative that became a multi-sector anchor." },
  { key: "about.storyP1", label: "Story — Paragraph 1", type: "textarea", rows: 4 },
  { key: "about.storyP2", label: "Story — Paragraph 2", type: "textarea", rows: 4 },
  { key: "about.storyP3", label: "Story — Paragraph 3", type: "textarea", rows: 4 },
  { key: "about.tagline", label: "Tagline (below story)", type: "input", placeholder: "Serving the community with dedication since 2020." },
  { key: "about.founderQuote", label: "Founder's Words (quote)", type: "textarea", rows: 3 },
  { key: "about.mission", label: "Our Mission", type: "textarea", rows: 3 },
  { key: "about.vision", label: "Our Vision", type: "textarea", rows: 3 },
  { key: "about.timelineHeading", label: "Timeline Heading", type: "input", placeholder: "Growth timeline" },
  { key: "about.timelineSubtitle", label: "Timeline Subtitle", type: "input" },
  { key: "about.valuesHeading", label: "Core Values Heading", type: "input", placeholder: "Core values we live by" },
  { key: "about.valuesSubtitle", label: "Core Values Subtitle", type: "input" },
  { key: "about.ctaTitle", label: "CTA Title", type: "input", placeholder: "Want to be part of our journey?" },
  { key: "about.ctaDescription", label: "CTA Description", type: "textarea", rows: 2 },
];

export function AboutEditor({ content: initialContent, milestones: initialMilestones, coreValues: initialValues }: Props) {
  const [content, setContent] = useState<Record<string, string>>(initialContent);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Founder image
  const founderImageUrl = content["about.founderImageUrl"] ?? "";
  const [showFilePicker, setShowFilePicker] = useState(false);

  // Milestones
  const [milestones, setMilestones] = useState<MilestoneData[]>(initialMilestones);
  const [milestoneDrafts, setMilestoneDrafts] = useState<Record<string, Partial<MilestoneData>>>({});
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [milestoneSaving, setMilestoneSaving] = useState<string | null>(null);
  const [milestoneDeleting, setMilestoneDeleting] = useState<string | null>(null);

  // Core values
  const [coreValues, setCoreValues] = useState<CoreValueData[]>(initialValues);
  const [valueDrafts, setValueDrafts] = useState<Record<string, Partial<CoreValueData>>>({});
  const [addingValue, setAddingValue] = useState(false);
  const [valueSaving, setValueSaving] = useState<string | null>(null);
  const [valueDeleting, setValueDeleting] = useState<string | null>(null);

  // === Text content ===
  function updateContent(key: string, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setDirtyKeys((prev) => new Set(prev).add(key));
  }

  async function saveContent(key: string) {
    setSavingKey(key);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: content[key] ?? "", category: "about" }),
      });
      if (!res.ok) throw new Error("Save failed");
      setDirtyKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingKey(null);
    }
  }

  async function saveAllContent() {
    const keys = Array.from(dirtyKeys);
    if (keys.length === 0) {
      toast.info("Nothing to save");
      return;
    }
    setSavingKey("all");
    try {
      await Promise.all(
        keys.map((key) =>
          fetch("/api/admin/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value: content[key] ?? "", category: "about" }),
          })
        )
      );
      setDirtyKeys(new Set());
      toast.success(`Saved ${keys.length} field${keys.length === 1 ? "" : "s"}`);
    } catch {
      toast.error("Failed to save some fields");
    } finally {
      setSavingKey(null);
    }
  }

  // === Founder image ===
  async function saveFounderImage(url: string) {
    updateContent("about.founderImageUrl", url);
    setSavingKey("about.founderImageUrl");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "about.founderImageUrl", value: url, category: "about" }),
      });
      if (!res.ok) throw new Error("Save failed");
      setDirtyKeys((prev) => { const n = new Set(prev); n.delete("about.founderImageUrl"); return n; });
      toast.success("Founder image updated");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingKey(null);
    }
  }

  // === Milestones ===
  function displayMilestone(m: MilestoneData): MilestoneData {
    const d = milestoneDrafts[m.id];
    return d ? { ...m, ...d } : m;
  }
  function isMilestoneDirty(m: MilestoneData): boolean {
    const d = milestoneDrafts[m.id];
    if (!d) return false;
    return (Object.keys(d) as (keyof MilestoneData)[]).some((k) => d[k] !== m[k]);
  }
  function setMilestoneField(id: string, field: keyof MilestoneData, value: unknown) {
    setMilestoneDrafts((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), [field]: value } }));
  }
  function revertMilestone(m: MilestoneData) {
    setMilestoneDrafts((prev) => { const n = { ...prev }; delete n[m.id]; return n; });
  }
  async function saveMilestone(m: MilestoneData) {
    const d = milestoneDrafts[m.id];
    if (!d) return;
    setMilestoneSaving(m.id);
    try {
      const res = await fetch("/api/admin/milestones", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: m.id, ...d }) });
      if (!res.ok) throw new Error("Save failed");
      const merged = { ...m, ...d };
      setMilestones((prev) => prev.map((x) => (x.id === m.id ? merged : x)));
      setMilestoneDrafts((prev) => { const n = { ...prev }; delete n[m.id]; return n; });
      toast.success("Milestone saved");
    } catch { toast.error("Failed to save milestone"); }
    finally { setMilestoneSaving(null); }
  }
  async function deleteMilestone(m: MilestoneData) {
    setMilestoneDeleting(m.id);
    try {
      const res = await fetch(`/api/admin/milestones?id=${m.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setMilestones((prev) => prev.filter((x) => x.id !== m.id));
      toast.success("Milestone deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setMilestoneDeleting(null); }
  }
  async function createMilestone(data: { year: string; title: string; detail: string }) {
    try {
      const res = await fetch("/api/admin/milestones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Create failed");
      const json = await res.json();
      setMilestones((prev) => [...prev, json.item]);
      toast.success("Milestone created");
      setAddingMilestone(false);
    } catch { toast.error("Failed to create milestone"); }
  }

  // === Core values ===
  function displayValue(v: CoreValueData): CoreValueData {
    const d = valueDrafts[v.id];
    return d ? { ...v, ...d } : v;
  }
  function isValueDirty(v: CoreValueData): boolean {
    const d = valueDrafts[v.id];
    if (!d) return false;
    return (Object.keys(d) as (keyof CoreValueData)[]).some((k) => d[k] !== v[k]);
  }
  function setValueField(id: string, field: keyof CoreValueData, value: unknown) {
    setValueDrafts((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), [field]: value } }));
  }
  function revertValue(v: CoreValueData) {
    setValueDrafts((prev) => { const n = { ...prev }; delete n[v.id]; return n; });
  }
  async function saveValue(v: CoreValueData) {
    const d = valueDrafts[v.id];
    if (!d) return;
    setValueSaving(v.id);
    try {
      const res = await fetch("/api/admin/core-values", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: v.id, ...d }) });
      if (!res.ok) throw new Error("Save failed");
      const merged = { ...v, ...d };
      setCoreValues((prev) => prev.map((x) => (x.id === v.id ? merged : x)));
      setValueDrafts((prev) => { const n = { ...prev }; delete n[v.id]; return n; });
      toast.success("Value saved");
    } catch { toast.error("Failed to save"); }
    finally { setValueSaving(null); }
  }
  async function deleteValue(v: CoreValueData) {
    setValueDeleting(v.id);
    try {
      const res = await fetch(`/api/admin/core-values?id=${v.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCoreValues((prev) => prev.filter((x) => x.id !== v.id));
      toast.success("Value deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setValueDeleting(null); }
  }
  async function createValue(data: { title: string; description: string; icon: string }) {
    try {
      const res = await fetch("/api/admin/core-values", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Create failed");
      const json = await res.json();
      setCoreValues((prev) => [...prev, json.item]);
      toast.success("Value created");
      setAddingValue(false);
    } catch { toast.error("Failed to create"); }
  }

  return (
    <div className="space-y-6">
      {/* ===== TEXT CONTENT ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Text Content</CardTitle>
            <div className="flex items-center gap-2">
              {dirtyKeys.size > 0 && (
                <Badge className="bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/30">
                  {dirtyKeys.size} unsaved
                </Badge>
              )}
              <Button
                size="sm"
                onClick={saveAllContent}
                disabled={dirtyKeys.size === 0 || savingKey === "all"}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
              >
                {savingKey === "all" ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                Save All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {TEXT_FIELDS.map((field) => (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <div className="mt-1 flex gap-2">
                {field.type === "input" ? (
                  <Input
                    value={content[field.key] ?? ""}
                    onChange={(e) => updateContent(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1"
                  />
                ) : (
                  <Textarea
                    value={content[field.key] ?? ""}
                    onChange={(e) => updateContent(field.key, e.target.value)}
                    rows={field.rows ?? 3}
                    placeholder={field.placeholder}
                    className="flex-1"
                  />
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!dirtyKeys.has(field.key) || savingKey === field.key}
                  onClick={() => saveContent(field.key)}
                  className="shrink-0"
                >
                  {savingKey === field.key ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ===== FOUNDER IMAGE ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Founder Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-100">
              {founderImageUrl ? (
                <img src={founderImageUrl} alt="Founder" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">No image</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {founderImageUrl
                  ? "Founder image is live on the About page."
                  : "No image set — using initials placeholder."}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <UTUploadButton
                  endpoint="assetUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      void saveFounderImage(res[0].url);
                    }
                  }}
                  onUploadError={(err) => toast.error(err.message)}
                  appearance={{
                    button: "data-[state=ready]:bg-emerald-600 data-[state=ready]:text-white data-[state=ready]:hover:bg-emerald-700 data-[state=uploading]:bg-emerald-700/80 data-[state=uploading]:text-white data-[state=uploading]:cursor-not-allowed rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                    container: "flex flex-col items-stretch",
                    allowedContent: "hidden",
                  }}
                  content={{ button: ({ ready }) => ready ? "Upload" : "Preparing…" }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilePicker(true)}
                  className="gap-1.5"
                >
                  <FolderOpen className="size-3.5" />
                  Select existing
                </Button>
                {founderImageUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void saveFounderImage("")}
                    disabled={savingKey === "about.founderImageUrl"}
                    className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-3.5" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
          {savingKey === "about.founderImageUrl" && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> Saving…
            </p>
          )}
          <ExistingFilePicker
            open={showFilePicker}
            onClose={() => setShowFilePicker(false)}
            excludeUrl={founderImageUrl}
            onSelect={(selected) => {
              if (selected.length > 0) void saveFounderImage(selected[0].url);
            }}
          />
        </CardContent>
      </Card>

      {/* ===== TIMELINE MILESTONES ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Growth Timeline</CardTitle>
            <Button size="sm" onClick={() => setAddingMilestone(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="size-3.5" /> Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {addingMilestone && (
            <AddMilestoneForm onCancel={() => setAddingMilestone(false)} onCreate={createMilestone} />
          )}
          {milestones.map((raw) => {
            const m = displayMilestone(raw);
            const dirty = isMilestoneDirty(raw);
            return (
              <div key={raw.id} className={cn("rounded-lg border p-3", dirty ? "border-amber-300 bg-amber-50/30" : "border-border", !m.isActive && "opacity-60")}>
                <div className="flex items-start gap-2">
                  <Input value={m.year} onChange={(e) => setMilestoneField(raw.id, "year", e.target.value)} className="w-20 shrink-0" placeholder="Year" />
                  <Input value={m.title} onChange={(e) => setMilestoneField(raw.id, "title", e.target.value)} className="flex-1" placeholder="Title" />
                  <Switch checked={m.isActive} onCheckedChange={(v) => setMilestoneField(raw.id, "isActive", v)} />
                </div>
                <Textarea value={m.detail} onChange={(e) => setMilestoneField(raw.id, "detail", e.target.value)} rows={2} className="mt-2" placeholder="Detail…" />
                <div className="mt-2 flex items-center justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={milestoneDeleting === raw.id} className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        {milestoneDeleting === raw.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete milestone?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove "{m.title}" from the timeline.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMilestone(raw)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" disabled={!dirty || milestoneSaving === raw.id} onClick={() => revertMilestone(raw)}>Revert</Button>
                    <Button size="sm" disabled={!dirty || milestoneSaving === raw.id} onClick={() => saveMilestone(raw)} className="bg-emerald-600 hover:bg-emerald-700">
                      {milestoneSaving === raw.id ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {milestones.length === 0 && !addingMilestone && (
            <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">No milestones yet.</div>
          )}
        </CardContent>
      </Card>

      {/* ===== CORE VALUES ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Core Values</CardTitle>
            <Button size="sm" onClick={() => setAddingValue(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="size-3.5" /> Add Value
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {addingValue && (
            <AddValueForm onCancel={() => setAddingValue(false)} onCreate={createValue} />
          )}
          {coreValues.map((raw) => {
            const v = displayValue(raw);
            const dirty = isValueDirty(raw);
            const Icon = VALUE_ICONS[v.icon] ?? VALUE_ICONS.Heart;
            return (
              <div key={raw.id} className={cn("rounded-lg border p-3", dirty ? "border-amber-300 bg-amber-50/30" : "border-border", !v.isActive && "opacity-60")}>
                <div className="flex items-start gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Icon className="size-4" />
                  </span>
                  <Input value={v.title} onChange={(e) => setValueField(raw.id, "title", e.target.value)} className="flex-1" placeholder="Title" />
                  <Switch checked={v.isActive} onCheckedChange={(val) => setValueField(raw.id, "isActive", val)} />
                </div>
                <Textarea value={v.description} onChange={(e) => setValueField(raw.id, "description", e.target.value)} rows={2} className="mt-2" placeholder="Description…" />
                <div className="mt-2 flex items-center gap-2">
                  <Label className="text-xs">Icon:</Label>
                  <Select value={v.icon} onValueChange={(val) => setValueField(raw.id, "icon", val)}>
                    <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VALUE_ICON_OPTIONS.map((key) => {
                        const I = VALUE_ICONS[key];
                        return (
                          <SelectItem key={key} value={key}>
                            <span className="flex items-center gap-2"><I className="size-4" /> {key}</span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={valueDeleting === raw.id} className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        {valueDeleting === raw.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete value?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove "{v.title}".</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteValue(raw)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" disabled={!dirty || valueSaving === raw.id} onClick={() => revertValue(raw)}>Revert</Button>
                    <Button size="sm" disabled={!dirty || valueSaving === raw.id} onClick={() => saveValue(raw)} className="bg-emerald-600 hover:bg-emerald-700">
                      {valueSaving === raw.id ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {coreValues.length === 0 && !addingValue && (
            <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">No core values yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// === Add milestone form ===
function AddMilestoneForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: (data: { year: string; title: string; detail: string }) => void }) {
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  return (
    <div className="rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-emerald-800">New Milestone</h4>
        <Button variant="ghost" size="icon" className="size-6" onClick={onCancel}><X className="size-3" /></Button>
      </div>
      <div className="flex gap-2">
        <Input value={year} onChange={(e) => setYear(e.target.value)} className="w-24" placeholder="Year" autoFocus />
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1" placeholder="Title" />
      </div>
      <Textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={2} className="mt-2" placeholder="Detail…" />
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" disabled={!year.trim() || !title.trim()} onClick={() => onCreate({ year, title, detail })} className="bg-emerald-600 hover:bg-emerald-700">Create</Button>
      </div>
    </div>
  );
}

// === Add value form ===
function AddValueForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: (data: { title: string; description: string; icon: string }) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Heart");
  return (
    <div className="rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-emerald-800">New Core Value</h4>
        <Button variant="ghost" size="icon" className="size-6" onClick={onCancel}><X className="size-3" /></Button>
      </div>
      <div className="flex gap-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1" placeholder="Title" autoFocus />
        <Select value={icon} onValueChange={setIcon}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {VALUE_ICON_OPTIONS.map((key) => {
              const I = VALUE_ICONS[key];
              return <SelectItem key={key} value={key}><span className="flex items-center gap-2"><I className="size-4" /> {key}</span></SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-2" placeholder="Description…" />
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" disabled={!title.trim()} onClick={() => onCreate({ title, description, icon })} className="bg-emerald-600 hover:bg-emerald-700">Create</Button>
      </div>
    </div>
  );
}
