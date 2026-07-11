"use client";

import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Utensils,
  Plus,
  Save,
  Loader2,
  Leaf,
  Drumstick,
  IndianRupee,
  X,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type MenuRow = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  sortOrder: number;
};

export function MenuEditor({ items }: { items: MenuRow[] }) {
  const [drafts, setDrafts] = useState<Record<string, Partial<MenuRow>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [committed, setCommitted] = useState<Record<string, MenuRow>>({});
  const [addOpen, setAddOpen] = useState(false);

  // Newly created items (added locally after POST)
  const [added, setAdded] = useState<MenuRow[]>([]);

  const allItems = useMemo(() => [...added, ...items], [added, items]);

  const grouped = useMemo(() => {
    const map: Record<string, MenuRow[]> = {};
    for (const it of allItems) {
      if (!map[it.category]) map[it.category] = [];
      map[it.category].push(it);
    }
    return Object.keys(map)
      .sort((a, b) => a.localeCompare(b))
      .map((cat) => ({ category: cat, items: map[cat] }));
  }, [allItems]);

  function baseItem(it: MenuRow): MenuRow {
    return committed[it.id] ?? it;
  }
  function displayItem(it: MenuRow): MenuRow {
    const d = drafts[it.id];
    return d ? { ...baseItem(it), ...d } : baseItem(it);
  }
  function isDirty(it: MenuRow): boolean {
    const d = drafts[it.id];
    if (!d) return false;
    const base = baseItem(it);
    return (Object.keys(d) as (keyof MenuRow)[]).some(
      (k) => d[k] !== base[k]
    );
  }
  function setField<K extends keyof MenuRow>(
    id: string,
    key: K,
    value: MenuRow[K]
  ) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [key]: value },
    }));
  }

  async function save(it: MenuRow) {
    const d = drafts[it.id];
    if (!d) return;
    setSavingId(it.id);
    try {
      const res = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: it.id, ...d }),
      });
      if (!res.ok) throw new Error("Save failed");
      const merged = { ...baseItem(it), ...d };
      setCommitted((prev) => ({ ...prev, [it.id]: merged }));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[it.id];
        return next;
      });
      toast.success(`Saved "${merged.name}"`);
    } catch (e) {
      console.error(e);
      toast.error("Could not save item. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  function revert(it: MenuRow) {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[it.id];
      return next;
    });
  }

  const totalDirty = allItems.filter(isDirty).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="size-5 text-emerald-600" />
                Menu Management
              </CardTitle>
              <CardDescription>
                {allItems.length} items across {grouped.length} categor
                {grouped.length === 1 ? "y" : "ies"} · edits go live on the next
                public page load
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {totalDirty > 0 && (
                <Badge className="bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/30">
                  {totalDirty} unsaved
                </Badge>
              )}
              <Button
                onClick={() => setAddOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="size-4" />
                Add new item
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grouped editors */}
      {grouped.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
            <Utensils className="size-8 opacity-40" />
            <div>
              <p className="text-sm font-medium text-foreground">
                No menu items yet
              </p>
              <p className="text-xs">
                Click &quot;Add new item&quot; to create your first dish.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        grouped.map((group) => (
          <Card key={group.category}>
            <CardHeader>
              <CardTitle className="text-base">{group.category}</CardTitle>
              <CardDescription>
                {group.items.length} item{group.items.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {group.items.map((raw) => {
                const it = displayItem(raw);
                const dirty = isDirty(raw);
                return (
                  <div
                    key={raw.id}
                    className={cn(
                      "rounded-lg border bg-card p-4 transition-colors",
                      dirty ? "border-amber-300 bg-amber-50/30" : "border-border",
                      !it.isAvailable && "opacity-60"
                    )}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-md ring-1 ring-inset",
                            it.isVeg
                              ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30"
                              : "bg-rose-500/10 text-rose-700 ring-rose-500/30"
                          )}
                          title={it.isVeg ? "Veg" : "Non-veg"}
                        >
                          {it.isVeg ? (
                            <Leaf className="size-4" />
                          ) : (
                            <Drumstick className="size-4" />
                          )}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          Sort #{it.sortOrder}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`menu-veg-${raw.id}`}
                            className="text-xs font-medium text-muted-foreground"
                          >
                            Veg
                          </Label>
                          <Switch
                            id={`menu-veg-${raw.id}`}
                            checked={it.isVeg}
                            onCheckedChange={(v) =>
                              setField(raw.id, "isVeg", v)
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`menu-avail-${raw.id}`}
                            className="text-xs font-medium text-muted-foreground"
                          >
                            Available
                          </Label>
                          <Switch
                            id={`menu-avail-${raw.id}`}
                            checked={it.isAvailable}
                            onCheckedChange={(v) =>
                              setField(raw.id, "isAvailable", v)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <Label htmlFor={`menu-name-${raw.id}`}>Name</Label>
                        <Input
                          id={`menu-name-${raw.id}`}
                          value={it.name}
                          onChange={(e) =>
                            setField(raw.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`menu-price-${raw.id}`}>
                          <IndianRupee className="size-3.5" />
                          Price
                        </Label>
                        <Input
                          id={`menu-price-${raw.id}`}
                          value={it.price}
                          onChange={(e) =>
                            setField(raw.id, "price", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-3">
                        <Label htmlFor={`menu-desc-${raw.id}`}>Description</Label>
                        <Textarea
                          id={`menu-desc-${raw.id}`}
                          value={it.description}
                          onChange={(e) =>
                            setField(raw.id, "description", e.target.value)
                          }
                          rows={2}
                          className="min-h-[50px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-3">
                        <Label htmlFor={`menu-cat-${raw.id}`}>Category</Label>
                        <Input
                          id={`menu-cat-${raw.id}`}
                          value={it.category}
                          onChange={(e) =>
                            setField(raw.id, "category", e.target.value)
                          }
                        />
                        <span className="text-xs text-muted-foreground">
                          e.g. Appetizers, Mains, Drinks — public page groups
                          items by this field automatically.
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-1">
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
                        className="bg-emerald-600 hover:bg-emerald-700"
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
                );
              })}
            </CardContent>
          </Card>
        ))
      )}

      <AddItemDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={(item) => {
          setAdded((prev) => [item, ...prev]);
        }}
        existingCategories={grouped.map((g) => g.category)}
      />
    </div>
  );
}

