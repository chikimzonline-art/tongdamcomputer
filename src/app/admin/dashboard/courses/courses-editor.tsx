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
  Plus,
  Trash2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  courses: initialCourses,
  instituteLabels,
  instituteOrder,
}: Props) {
  const [courses, setCourses] = useState<CourseRow[]>(initialCourses);
  const [drafts, setDrafts] = useState<Record<string, Partial<CourseRow>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [committed, setCommitted] = useState<Record<string, CourseRow>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Per-institute "add new course" dialog state
  const [addingInstitute, setAddingInstitute] = useState<string | null>(null);

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

  async function createCourse(institute: string, data: {
    title: string;
    code: string;
    description: string;
    duration: string;
    fee: string;
    syllabus: string;
  }) {
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          code: data.code,
          institute,
          description: data.description,
          duration: data.duration,
          fee: data.fee,
          syllabus: data.syllabus,
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const json = await res.json();
      const item = json.item as CourseRow;
      setCourses((prev) => [...prev, item]);
      toast.success(`Created "${item.title}"`);
      setAddingInstitute(null);
    } catch (e) {
      console.error(e);
      toast.error("Could not create course. Please try again.");
    }
  }

  async function deleteCourse(c: CourseRow) {
    setDeletingId(c.id);
    try {
      const res = await fetch(`/api/admin/courses?id=${c.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setCourses((prev) => prev.filter((x) => x.id !== c.id));
      // Clean up any draft/committed state for this course
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[c.id];
        return next;
      });
      setCommitted((prev) => {
        const next = { ...prev };
        delete next[c.id];
        return next;
      });
      toast.success(`Deleted "${c.title}"`);
    } catch (e) {
      console.error(e);
      toast.error("Could not delete course. Please try again.");
    } finally {
      setDeletingId(null);
    }
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base">{group.label}</CardTitle>
                    <CardDescription>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        {group.institute}
                      </code>{" "}
                      · {group.courses.length} course
                      {group.courses.length === 1 ? "" : "s"}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setAddingInstitute(group.institute)}
                    className="gap-1.5 self-start bg-emerald-600 hover:bg-emerald-700 sm:self-auto"
                  >
                    <Plus className="size-4" />
                    Add New Course
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {addingInstitute === group.institute && (
                  <AddCourseForm
                    institute={group.institute}
                    onCancel={() => setAddingInstitute(null)}
                    onCreate={createCourse}
                  />
                )}
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

                      <div className="mt-3 flex items-center justify-between gap-1">
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
                              <AlertDialogTitle>Delete course?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove &ldquo;{c.title}&rdquo;
                                ({c.code}) from the {group.label} institute. This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCourse(raw)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete course
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

/** Inline form for creating a new course within a tab */
function AddCourseForm({
  institute,
  onCancel,
  onCreate,
}: {
  institute: string;
  onCancel: () => void;
  onCreate: (
    institute: string,
    data: {
      title: string;
      code: string;
      description: string;
      duration: string;
      fee: string;
      syllabus: string;
    }
  ) => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [fee, setFee] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !code.trim()) return;
    setSubmitting(true);
    try {
      await onCreate(institute, {
        title,
        code,
        description,
        duration,
        fee,
        syllabus,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
          <Plus className="size-4" />
          New Course
        </h4>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
          onClick={onCancel}
          aria-label="Cancel"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-title" className="text-xs">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="new-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Diploma in Graphic Design"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-code" className="text-xs">
            Course Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="new-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. DGD"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-duration" className="text-xs">
              <Clock className="size-3" />
              Duration
            </Label>
            <Input
              id="new-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 3 Months"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-fee" className="text-xs">
              <IndianRupee className="size-3" />
              Fee
            </Label>
            <Input
              id="new-fee"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="e.g. ₹5,000"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="new-desc" className="text-xs">
            Description
          </Label>
          <Textarea
            id="new-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="min-h-[50px]"
            placeholder="Short description of the course..."
          />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="new-syllabus" className="text-xs">
            <ListChecks className="size-3" />
            Syllabus (comma-separated topics)
          </Label>
          <Textarea
            id="new-syllabus"
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            rows={2}
            className="min-h-[60px] font-mono text-sm"
            placeholder="Topic 1, Topic 2, Topic 3"
          />
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!title.trim() || !code.trim() || submitting}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
        >
          {submitting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          Create Course
        </Button>
      </div>
    </div>
  );
}

