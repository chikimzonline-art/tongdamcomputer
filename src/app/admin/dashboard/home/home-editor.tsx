"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Save, Loader2, Plus, Trash2, X, GripVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { HOME_ICONS, HOME_ICON_OPTIONS, HOME_ACCENTS, HOME_ACCENT_OPTIONS } from "@/lib/home-config";

// ===== Types =====
type StatData = { id: string; label: string; value: string; icon: string; sortOrder: number; isActive: boolean };
type QuickActionData = { id: string; title: string; description: string; href: string; cta: string; icon: string; sortOrder: number; isActive: boolean };
type EssentialServiceData = { id: string; title: string; description: string; icon: string; services: string[]; extraCount: number; accent: string; sortOrder: number; isActive: boolean };

type Props = {
  content: Record<string, string>;
  stats: StatData[];
  quickActions: QuickActionData[];
  essentialServices: EssentialServiceData[];
};

const TEXT_FIELDS: { key: string; label: string; type: "input" | "textarea"; rows?: number }[] = [
  { key: "hero.title", label: "Hero Title", type: "input" },
  { key: "hero.subtitle", label: "Hero Subtitle", type: "textarea", rows: 3 },
  { key: "home.venturesLabel", label: "Ventures Section — Label", type: "input" },
  { key: "home.venturesHeading", label: "Ventures Section — Heading", type: "input" },
  { key: "home.venturesSubtitle", label: "Ventures Section — Subtitle", type: "textarea", rows: 2 },
  { key: "home.essentialLabel", label: "Essential Services — Label", type: "input" },
  { key: "home.essentialHeading", label: "Essential Services — Heading (use | to split colors)", type: "input" },
  { key: "home.essentialSubtitle", label: "Essential Services — Subtitle", type: "textarea", rows: 2 },
  { key: "home.quickActionsHeading", label: "Quick Actions — Heading", type: "input" },
  { key: "home.quickActionsSubtitle", label: "Quick Actions — Subtitle", type: "textarea", rows: 2 },
  { key: "home.storyHeading", label: "Story Section — Heading", type: "input" },
  { key: "home.ctaHeading", label: "CTA Band — Heading", type: "input" },
  { key: "home.ctaDescription", label: "CTA Band — Description", type: "textarea", rows: 2 },
];

