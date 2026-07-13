"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, FolderOpen, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type UTFile = {
  key: string;
  name: string;
  size: number;
  status: string;
  uploadedAt: number;
  url: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, name: string) => void;
  /** Exclude this URL from the list (e.g. the currently selected file). */
  excludeUrl?: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function ExistingFilePicker({ open, onClose, onSelect, excludeUrl }: Props) {
  const [files, setFiles] = useState<UTFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/uploadthing/files?limit=100");
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Failed to load files");
      }
      const json = await res.json();
      const all: UTFile[] = json.files ?? [];
      // Filter to files that have a usable URL, and optionally exclude the
      // currently-selected asset so it doesn't clutter the picker.
      const filtered = all.filter(
        (f) => f.url && (!excludeUrl || f.url !== excludeUrl)
      );
      setFiles(filtered);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [excludeUrl]);

  useEffect(() => {
    if (open) {
      setSelectedKey(null);
      void loadFiles();
    }
  }, [open, loadFiles]);

  function handleConfirm() {
    const file = files.find((f) => f.key === selectedKey);
    if (file && file.url) {
      onSelect(file.url, file.name);
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <FolderOpen className="size-4 text-emerald-600" />
            Select from existing uploads
          </DialogTitle>
          <DialogDescription className="text-xs">
            Choose a previously uploaded file from your UploadThing storage.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="max-h-[55vh] overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-emerald-600" />
              <p className="text-sm">Loading your uploads…</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => void loadFiles()}
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && files.length === 0 && (
            <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
              No uploaded files found. Upload a new file first, then it will
              appear here for reuse.
            </div>
          )}

          {!loading && !error && files.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {files.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSelectedKey(f.key)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-lg border bg-white text-left transition-all hover:shadow-md",
                    selectedKey === f.key
                      ? "border-emerald-500 ring-2 ring-emerald-500/30"
                      : "border-gray-200 hover:border-emerald-300"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {f.url && (
                      <img
                        src={f.url}
                        alt={f.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                    {selectedKey === f.key && (
                      <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                  {/* Meta */}
                  <div className="flex flex-col gap-0.5 p-2">
                    <span className="truncate text-xs font-medium text-foreground">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatSize(f.size)} · {formatDate(f.uploadedAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t px-6 py-4">
          <p className="text-xs text-muted-foreground">
            {files.length > 0
              ? `${files.length} file${files.length === 1 ? "" : "s"} available`
              : ""}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="size-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!selectedKey}
              onClick={handleConfirm}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="size-3.5" />
              Use selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
