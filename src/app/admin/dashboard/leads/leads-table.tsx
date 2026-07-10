"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Inbox,
  Search,
  Mail,
  Phone,
  Trash2,
  CheckCheck,
  Archive,
  RotateCcw,
  MoreHorizontal,
  Eye,
  Clock,
  Sparkles,
  MailOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  subject: string;
  message: string;
  status: string;
  isRead: boolean;
  createdAt: string;
};

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "contact", label: "Contact" },
  { value: "computer-works", label: "Computer Works" },
  { value: "mobile-hub", label: "Mobile Hub" },
  { value: "computer-training", label: "Computer Training" },
  { value: "hotel-management", label: "Hotel Management" },
  { value: "restaurant", label: "Restaurant" },
  { value: "tailoring", label: "Tailoring" },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "ARCHIVED", label: "Archived" },
];

function sourceLabel(s: string): string {
  return (
    SOURCE_OPTIONS.find((o) => o.value === s)?.label ?? s
  );
}

function statusBadge(status: string) {
  if (status === "NEW") {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/30">
        New
      </Badge>
    );
  }
  if (status === "ARCHIVED") {
    return (
      <Badge variant="secondary" className="bg-muted text-muted-foreground">
        Archived
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-emerald-200 bg-emerald-50 text-emerald-700"
    >
      Read
    </Badge>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}

export function LeadsTable({ initialLeads }: { initialLeads: LeadRow[] }) {
  const [leads, setLeads] = useState<LeadRow[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewLead, setViewLead] = useState<LeadRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = leads.length;
    const unread = leads.filter((l) => !l.isRead).length;
    const newCount = leads.filter((l) => l.status === "NEW").length;
    return { total, unread, newCount };
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.subject.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q))
      );
    });
  }, [leads, search, sourceFilter, statusFilter]);

  async function patchLead(
    id: string,
    payload: { status?: string; isRead?: boolean },
    label: string
  ) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      });
      if (!res.ok) throw new Error("Request failed");
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                ...(payload.status !== undefined ? { status: payload.status! } : {}),
                ...(payload.isRead !== undefined ? { isRead: payload.isRead! } : {}),
              }
            : l
        )
      );
      toast.success(label);
    } catch (e) {
      console.error(e);
      toast.error("Could not update lead. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteLead(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lead deleted.");
      setDeleteId(null);
    } catch (e) {
      console.error(e);
      toast.error("Could not delete lead. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  const leadToDelete = leads.find((l) => l.id === deleteId) ?? null;

  return (
    <div className="flex flex-col gap-5">
      {/* Header card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="size-5 text-emerald-600" />
                Lead Manager
              </CardTitle>
              <CardDescription>
                {stats.total} total · {stats.unread} unread · {stats.newCount}{" "}
                new
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                {stats.total} total
              </Badge>
              {stats.unread > 0 && (
                <Badge className="bg-rose-500/15 text-rose-700 ring-1 ring-inset ring-rose-500/25">
                  {stats.unread} unread
                </Badge>
              )}
              {stats.newCount > 0 && (
                <Badge className="bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/30">
                  {stats.newCount} new
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter bar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, subject, email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search leads"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[170px]" aria-label="Filter by source">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]" aria-label="Filter by status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-muted-foreground">
              <Inbox className="size-8 opacity-40" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {leads.length === 0
                    ? "No leads yet"
                    : "No leads match your filters"}
                </p>
                <p className="text-xs">
                  {leads.length === 0
                    ? "Submit the public contact form to see your first lead."
                    : "Try adjusting your search or filters."}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="hidden lg:table-cell">Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className={cn(!lead.isRead && "bg-emerald-50/30")}
                  >
                    <TableCell className="pl-6">
                      <button
                        type="button"
                        onClick={() => {
                          setViewLead(lead);
                          if (!lead.isRead) {
                            patchLead(lead.id, { isRead: true }, "Marked as read");
                          }
                        }}
                        className="group flex flex-col text-left"
                      >
                        <span className="flex items-center gap-1.5 font-medium">
                          {!lead.isRead && (
                            <span
                              aria-label="Unread"
                              className="inline-block size-1.5 rounded-full bg-emerald-500"
                            />
                          )}
                          {lead.name}
                        </span>
                        <span className="text-xs text-muted-foreground group-hover:text-emerald-700">
                          {truncate(lead.subject, 38)}
                        </span>
                      </button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" />
                          {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="size-3 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {sourceLabel(lead.source)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate lg:table-cell text-sm text-muted-foreground">
                      {lead.subject}
                    </TableCell>
                    <TableCell>{statusBadge(lead.status)}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatDate(lead.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="View lead"
                          onClick={() => {
                            setViewLead(lead);
                            if (!lead.isRead) {
                              patchLead(lead.id, { isRead: true }, "Marked as read");
                            }
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              aria-label="Lead actions"
                              disabled={busyId === lead.id}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Update lead</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {!lead.isRead && (
                              <DropdownMenuItem
                                onSelect={() =>
                                  patchLead(
                                    lead.id,
                                    { isRead: true },
                                    "Marked as read"
                                  )
                                }
                              >
                                <MailOpen className="size-4" />
                                Mark read
                              </DropdownMenuItem>
                            )}
                            {lead.isRead && (
                              <DropdownMenuItem
                                onSelect={() =>
                                  patchLead(
                                    lead.id,
                                    { isRead: false },
                                    "Marked as unread"
                                  )
                                }
                              >
                                <Mail className="size-4" />
                                Mark unread
                              </DropdownMenuItem>
                            )}
                            {lead.status !== "NEW" && (
                              <DropdownMenuItem
                                onSelect={() =>
                                  patchLead(
                                    lead.id,
                                    { status: "NEW" },
                                    "Marked as new"
                                  )
                                }
                              >
                                <Sparkles className="size-4" />
                                Mark as new
                              </DropdownMenuItem>
                            )}
                            {lead.status !== "READ" && (
                              <DropdownMenuItem
                                onSelect={() =>
                                  patchLead(
                                    lead.id,
                                    { status: "READ", isRead: true },
                                    "Marked as read"
                                  )
                                }
                              >
                                <CheckCheck className="size-4" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            {lead.status !== "ARCHIVED" && (
                              <DropdownMenuItem
                                onSelect={() =>
                                  patchLead(
                                    lead.id,
                                    { status: "ARCHIVED" },
                                    "Lead archived"
                                  )
                                }
                              >
                                <Archive className="size-4" />
                                Archive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                              onSelect={() => setDeleteId(lead.id)}
                            >
                              <Trash2 className="size-4" />
                              Delete lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Message viewer dialog */}
      <Dialog
        open={!!viewLead}
        onOpenChange={(o) => !o && setViewLead(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{viewLead?.name}</span>
              {viewLead && statusBadge(viewLead.status)}
            </DialogTitle>
            <DialogDescription>
              From{" "}
              <span className="font-medium text-foreground">
                {sourceLabel(viewLead?.source ?? "")}
              </span>{" "}
              · {viewLead && formatDate(viewLead.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {viewLead && (
            <div className="flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-md border bg-muted/30 p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Phone
                  </div>
                  <a
                    href={`tel:${viewLead.phone}`}
                    className="flex items-center gap-1.5 font-medium text-emerald-700 hover:underline"
                  >
                    <Phone className="size-3.5" />
                    {viewLead.phone}
                  </a>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Email
                  </div>
                  {viewLead.email ? (
                    <a
                      href={`mailto:${viewLead.email}`}
                      className="flex items-center gap-1.5 font-medium text-emerald-700 hover:underline"
                    >
                      <Mail className="size-3.5" />
                      <span className="truncate">{viewLead.email}</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div className="rounded-md border bg-muted/30 p-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Subject
                </div>
                <div className="font-medium">{viewLead.subject}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  Message
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {viewLead.message}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                {viewLead.status !== "ARCHIVED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const id = viewLead.id;
                      patchLead(id, { status: "ARCHIVED" }, "Lead archived");
                      setViewLead(null);
                    }}
                  >
                    <Archive className="size-4" />
                    Archive
                  </Button>
                )}
                {viewLead.status === "ARCHIVED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const id = viewLead.id;
                      patchLead(id, { status: "NEW" }, "Restored as new");
                      setViewLead(null);
                    }}
                  >
                    <RotateCcw className="size-4" />
                    Restore
                  </Button>
                )}
                <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <a href={`mailto:${viewLead.email || ""}`}>
                    <Mail className="size-4" />
                    Reply by email
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              {leadToDelete
                ? `This will permanently delete the lead from "${leadToDelete.name}" (${sourceLabel(
                    leadToDelete.source
                  )}). This action cannot be undone.`
                : "This will permanently delete the lead. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={() => deleteId && deleteLead(deleteId)}
            >
              <Trash2 className="size-4" />
              Delete lead
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