export function HomeEditor({ content: initialContent, stats: initialStats, quickActions: initialQA, essentialServices: initialES }: Props) {
  const [content, setContent] = useState<Record<string, string>>(initialContent);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const [stats, setStats] = useState<StatData[]>(initialStats);
  const [statDrafts, setStatDrafts] = useState<Record<string, Partial<StatData>>>({});
  const [addingStat, setAddingStat] = useState(false);
  const [statSaving, setStatSaving] = useState<string | null>(null);
  const [statDeleting, setStatDeleting] = useState<string | null>(null);

  const [quickActions, setQuickActions] = useState<QuickActionData[]>(initialQA);
  const [qaDrafts, setQaDrafts] = useState<Record<string, Partial<QuickActionData>>>({});
  const [addingQa, setAddingQa] = useState(false);
  const [qaSaving, setQaSaving] = useState<string | null>(null);
  const [qaDeleting, setQaDeleting] = useState<string | null>(null);

  const [essentialServices, setEssentialServices] = useState<EssentialServiceData[]>(initialES);
  const [esDrafts, setEsDrafts] = useState<Record<string, Partial<EssentialServiceData>>>({});
  const [addingEs, setAddingEs] = useState(false);
  const [esSaving, setEsSaving] = useState<string | null>(null);
  const [esDeleting, setEsDeleting] = useState<string | null>(null);

  // === Text content ===
  function updateContent(key: string, value: string) {
    setContent((p) => ({ ...p, [key]: value }));
    setDirtyKeys((p) => new Set(p).add(key));
  }
  async function saveContent(key: string) {
    setSavingKey(key);
    try {
      const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value: content[key] ?? "", category: "home" }) });
      if (!res.ok) throw new Error();
      setDirtyKeys((p) => { const n = new Set(p); n.delete(key); return n; });
      toast.success("Saved");
    } catch { toast.error("Failed to save"); }
    finally { setSavingKey(null); }
  }
  async function saveAllContent() {
    const keys = Array.from(dirtyKeys);
    if (keys.length === 0) { toast.info("Nothing to save"); return; }
    setSavingKey("all");
    try {
      await Promise.all(keys.map((key) => fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value: content[key] ?? "", category: "home" }) })));
      setDirtyKeys(new Set());
      toast.success(`Saved ${keys.length} field${keys.length === 1 ? "" : "s"}`);
    } catch { toast.error("Failed to save some fields"); }
    finally { setSavingKey(null); }
  }

  // === Generic CRUD helper factory ===
  function makeCrud<T extends { id: string; sortOrder: number; isActive: boolean }>(opts: {
    endpoint: string;
    setItems: React.Dispatch<React.SetStateAction<T[]>>;
    drafts: Record<string, Partial<T>>;
    setDrafts: React.Dispatch<React.SetStateAction<Record<string, Partial<T>>>>;
    setSaving: React.Dispatch<React.SetStateAction<string | null>>;
    setDeleting: React.Dispatch<React.SetStateAction<string | null>>;
    setAdding: React.Dispatch<React.SetStateAction<boolean>>;
    entityName: string;
  }) {
    function display(item: T): T {
      const d = opts.drafts[item.id];
      return d ? { ...item, ...d } : item;
    }
    function isDirty(item: T): boolean {
      const d = opts.drafts[item.id];
      if (!d) return false;
      return (Object.keys(d) as (keyof T)[]).some((k) => d[k] !== item[k]);
    }
    function setField(id: string, field: keyof T, value: unknown) {
      opts.setDrafts((p) => ({ ...p, [id]: { ...(p[id] ?? {}), [field]: value } }));
    }
    function revert(item: T) {
      opts.setDrafts((p) => { const n = { ...p }; delete n[item.id]; return n; });
    }
    async function save(item: T) {
      const d = opts.drafts[item.id];
      if (!d) return;
      opts.setSaving(item.id);
      try {
        const res = await fetch(opts.endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, ...d }) });
        if (!res.ok) throw new Error();
        const merged = { ...item, ...d };
        opts.setItems((p) => p.map((x) => (x.id === item.id ? merged : x)));
        opts.setDrafts((p) => { const n = { ...p }; delete n[item.id]; return n; });
        toast.success(`${opts.entityName} saved`);
      } catch { toast.error(`Failed to save ${opts.entityName.toLowerCase()}`); }
      finally { opts.setSaving(null); }
    }
    async function remove(item: T) {
      opts.setDeleting(item.id);
      try {
        const res = await fetch(`${opts.endpoint}?id=${item.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        opts.setItems((p) => p.filter((x) => x.id !== item.id));
        toast.success(`${opts.entityName} deleted`);
      } catch { toast.error(`Failed to delete`); }
      finally { opts.setDeleting(null); }
    }
    async function create(data: Record<string, unknown>) {
      try {
        const res = await fetch(opts.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error();
        const json = await res.json();
        opts.setItems((p) => [...p, json.item]);
        toast.success(`${opts.entityName} created`);
        opts.setAdding(false);
      } catch { toast.error(`Failed to create`); }
    }
    return { display, isDirty, setField, revert, save, remove, create };
  }

  const statCrud = makeCrud<StatData>({ endpoint: "/api/admin/stats", setItems: setStats, drafts: statDrafts, setDrafts: setStatDrafts, setSaving: setStatSaving, setDeleting: setStatDeleting, setAdding: setAddingStat, entityName: "Stat" });
  const qaCrud = makeCrud<QuickActionData>({ endpoint: "/api/admin/quick-actions", setItems: setQuickActions, drafts: qaDrafts, setDrafts: setQaDrafts, setSaving: setQaSaving, setDeleting: setQaDeleting, setAdding: setAddingQa, entityName: "Quick Action" });
  const esCrud = makeCrud<EssentialServiceData>({ endpoint: "/api/admin/essential-services", setItems: setEssentialServices, drafts: esDrafts, setDrafts: setEsDrafts, setSaving: setEsSaving, setDeleting: setEsDeleting, setAdding: setAddingEs, entityName: "Service" });

  // === Essential service feature list helpers ===
  function setEsFeature(id: string, index: number, value: string) {
    const current = esCrud.display(essentialServices.find((e) => e.id === id)!);
    const services = [...current.services];
    services[index] = value;
    esCrud.setField(id, "services", services);
  }
  function addEsFeature(id: string) {
    const current = esCrud.display(essentialServices.find((e) => e.id === id)!);
    esCrud.setField(id, "services", [...current.services, ""]);
  }
  function removeEsFeature(id: string, index: number) {
    const current = esCrud.display(essentialServices.find((e) => e.id === id)!);
    esCrud.setField(id, "services", current.services.filter((_, i) => i !== index));
  }

  // === Reusable card header with add button ===
  function SectionCard({ title, onAdd, adding, children }: { title: string; onAdd: () => void; adding: boolean; children: React.ReactNode }) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <Button size="sm" onClick={onAdd} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="size-3.5" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {adding && <div className="rounded-lg border border-dashed p-3 text-center text-sm text-muted-foreground">Loading form…</div>}
          {children}
        </CardContent>
      </Card>
    );
  }

  // === Reusable delete button with confirm ===
  function DeleteButton({ onDelete, disabled, label }: { onDelete: () => void; disabled: boolean; label: string }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" disabled={disabled} className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive">
            {disabled ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // === Reusable save/revert row ===
  function SaveRevert({ dirty, saving, onRevert, onSave }: { dirty: boolean; saving: boolean; onRevert: () => void; onSave: () => void }) {
    return (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="sm" disabled={!dirty || saving} onClick={onRevert}>Revert</Button>
        <Button size="sm" disabled={!dirty || saving} onClick={onSave} className="bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Save
        </Button>
      </div>
    );
  }

  // Icon picker
  function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          {HOME_ICON_OPTIONS.map((key) => {
            const I = HOME_ICONS[key];
            return <SelectItem key={key} value={key}><span className="flex items-center gap-2"><I className="size-4" /> {key}</span></SelectItem>;
          })}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== TEXT CONTENT ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Text Content</CardTitle>
            <div className="flex items-center gap-2">
              {dirtyKeys.size > 0 && <Badge className="bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/30">{dirtyKeys.size} unsaved</Badge>}
              <Button size="sm" onClick={saveAllContent} disabled={dirtyKeys.size === 0 || savingKey === "all"} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
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
                  <Input value={content[field.key] ?? ""} onChange={(e) => updateContent(field.key, e.target.value)} className="flex-1" />
                ) : (
                  <Textarea value={content[field.key] ?? ""} onChange={(e) => updateContent(field.key, e.target.value)} rows={field.rows ?? 3} className="flex-1" />
                )}
                <Button size="sm" variant="outline" disabled={!dirtyKeys.has(field.key) || savingKey === field.key} onClick={() => saveContent(field.key)} className="shrink-0">
                  {savingKey === field.key ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ===== STATS ===== */}
      <SectionCard title="Stats Bar" onAdd={() => setAddingStat(true)} adding={addingStat}>
        {addingStat && (
          <AddStatForm onCancel={() => setAddingStat(false)} onCreate={statCrud.create} />
        )}
        {stats.map((raw) => {
          const s = statCrud.display(raw);
          const dirty = statCrud.isDirty(raw);
          const Icon = HOME_ICONS[s.icon] ?? HOME_ICONS.Briefcase;
          return (
            <div key={raw.id} className={cn("rounded-lg border p-3", dirty ? "border-amber-300 bg-amber-50/30" : "border-border", !s.isActive && "opacity-60")}>
              <div className="flex items-center gap-2">
                <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Icon className="size-4" /></span>
                <Input value={s.label} onChange={(e) => statCrud.setField(raw.id, "label", e.target.value)} className="flex-1" placeholder="Label" />
                <Input value={s.value} onChange={(e) => statCrud.setField(raw.id, "value", e.target.value)} className="w-24" placeholder="Value" />
                <Switch checked={s.isActive} onCheckedChange={(v) => statCrud.setField(raw.id, "isActive", v)} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Label className="text-xs shrink-0">Icon:</Label>
                <div className="w-40"><IconPicker value={s.icon} onChange={(v) => statCrud.setField(raw.id, "icon", v)} /></div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <DeleteButton onDelete={() => statCrud.remove(raw)} disabled={statDeleting === raw.id} label="stat" />
                <SaveRevert dirty={dirty} saving={statSaving === raw.id} onRevert={() => statCrud.revert(raw)} onSave={() => statCrud.save(raw)} />
              </div>
            </div>
          );
        })}
        {stats.length === 0 && !addingStat && <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">No stats yet.</div>}
      </SectionCard>

      {/* ===== QUICK ACTIONS ===== */}
      <SectionCard title="Quick Actions" onAdd={() => setAddingQa(true)} adding={addingQa}>
        {addingQa && (
          <AddQuickActionForm onCancel={() => setAddingQa(false)} onCreate={qaCrud.create} />
        )}
        {quickActions.map((raw) => {
          const q = qaCrud.display(raw);
          const dirty = qaCrud.isDirty(raw);
          const Icon = HOME_ICONS[q.icon] ?? HOME_ICONS.CalendarCheck;
          return (
            <div key={raw.id} className={cn("rounded-lg border p-3", dirty ? "border-amber-300 bg-amber-50/30" : "border-border", !q.isActive && "opacity-60")}>
              <div className="flex items-center gap-2">
                <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Icon className="size-4" /></span>
                <Input value={q.title} onChange={(e) => qaCrud.setField(raw.id, "title", e.target.value)} className="flex-1" placeholder="Title" />
                <Switch checked={q.isActive} onCheckedChange={(v) => qaCrud.setField(raw.id, "isActive", v)} />
              </div>
              <Textarea value={q.description} onChange={(e) => qaCrud.setField(raw.id, "description", e.target.value)} rows={2} className="mt-2" placeholder="Description" />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Link</Label><Input value={q.href} onChange={(e) => qaCrud.setField(raw.id, "href", e.target.value)} placeholder="/lifestyle/restaurant" /></div>
                <div><Label className="text-xs">CTA text</Label><Input value={q.cta} onChange={(e) => qaCrud.setField(raw.id, "cta", e.target.value)} placeholder="View menu & book" /></div>
              </div>
              <div className="mt-2 flex items-center gap-2"><Label className="text-xs shrink-0">Icon:</Label><div className="w-40"><IconPicker value={q.icon} onChange={(v) => qaCrud.setField(raw.id, "icon", v)} /></div></div>
              <div className="mt-2 flex items-center justify-between">
                <DeleteButton onDelete={() => qaCrud.remove(raw)} disabled={qaDeleting === raw.id} label="quick action" />
                <SaveRevert dirty={dirty} saving={qaSaving === raw.id} onRevert={() => qaCrud.revert(raw)} onSave={() => qaCrud.save(raw)} />
              </div>
            </div>
          );
        })}
        {quickActions.length === 0 && !addingQa && <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">No quick actions yet.</div>}
      </SectionCard>

      {/* ===== ESSENTIAL SERVICES ===== */}
      <SectionCard title="Essential Services" onAdd={() => setAddingEs(true)} adding={addingEs}>
        {addingEs && (
          <AddEssentialServiceForm onCancel={() => setAddingEs(false)} onCreate={esCrud.create} />
        )}
        {essentialServices.map((raw) => {
          const e = esCrud.display(raw);
          const dirty = esCrud.isDirty(raw);
          const Icon = HOME_ICONS[e.icon] ?? HOME_ICONS.Landmark;
          const accent = HOME_ACCENTS[e.accent] ?? HOME_ACCENTS.emerald;
          return (
            <div key={raw.id} className={cn("rounded-lg border p-3", dirty ? "border-amber-300 bg-amber-50/30" : "border-border", !e.isActive && "opacity-60")}>
              <div className="flex items-center gap-2">
                <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", accent.iconBg, accent.iconText)}><Icon className="size-4" /></span>
                <Input value={e.title} onChange={(ev) => esCrud.setField(raw.id, "title", ev.target.value)} className="flex-1" placeholder="Title" />
                <Switch checked={e.isActive} onCheckedChange={(v) => esCrud.setField(raw.id, "isActive", v)} />
              </div>
              <Textarea value={e.description} onChange={(ev) => esCrud.setField(raw.id, "description", ev.target.value)} rows={2} className="mt-2" placeholder="Description" />
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div><Label className="text-xs">Icon</Label><IconPicker value={e.icon} onChange={(v) => esCrud.setField(raw.id, "icon", v)} /></div>
                <div><Label className="text-xs">Accent</Label>
                  <Select value={e.accent} onValueChange={(v) => esCrud.setField(raw.id, "accent", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{HOME_ACCENT_OPTIONS.map((k) => <SelectItem key={k} value={k}>{HOME_ACCENTS[k].label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">"+N more" count</Label><Input type="number" value={e.extraCount} onChange={(ev) => esCrud.setField(raw.id, "extraCount", Number(ev.target.value))} /></div>
              </div>
              {/* Features list */}
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Services list</Label>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => addEsFeature(raw.id)}><Plus className="size-3" /> Add</Button>
                </div>
                <div className="mt-1 space-y-1.5">
                  {e.services.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Input value={f} onChange={(ev) => setEsFeature(raw.id, i, ev.target.value)} className="flex-1" placeholder="Service item" />
                      <Button variant="ghost" size="icon" className="size-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeEsFeature(raw.id, i)}><X className="size-3.5" /></Button>
                    </div>
                  ))}
                  {e.services.length === 0 && <p className="text-xs text-muted-foreground">No services yet.</p>}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <DeleteButton onDelete={() => esCrud.remove(raw)} disabled={esDeleting === raw.id} label="service" />
                <SaveRevert dirty={dirty} saving={esSaving === raw.id} onRevert={() => esCrud.revert(raw)} onSave={() => esCrud.save(raw)} />
              </div>
            </div>
          );
        })}
        {essentialServices.length === 0 && !addingEs && <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">No services yet.</div>}
      </SectionCard>
    </div>
  );
}

// ===== Add forms =====
function AddStatForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: (data: Record<string, unknown>) => void }) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [icon, setIcon] = useState("Briefcase");
  return (
    <div className="rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-emerald-800">New Stat</h4>
        <Button variant="ghost" size="icon" className="size-6" onClick={onCancel}><X className="size-3" /></Button>
      </div>
      <div className="flex gap-2">
        <Input value={label} onChange={(e) => setLabel(e.target.value)} className="flex-1" placeholder="Label (e.g. Students Trained)" autoFocus />
        <Input value={value} onChange={(e) => setValue(e.target.value)} className="w-28" placeholder="Value (e.g. 1000+)" />
      </div>
      <div className="mt-2 w-40"><Select value={icon} onValueChange={setIcon}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{HOME_ICON_OPTIONS.map((k) => { const I = HOME_ICONS[k]; return <SelectItem key={k} value={k}><span className="flex items-center gap-2"><I className="size-4" /> {k}</span></SelectItem>; })}</SelectContent></Select></div>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" disabled={!label.trim() || !value.trim()} onClick={() => onCreate({ label, value, icon })} className="bg-emerald-600 hover:bg-emerald-700">Create</Button>
      </div>
    </div>
  );
}

function AddQuickActionForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: (data: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [href, setHref] = useState("/");
  const [cta, setCta] = useState("");
  const [icon, setIcon] = useState("CalendarCheck");
  return (
    <div className="rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-emerald-800">New Quick Action</h4>
        <Button variant="ghost" size="icon" className="size-6" onClick={onCancel}><X className="size-3" /></Button>
      </div>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-2" placeholder="Title" autoFocus />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mb-2" placeholder="Description" />
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/lifestyle/restaurant" />
        <Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="CTA text" />
      </div>
      <div className="w-40 mb-2"><Select value={icon} onValueChange={setIcon}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{HOME_ICON_OPTIONS.map((k) => { const I = HOME_ICONS[k]; return <SelectItem key={k} value={k}><span className="flex items-center gap-2"><I className="size-4" /> {k}</span></SelectItem>; })}</SelectContent></Select></div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" disabled={!title.trim()} onClick={() => onCreate({ title, description, href, cta, icon })} className="bg-emerald-600 hover:bg-emerald-700">Create</Button>
      </div>
    </div>
  );
}

function AddEssentialServiceForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: (data: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Landmark");
  const [accent, setAccent] = useState("emerald");
  const [extraCount, setExtraCount] = useState(2);
  const [services, setServices] = useState<string[]>([""]);
  return (
    <div className="rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-emerald-800">New Essential Service</h4>
        <Button variant="ghost" size="icon" className="size-6" onClick={onCancel}><X className="size-3" /></Button>
      </div>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-2" placeholder="Title" autoFocus />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mb-2" placeholder="Description" />
      <div className="grid grid-cols-3 gap-2 mb-2">
        <Select value={icon} onValueChange={setIcon}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{HOME_ICON_OPTIONS.map((k) => { const I = HOME_ICONS[k]; return <SelectItem key={k} value={k}><span className="flex items-center gap-2"><I className="size-4" /> {k}</span></SelectItem>; })}</SelectContent></Select>
        <Select value={accent} onValueChange={setAccent}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{HOME_ACCENT_OPTIONS.map((k) => <SelectItem key={k} value={k}>{HOME_ACCENTS[k].label}</SelectItem>)}</SelectContent></Select>
        <Input type="number" value={extraCount} onChange={(e) => setExtraCount(Number(e.target.value))} placeholder="+N more" />
      </div>
      <Label className="text-xs">Services list</Label>
      <div className="mt-1 space-y-1.5">
        {services.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Input value={s} onChange={(e) => setServices((p) => p.map((x, j) => (j === i ? e.target.value : x)))} className="flex-1" placeholder="Service item" />
            <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={() => setServices((p) => p.filter((_, j) => j !== i))}><X className="size-3.5" /></Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="mt-1 gap-1 text-xs" onClick={() => setServices((p) => [...p, ""])}><Plus className="size-3" /> Add service</Button>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" disabled={!title.trim()} onClick={() => onCreate({ title, description, icon, accent, extraCount, services })} className="bg-emerald-600 hover:bg-emerald-700">Create</Button>
      </div>
    </div>
  );
}
