"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Megaphone,
  Plus,
  Loader2,
  Link as LinkIcon,
  Clock,
  ExternalLink,
  AlertCircle,
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
import { cn } from "@/lib/utils";

export type BannerRow = {
  id: string;
  message: string;
  link: string;
  isActive: boolean;
  createdAt: string;
};

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

export function BannerManager({
  initialBanners,
}: {
  initialBanners: BannerRow[];
}) {
  const [banners, setBanners] = useState<BannerRow[]>(initialBanners);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Create form state
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activeCount = banners.filter((b) => b.isActive).length;

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message is required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          link: link.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const json = await res.json();
      const created: BannerRow = {
        id: json.item.id,
        message: json.item.message,
        link: json.item.link ?? "",
        isActive: json.item.isActive,
        createdAt: json.item.createdAt
          ? new Date(json.item.createdAt).toISOString()
          : new Date().toISOString(),
      };
      setBanners((prev) => [created, ...prev]);
      toast.success("Banner created and is now active.");
      setMessage("");
      setLink("");
    } catch (err) {
      console.error(err);
      toast.error("Could not create banner. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(b: BannerRow) {
    setTogglingId(b.id);
    const next = !b.isActive;
    try {
      const res = await fetch("/api/admin/banner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, isActive: next }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      setBanners((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, isActive: next } : x))
      );
      toast.success(next ? "Banner is now live." : "Banner disabled.");
    } catch (err) {
      console.error(err);
      toast.error("Could not toggle banner. Please try again.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="size-5 text-emerald-600" />
                Alert Banners
              </CardTitle>
              <CardDescription>
                Site-wide announcement strip shown above the public header.
                Only the most recent active banner is displayed.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {banners.length} total
              </Badge>
              <Badge
                className={cn(
                  "ring-1 ring-inset",
                  activeCount > 0
                    ? "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25"
                    : "bg-muted text-muted-foreground ring-border"
                )}
              >
                {activeCount} active
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Create form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create new banner</CardTitle>
          <CardDescription>
            Compose the message and (optionally) a link. The new banner will be
            active immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="banner-message">Message *</Label>
              <Textarea
                id="banner-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Admissions open for 2024-25 batch — Top 1 E-Max India institute."
                rows={2}
                className="min-h-[60px]"
                required
              />
              <span className="text-xs text-muted-foreground">
                {message.length} characters · keep under ~140 for best display
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="banner-link" className="flex items-center gap-1.5">
                <LinkIcon className="size-3.5" />
                Link (optional)
              </Label>
              <Input
                id="banner-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/education/computer-training  (or https://…)"
              />
              <span className="text-xs text-muted-foreground">
                Use a relative path for internal pages, or a full URL for an
                external site.
              </span>
            </div>
            <div className="flex justify-end">
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
                Create banner
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing banners */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Existing banners</CardTitle>
          <CardDescription>
            Toggle the switch to enable or disable a banner. The public site
            shows the most recent active banner.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {banners.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
              <Megaphone className="size-8 opacity-40" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  No banners yet
                </p>
                <p className="text-xs">
                  Use the form above to create your first alert banner.
                </p>
              </div>
            </div>
          ) : (
            banners.map((b) => (
              <div
                key={b.id}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border p-4 transition-colors md:flex-row md:items-start md:justify-between",
                  b.isActive
                    ? "border-emerald-300 bg-emerald-50/40"
                    : "border-border bg-card opacity-80"
                )}
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {b.isActive ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 ring-1 ring-inset ring-emerald-500/25">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        Disabled
                      </Badge>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {formatDate(b.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {b.message}
                  </p>
                  {b.link && (
                    <a
                      href={b.link}
                      target={b.link.startsWith("http") ? "_blank" : undefined}
                      rel={b.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
                    >
                      <LinkIcon className="size-3" />
                      {b.link}
                      {b.link.startsWith("http") && (
                        <ExternalLink className="size-3" />
                      )}
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3 self-end md:self-start">
                  <Label
                    htmlFor={`banner-toggle-${b.id}`}
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {b.isActive ? "Live" : "Off"}
                  </Label>
                  <Switch
                    id={`banner-toggle-${b.id}`}
                    checked={b.isActive}
                    disabled={togglingId === b.id}
                    onCheckedChange={() => toggleActive(b)}
                  />
                </div>
              </div>
            ))
          )}

          {/* Helpful note */}
          {activeCount > 1 && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>
                You have {activeCount} active banners — the public site will
                show only the most recent one. Consider disabling older banners
                to avoid confusion.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