function AddItemDialog({
  open,
  onOpenChange,
  onCreated,
  existingCategories,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: (item: MenuRow) => void;
  existingCategories: string[];
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(
    existingCategories[0] ?? "Mains"
  );
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setDescription("");
    setPrice("");
    setCategory(existingCategories[0] ?? "Mains");
    setIsVeg(true);
    setIsAvailable(true);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !price.trim() || !category.trim()) {
      toast.error("Name, price, and category are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          price: price.trim(),
          category: category.trim(),
          isVeg,
          isAvailable,
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const json = await res.json();
      const created: MenuRow = {
        id: json.item.id,
        name: json.item.name,
        description: json.item.description ?? "",
        price: json.item.price,
        category: json.item.category,
        isVeg: json.item.isVeg,
        isAvailable: json.item.isAvailable,
        sortOrder: json.item.sortOrder ?? 0,
      };
      onCreated(created);
      toast.success(`Added "${created.name}" to ${created.category}.`);
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Could not create item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add new menu item</DialogTitle>
          <DialogDescription>
            Create a new dish. It will appear on the restaurant page
            immediately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-name">Name *</Label>
            <Input
              id="add-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Veg Spring Rolls"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-price">
                <IndianRupee className="size-3.5" />
                Price *
              </Label>
              <Input
                id="add-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="₹120"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-cat">Category *</Label>
              <Input
                id="add-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="menu-categories"
                required
              />
              <datalist id="menu-categories">
                {existingCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-desc">Description</Label>
            <Textarea
              id="add-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short tagline shown under the dish name"
              rows={2}
              className="min-h-[50px]"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="add-veg"
                checked={isVeg}
                onCheckedChange={setIsVeg}
              />
              <Label htmlFor="add-veg" className="flex items-center gap-1.5">
                <Leaf className="size-3.5 text-emerald-600" />
                Veg
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="add-avail"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <Label htmlFor="add-avail">Available today</Label>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Create item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
