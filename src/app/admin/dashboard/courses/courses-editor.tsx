"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  Save,
  Loader2,
  Award,
  Clock,
  IndianRupee,
  ListChecks,
  Power,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type CourseRow = {
  id: string;
  code: string;
  title: string;
  institute: string;
  description: string;
  duration: string;
  fee: string;
  syllabus: string;
  sortOrder: number;
  isActive: boolean;
};

type Props = {
  courses: CourseRow[];
  instituteLabels: Record<string, string>;
  instituteOrder: string[];
};

export function CoursesEditor({
  courses,
  instituteLabels,
  instituteOrder,
}: Props) {
  const [drafts, setDrafts] = useState<Record<string, Partial<CourseRow>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [committed, setCommitted] = useState<Record<string, CourseRow>>({});

  const grouped = useMemo(() => {
    const map: Record<string, CourseRow[]> = {};
    for (const c of courses) {
      if (!map[c.institute]) map[c.institute] = [];
      map[c.institute].push(c);
    }
    const ordered = [
      ...instituteOrder.filter((i) => map[i]),
      ...Object.keys(map).filter((i) => !instituteOrder.includes(i)),
    ];
    return ordered.map((inst) => ({
      institute: inst,
      label: instituteLabels[inst] ?? inst,
      courses: map[inst],
    }));
  }, [courses, instituteLabels, instituteOrder]);

  function baseCourse(c: CourseRow): CourseRow {
    return committed[c.id] ?? c;
  }
  function displayCourse(c: CourseRow): CourseRow {
    const d = drafts[c.id];
    return d ? { ...baseCourse(c), ...d } : baseCourse(c);
  }
  function isDirty(c: CourseRow): boolean {
    const d = drafts[c.id];
    if (!d) return false;
    const base = baseCourse(c);
    return (Object.keys(d) as (keyof CourseRow)[]).some(
      (k) => d[k] !== base[k]
    );
  }
  function setField<K extends keyof CourseRow>(
    id: string,
    key: K,
    value: CourseRow[K]
  ) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [key]: value },
    }));
  }

  async function save(c: CourseRow) {
    const d = drafts[c.id];
    if (!d) return;
    setSavingId(c.id);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, ...d }),
      });
      if (!res.ok) throw new Error("Save failed");
      const merged = { ...baseCourse(c), ...d };
      setCommitted((prev) => ({ ...prev, [c.id]: merged }));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[c.id];
        return next;
      });
      toast.success(`Saved "${merged.title}"`);
    } catch (e) {
      console.error(e);
      toast.error("Could not save course. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  function revert(c: CourseRow) {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[c.id];
      return next;
    });
  }

  const totalDirty = courses.filter(isDirty).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="size-5 text-emerald-600" />
                Course Management
              </CardTitle>
              <CardDescription>
                {courses.length} courses across {grouped.length} institutes ·
                edits go live on the next public page load
              </CardDescription>
            </div>
            {totalDirty > 0 && (
              <Badge className="bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/30">
                {totalDirty} unsaved
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Tabs per institute */}
      <Tabs defaultValue={grouped[0]?.institute} className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
          {grouped.map((group) => {
            const dirtyInTab = group.courses.filter(isDirty).length;
            return (
              <TabsTrigger
                key={group.institute}
                value={group.institute}
                className="relative gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                {group.label}
                <span className="rounded-full bg-muted-foreground/15 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums">
                  {group.courses.length}
                </span>
                {dirtyInTab > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 flex size-2 rounded-full bg-amber-500"
                    aria-label={`${dirtyInTab} unsaved changes`}
                  />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {grouped.map((group) => (
          <TabsContent
            key={group.institute}
            value={group.institute}
            className="mt-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{group.label}</CardTitle>
                <CardDescription>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {group.institute}
                  </code>{" "}
                  · {group.courses.length} course
                  {group.courses.length === 1 ? "" : "s"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {group.courses.map((raw) => {
                  const c = displayCourse(raw);
                  const dirty = isDirty(raw);
                  return (
                    <div
                      key={raw.id}
                      className={cn(
                        "rounded-lg border bg-card p-4 transition-colors",
                        dirty ? "border-amber-300 bg-amber-50/30" : "border-border",
                        !c.isActive && "opacity-70"
                      )}
                    >
                      {/* Header row */}
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/25">
                            <Award className="size-3" />
                            {c.code}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Sort #{c.sortOrder}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`course-active-${raw.id}`}
                            className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                          >
                            <Power className="size-3.5" />
                            Active
                          </Label>
                          <Switch
                            id={`course-active-${raw.id}`}
                            checked={c.isActive}
                            onCheckedChange={(v) =>
                              setField(raw.id, "isActive", v)
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor={`course-title-${raw.id}`}>
                            Title
                          </Label>
                          <Input
                            id={`course-title-${raw.id}`}
                            value={c.title}
                            onChange={(e) =>
                              setField(raw.id, "title", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor={`course-duration-${raw.id}`}>
                              <Clock className="size-3.5" />
                              Duration
                            </Label>
                            <Input
                              id={`course-duration-${raw.id}`}
                              value={c.duration}
                              onChange={(e) =>
                                setField(raw.id, "duration", e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor={`course-fee-${raw.id}`}>
                              <IndianRupee className="size-3.5" />
                              Fee
                            </Label>
                            <Input
                              id={`course-fee-${raw.id}`}
                              value={c.fee}
                              onChange={(e) =>
                                setField(raw.id, "fee", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <Label htmlFor={`course-desc-${raw.id}`}>
                            Description
                          </Label>
                          <Textarea
                            id={`course-desc-${raw.id}`}
                            value={c.description}
                            onChange={(e) =>
                              setField(raw.id, "description", e.target.value)
                            }
                            rows={2}
                            className="min-h-[60px]"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <Label htmlFor={`course-syllabus-${raw.id}`}>
                            <ListChecks className="size-3.5" />
                            Syllabus (comma-separated topics)
                          </Label>
                          <Textarea
                            id={`course-syllabus-${raw.id}`}
                            value={c.syllabus}
                            onChange={(e) =>
                              setField(raw.id, "syllabus", e.target.value)
                            }
                            rows={3}
                            className="min-h-[80px] font-mono text-sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            Split by commas — each topic becomes a chip on the
                            public page.
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

