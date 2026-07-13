"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadButton as UTUploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import type { OurFileRouter } from "@/uploadthing";
import { Trash2, Eye, EyeOff, Loader2, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

type GalleryImage = {
  id: string;
  url: string;
  name: string;
  caption: string;
  alt: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};

type Props = {
  images: GalleryImage[];
};

export function GalleryEditor({ images: initial }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initial);
  const [drafts, setDrafts] = useState<Record<string, Partial<GalleryImage>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function display(img: GalleryImage): GalleryImage {
    const d = drafts[img.id];
    return d ? { ...img, ...d } : img;
  }
  function isDirty(img: GalleryImage): boolean {
    const d = drafts[img.id];
    if (!d) return false;
    return (Object.keys(d) as (keyof GalleryImage)[]).some(
      (k) => d[k] !== img[k]
    );
  }
  function setField(id: string, field: keyof GalleryImage, value: unknown) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [field]: value },
    }));
  }
  function revert(img: GalleryImage) {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[img.id];
      return next;
    });
  }

  async function save(img: GalleryImage) {
    const d = drafts[img.id];
    if (!d) return;
    setSavingId(img.id);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: img.id, ...d }),
      });
      if (!res.ok) throw new Error("Save failed");
      const merged = { ...img, ...d };
      setImages((prev) => prev.map((x) => (x.id === img.id ? merged : x)));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[img.id];
        return next;
      });
      toast.success("Saved changes");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingId(null);
    }
  }

  async function toggleActive(img: GalleryImage) {
    const newValue = !img.isActive;
    setField(img.id, "isActive", newValue);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: img.id, isActive: newValue }),
      });
      if (!res.ok) throw new Error("Failed");
      setImages((prev) =>
        prev.map((x) => (x.id === img.id ? { ...x, isActive: newValue } : x))
      );
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[img.id];
        return next;
      });
      toast.success(newValue ? "Image shown" : "Image hidden");
    } catch {
      toast.error("Failed to update");
      setField(img.id, "isActive", !newValue);
    }
  }

  async function deleteImage(img: GalleryImage) {
    setDeletingId(img.id);
    try {
      const res = await fetch(`/api/admin/gallery?id=${img.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setImages((prev) => prev.filter((x) => x.id !== img.id));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <Card className="border-dashed border-emerald-300 bg-emerald-50/30">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <ImageIcon className="size-8 text-emerald-600" />
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Upload photos
              </h3>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, GIF or WebP — up to 2MB each, 10 at a time. New
                uploads are added to the gallery automatically.
              </p>
            </div>
            <UTUploadButton
              endpoint="galleryUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  toast.success(
                    `Uploaded ${res.length} image${res.length === 1 ? "" : "s"}`
                  );
                  // Refresh the list from the server to pick up the new rows
                  // created in onUploadComplete.
                  refreshList(setImages);
                }
              }}
              onUploadError={(err) => {
                toast.error(err.message);
              }}
              appearance={{
                button:
                  "ut-ready:bg-emerald-600 ut-ready:text-white ut-ready:hover:bg-emerald-700 ut-uploading:bg-emerald-700/80 ut-uploading:text-white ut-uploading:cursor-not-allowed rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                container: "flex flex-col items-center gap-2 w-full",
                allowedContent: "hidden",
              }}
              content={{
                button({ ready }) {
                  if (ready) return "Choose Photos to Upload";
                  return "Preparing…";
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
          No images yet. Use the uploader above to add photos.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {images.map((raw) => {
            const img = display(raw);
            const dirty = isDirty(raw);
            return (
              <Card key={raw.id} className={cn(!img.isActive && "opacity-60")}>
                <CardContent className="p-4">
                  {/* Thumbnail */}
                  <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100">
                    { }
                    <img
                      src={img.url}
                      alt={img.alt || img.caption || img.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur">
                      <Switch
                        checked={img.isActive}
                        onCheckedChange={() => toggleActive(raw)}
                        aria-label="Toggle visibility"
                        className="scale-75"
                      />
                      {img.isActive ? (
                        <Eye className="size-3.5 text-white" />
                      ) : (
                        <EyeOff className="size-3.5 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <p className="mb-2 truncate text-xs font-medium text-muted-foreground">
                    {img.name}
                  </p>

                  {/* Caption */}
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Caption</Label>
                      <Input
                        value={img.caption}
                        onChange={(e) => setField(raw.id, "caption", e.target.value)}
                        className="mt-1"
                        placeholder="Shown under the photo in the lightbox"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Alt text (accessibility)</Label>
                      <Input
                        value={img.alt}
                        onChange={(e) => setField(raw.id, "alt", e.target.value)}
                        className="mt-1"
                        placeholder="Describe the image for screen readers"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center justify-between border-t pt-3">
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
                          <AlertDialogTitle>Delete image?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes &ldquo;{img.name}&rdquo; from the
                            gallery. The file may remain in UploadThing storage.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteImage(raw)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
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
                        ) : null}
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Re-fetch the gallery list from the admin API after a successful upload. */
async function refreshList(
  setImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>
) {
  try {
    const res = await fetch("/api/admin/gallery");
    if (!res.ok) return;
    const json = await res.json();
    const items = (json.items ?? []).map((r: any) => ({
      id: r.id,
      url: r.url,
      name: r.name,
      caption: r.caption,
      alt: r.alt,
      sortOrder: r.sortOrder,
      isActive: r.isActive,
      createdAt: r.createdAt,
    }));
    setImages(items);
  } catch {
    /* ignore — user can refresh the page */
  }
}
