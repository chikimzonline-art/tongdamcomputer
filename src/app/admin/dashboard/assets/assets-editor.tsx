"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadButton as UTUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/uploadthing";
import { Trash2, Loader2, Check, Image as ImageIcon, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExistingFilePicker } from "@/components/admin/existing-file-picker";

type Props = {
  logoUrl: string;
  faviconUrl: string;
};

export function AssetsEditor({ logoUrl: initialLogo, faviconUrl: initialFavicon }: Props) {
  const [logoUrl, setLogoUrl] = useState(initialLogo);
  const [faviconUrl, setFaviconUrl] = useState(initialFavicon);
  const [savingLogo, setSavingLogo] = useState(false);
  const [savingFavicon, setSavingFavicon] = useState(false);
  const [pickerFor, setPickerFor] = useState<null | "logo" | "favicon">(null);

  async function saveAsset(key: "site.logoUrl" | "site.faviconUrl", url: string) {
    const isLogo = key === "site.logoUrl";
    if (isLogo) setSavingLogo(true);
    else setSavingFavicon(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: url, category: "assets" }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success(isLogo ? "Logo updated" : "Favicon updated");
    } catch {
      toast.error("Failed to save");
      // Revert on failure
      if (isLogo) setLogoUrl(initialLogo);
      else setFaviconUrl(initialFavicon);
    } finally {
      if (isLogo) setSavingLogo(false);
      else setSavingFavicon(false);
    }
  }

  async function clearAsset(key: "site.logoUrl" | "site.faviconUrl") {
    const isLogo = key === "site.logoUrl";
    if (isLogo) setSavingLogo(true);
    else setSavingFavicon(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: "", category: "assets" }),
      });
      if (!res.ok) throw new Error("Clear failed");
      if (isLogo) setLogoUrl("");
      else setFaviconUrl("");
      toast.success(isLogo ? "Logo reset to default" : "Favicon reset to default");
    } catch {
      toast.error("Failed to clear");
    } finally {
      if (isLogo) setSavingLogo(false);
      else setSavingFavicon(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* LOGO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="size-4 text-emerald-600" />
            Site Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview */}
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed bg-gray-50 p-4">
            {logoUrl ? (
               
              <img
                src={logoUrl}
                alt="Site logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-xs text-muted-foreground">
                <ImageIcon className="mx-auto mb-1 size-6 opacity-40" />
                No logo set — using default (emerald Cpu icon in header)
              </div>
            )}
          </div>

          {logoUrl && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-2 text-xs text-emerald-700">
              <Check className="size-3.5 shrink-0" />
              <span className="truncate">Logo is live across the site</span>
            </div>
          )}

          {/* Upload */}
          <UTUploadButton<OurFileRouter, "assetUploader">
            endpoint="assetUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                const url = res[0].url;
                setLogoUrl(url);
                void saveAsset("site.logoUrl", url);
              }
            }}
            onUploadError={(err) => {
              toast.error(err.message);
            }}
            appearance={{
              button:
                "data-[state=ready]:bg-emerald-600 data-[state=ready]:text-white data-[state=ready]:hover:bg-emerald-700 data-[state=uploading]:bg-emerald-700/80 data-[state=uploading]:text-white data-[state=uploading]:cursor-not-allowed data-[state=readying]:bg-emerald-400 data-[state=readying]:text-white rounded-md px-4 py-2 text-sm font-medium transition-colors w-full cursor-pointer",
              container: "flex flex-col items-stretch gap-2",
              allowedContent: "hidden",
            }}
            content={{
              button({ ready }) {
                if (ready) return savingLogo ? "Saving…" : "Upload New Logo";
                return "Preparing…";
              },
            }}
          />

          {/* Select from existing uploads */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPickerFor("logo")}
            className="w-full gap-1.5"
          >
            <FolderOpen className="size-3.5" />
            Select from existing uploads
          </Button>

          {logoUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearAsset("site.logoUrl")}
              disabled={savingLogo}
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Reset to default
            </Button>
          )}

          {savingLogo && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Saving…
            </p>
          )}
        </CardContent>
      </Card>

      {/* FAVICON */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="size-4 text-emerald-600" />
            Favicon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview */}
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed bg-gray-50 p-4">
            {faviconUrl ? (
               
              <img
                src={faviconUrl}
                alt="Favicon"
                className="size-16 object-contain"
              />
            ) : (
              <div className="text-center text-xs text-muted-foreground">
                <ImageIcon className="mx-auto mb-1 size-6 opacity-40" />
                No favicon set — using default (/logo.svg)
              </div>
            )}
          </div>

          {faviconUrl && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-2 text-xs text-emerald-700">
              <Check className="size-3.5 shrink-0" />
              <span className="truncate">Favicon is live in the browser tab</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Tip: use a square image (e.g. 256×256 PNG) for the crispest result
            across browser tabs and bookmarks.
          </p>

          {/* Upload */}
          <UTUploadButton<OurFileRouter, "assetUploader">
            endpoint="assetUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                const url = res[0].url;
                setFaviconUrl(url);
                void saveAsset("site.faviconUrl", url);
              }
            }}
            onUploadError={(err) => {
              toast.error(err.message);
            }}
            appearance={{
              button:
                "data-[state=ready]:bg-emerald-600 data-[state=ready]:text-white data-[state=ready]:hover:bg-emerald-700 data-[state=uploading]:bg-emerald-700/80 data-[state=uploading]:text-white data-[state=uploading]:cursor-not-allowed data-[state=readying]:bg-emerald-400 data-[state=readying]:text-white rounded-md px-4 py-2 text-sm font-medium transition-colors w-full cursor-pointer",
              container: "flex flex-col items-stretch gap-2",
              allowedContent: "hidden",
            }}
            content={{
              button({ ready }) {
                if (ready) return savingFavicon ? "Saving…" : "Upload New Favicon";
                return "Preparing…";
              },
            }}
          />

          {/* Select from existing uploads */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPickerFor("favicon")}
            className="w-full gap-1.5"
          >
            <FolderOpen className="size-3.5" />
            Select from existing uploads
          </Button>

          {faviconUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearAsset("site.faviconUrl")}
              disabled={savingFavicon}
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Reset to default
            </Button>
          )}

          {savingFavicon && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Saving…
            </p>
          )}
        </CardContent>
      </Card>

      {/* Existing file picker dialog — shared by logo & favicon */}
      <ExistingFilePicker
        open={pickerFor !== null}
        onClose={() => setPickerFor(null)}
        excludeUrl={pickerFor === "logo" ? logoUrl : faviconUrl}
        onSelect={(selected) => {
          if (selected.length === 0) return;
          const { url, name } = selected[0];
          if (pickerFor === "logo") {
            setLogoUrl(url);
            void saveAsset("site.logoUrl", url);
          } else if (pickerFor === "favicon") {
            setFaviconUrl(url);
            void saveAsset("site.faviconUrl", url);
          }
          toast.success(`Selected "${name}"`);
        }}
      />
    </div>
  );
}
