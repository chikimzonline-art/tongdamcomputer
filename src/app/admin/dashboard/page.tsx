import Link from "next/link";
import {
  Inbox,
  Mail,
  Sparkles,
  GraduationCap,
  Utensils,
  FileEdit,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Clock,
  Phone,
} from "lucide-react";
import { db } from "@/lib/db";
import { getLeadStats, getLeads } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const SOURCE_LABEL: Record<string, string> = {
  contact: "Contact",
  "computer-works": "Computer Works",
  "mobile-hub": "Mobile Hub",
  "computer-training": "Training",
  "hotel-management": "Hotel Mgmt",
  restaurant: "Restaurant",
  tailoring: "Tailoring",
};

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

function formatDate(d: Date): string {
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardOverviewPage() {
  const [stats, recentLeads, courseCount, menuCount, contentCount] =
    await Promise.all([
      getLeadStats(),
      getLeads(5),
      db.course.count(),
      db.menuItem.count(),
      db.siteContent.count(),
    ]);

  const statCards = [
    {
      label: "Total Leads",
      value: stats.total,
      icon: Inbox,
      hint: "All-time submissions",
      tint: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
    },
    {
      label: "New Leads",
      value: stats.newLeads,
      icon: Sparkles,
      hint: "Status: NEW",
      tint: "bg-amber-500/15 text-amber-700 ring-amber-500/25",
    },
    {
      label: "Unread",
      value: stats.unread,
      icon: Mail,
      hint: "Marked unread by you",
      tint: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
    },
    {
      label: "Active Courses",
      value: courseCount,
      icon: GraduationCap,
      hint: "Across 4 institutes",
      tint: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
    },
  ];

  const quickActions = [
    {
      title: "Edit Site Content",
      description: "Hero text, about, contact details, badges",
      href: "/admin/dashboard/cms",
      icon: FileEdit,
    },
    {
      title: "Manage Courses",
      description: "Fees, syllabus, duration, active toggle",
      href: "/admin/dashboard/courses",
      icon: GraduationCap,
    },
    {
      title: "Update Menu",
      description: "Restaurant items, prices, availability",
      href: "/admin/dashboard/menu",
      icon: Utensils,
    },
    {
      title: "Toggle Alert Banner",
      description: "Site-wide announcement strip",
      href: "/admin/dashboard/banners",
      icon: Megaphone,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome panel */}
      <Card className="overflow-hidden border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-amber-50/40">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Sparkles className="size-4" />
              </span>
              <h2 className="text-xl font-semibold tracking-tight">
                Welcome back, Admin
              </h2>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Here&apos;s a quick summary of your website activity. Use the
              sections below to manage leads, update content, edit courses, or
              refresh the restaurant menu — all changes go live instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/admin/dashboard/leads">
                <Inbox className="size-4" />
                View Leads
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/" target="_blank">
                <ArrowRight className="size-4" />
                Open Site
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="text-3xl font-semibold tabular-nums tracking-tight">
                      {s.value}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="size-3" />
                      {s.hint}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg ring-1 ring-inset",
                      s.tint
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lower row: recent leads + quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent leads table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Leads</CardTitle>
              <CardDescription>Latest 5 submissions across the site</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/dashboard/leads">
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {recentLeads.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                <Inbox className="mx-auto mb-2 size-6 opacity-40" />
                No leads yet. Submit the public contact form to see one here.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="hidden md:table-cell">Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="pl-6 font-medium">
                        <div className="flex flex-col">
                          <span>{lead.name}</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="size-3" />
                            {lead.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {SOURCE_LABEL[lead.source] ?? lead.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden max-w-xs truncate md:table-cell text-muted-foreground">
                        {lead.subject}
                      </TableCell>
                      <TableCell>{statusBadge(lead.status)}</TableCell>
                      <TableCell className="pr-6 text-right text-xs text-muted-foreground">
                        <span className="flex items-center justify-end gap-1">
                          <Clock className="size-3" />
                          {formatDate(lead.createdAt)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Jump straight into a section</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={qa.href}
                  href={qa.href}
                  className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-sm"
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{qa.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {qa.description}
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-700" />
                </Link>
              );
            })}

            <div className="mt-2 grid grid-cols-3 gap-2 border-t pt-3 text-center">
              <div>
                <div className="text-lg font-semibold text-emerald-700">
                  {contentCount}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  CMS items
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-emerald-700">
                  {courseCount}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Courses
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-emerald-700">
                  {menuCount}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Menu items
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
