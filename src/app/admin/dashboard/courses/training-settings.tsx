"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Loader2, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  settings: Record<string, string>;
};

const FIELDS = [
  { key: "training.emaxBadge", label: "E-Max Affiliation Badge", type: "input" as const, placeholder: "Affiliated to E-Max India | Recognized by Govt. of India" },
  { key: "training.topRank", label: "Top Rank Text", type: "input" as const, placeholder: "Top 1 Institute under E-Max India nationwide" },
  { key: "hotel.placement", label: "Hotel Management Placement Text", type: "textarea" as const, rows: 2, placeholder: "Diploma in Hotel Management (1-Year Course) | 100% Placement Guarantee…" },
];

export function TrainingSettings({ settings: initial }: Props) {
  const [settings, setSettings] = useState<Record<string, string>>(initial);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<string | null>(null);

  function update(key: string, value: string) {
    setSettings((p) => ({ ...p, [key]: value }));
    setDirty((p) => new Set(p).add(key));
  }

  async function save(key: string) {
    setSaving(key);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: settings[key] ?? "", category: "education" }),
      });
      if (!res.ok) throw new Error();
      setDirty((p) => { const n = new Set(p); n.delete(key); return n; });
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="size-4 text-emerald-600" />
          Training & Education Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <Label className="text-xs">{field.label}</Label>
            <div className="mt-1 flex gap-2">
              {field.type === "input" ? (
                <Input
                  value={settings[field.key] ?? ""}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="flex-1"
                />
              ) : (
                <Textarea
                  value={settings[field.key] ?? ""}
                  onChange={(e) => update(field.key, e.target.value)}
                  rows={field.rows ?? 2}
                  placeholder={field.placeholder}
                  className="flex-1"
                />
              )}
              <Button
                size="sm"
                variant="outline"
                disabled={!dirty.has(field.key) || saving === field.key}
                onClick={() => save(field.key)}
                className="shrink-0"
              >
                {saving === field.key ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
