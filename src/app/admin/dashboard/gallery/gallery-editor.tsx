"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadButton as UTUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/uploadthing";
import { Trash2, Eye, EyeOff, Loader2, ImageIcon, Plus, X, FolderPlus, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id: string;
  url: string;
  name: string;
  caption: string;
  alt: string;
  albumId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};

type Album = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

type Props = {
  images: GalleryImage[];
  albums: Album[];
};

export function GalleryEditor({ images: initial, albums: initialAlbums }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initial);
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [drafts, setDrafts] = useState<Record<string, Partial<GalleryImage>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(""); // "" = Uncategorized
  const [addingAlbum, setAddingAlbum] = useState(false);
  const [albumDrafts, setAlbumDrafts] = useState<Record<string, Partial<Album>>>({});
  const [albumSaving, setAlbumSaving] = useState<string | null>(null);
  const [albumDeleting, setAlbumDeleting] = useState<string | null>(null);

  // === Image helpers ===
  function display(img: GalleryImage): GalleryImage {
    const d = drafts[img.id];
    return d ? { ...img, ...d } : img;
  }
  function isDirty(img: GalleryImage): boolean {
    const d = drafts[img.id];
    if (!d) return false;
    return (Object.keys(d) as (keyof GalleryImage)[]).some((k) => d[k] !== img[k]);
  }
  function setField(id: string, field: keyof GalleryImage, value: unknown) {
    setDrafts((p) => ({ ...p, [id]: { ...(p[id] ?? {}), [field]: value } }));
  }
  function revert(img: GalleryImage) {
    setDrafts((p) => { const n = { ...p }; delete n[img.id]; return n; });
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
      setDrafts((prev) => { const n = { ...prev }; delete n[img.id]; return n; });
      toast.success("Saved changes");
    } catch { toast.error("Failed to save"); }
    finally { setSavingId(null); }
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
      setImages((prev) => prev.map((x) => (x.id === img.id ? { ...x, isActive: newValue } : x)));
      setDrafts((prev) => { const n = { ...prev }; delete n[img.id]; return n; });
      toast.success(newValue ? "Image shown" : "Image hidden");
    } catch { toast.error("Failed to update"); setField(img.id, "isActive", !newValue); }
  }

  async function deleteImage(img: GalleryImage) {
    setDeletingId(img.id);
    try {
      const res = await fetch(`/api/admin/gallery?id=${img.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setImages((prev) => prev.filter((x) => x.id !== img.id));
      toast.success("Image deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setDeletingId(null); }
  }

  async function refreshList() {
    try {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) return;
      const json = await res.json();
      setImages((json.items ?? []).map((r: any) => ({
        id: r.id, url: r.url, name: r.name, caption: r.caption, alt: r.alt,
        albumId: r.albumId, sortOrder: r.sortOrder, isActive: r.isActive,
        createdAt: r.createdAt,
      })));
    } catch { /* ignore */ }
  }

  // === Move image to album (instant save) ===
  async function moveToAlbum(img: GalleryImage, albumId: string) {
    const newAlbumId = albumId === "" ? null : albumId;
    setField(img.id, "albumId", newAlbumId);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: img.id, albumId: newAlbumId }),
      });
      if (!res.ok) throw new Error("Failed");
      setImages((prev) => prev.map((x) => (x.id === img.id ? { ...x, albumId: newAlbumId } : x)));
      setDrafts((prev) => { const n = { ...prev }; delete n[img.id]; return n; });
      toast.success("Moved to album");
    } catch { toast.error("Failed to move"); }
  }

  // === Album CRUD ===
  async function createAlbum(data: { name: string; description: string }) {
    try {
      const res = await fetch("/api/admin/gallery/albums", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create failed");
      const json = await res.json();
      setAlbums((prev) => [...prev, json.item]);
      toast.success("Album created");
      setAddingAlbum(false);
    } catch { toast.error("Failed to create album"); }
  }

  function displayAlbum(a: Album): Album {
    const d = albumDrafts[a.id];
    return d ? { ...a, ...d } : a;
  }
  function isAlbumDirty(a: Album): boolean {
    const d = albumDrafts[a.id];
    if (!d) return false;
    return (Object.keys(d) as (keyof Album)[]).some((k) => d[k] !== a[k]);
  }
  function setAlbumField(id: string, field: keyof Album, value: unknown) {
    setAlbumDrafts((p) => ({ ...p, [id]: { ...(p[id] ?? {}), [field]: value } }));
  }
  function revertAlbum(a: Album) {
    setAlbumDrafts((p) => { const n = { ...p }; delete n[a.id]; return n; });
  }
  async function saveAlbum(a: Album) {
    const d = albumDrafts[a.id];
    if (!d) return;
    setAlbumSaving(a.id);
    try {
      const res = await fetch("/api/admin/gallery/albums", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, ...d }),
      });
      if (!res.ok) throw new Error("Save failed");
      const merged = { ...a, ...d };
      setAlbums((prev) => prev.map((x) => (x.id === a.id ? merged : x)));
      setAlbumDrafts((p) => { const n = { ...p }; delete n[a.id]; return n; });
      toast.success("Album saved");
    } catch { toast.error("Failed to save album"); }
    finally { setAlbumSaving(null); }
  }
  async function deleteAlbum(a: Album) {
    setAlbumDeleting(a.id);
    try {
      const res = await fetch(`/api/admin/gallery/albums?id=${a.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      // Images in this album move to Uncategorized (albumId=null)
      setImages((prev) => prev.map((x) => (x.albumId === a.id ? { ...x, albumId: null } : x)));
      setAlbums((prev) => prev.filter((x) => x.id !== a.id));
      toast.success("Album deleted (images moved to Uncategorized)");
    } catch { toast.error("Failed to delete album"); }
    finally { setAlbumDeleting(null); }
  }

  // Group images by album for display
  const albumGroups: { album: Album | null; images: GalleryImage[] }[] = [];
  for (const album of albums) {
    albumGroups.push({ album, images: images.filter((i) => i.albumId === album.id) });
  }
  const uncategorized = images.filter((i) => !i.albumId);
  if (uncategorized.length > 0) {
    albumGroups.push({ album: null, images: uncategorized });
  }

  return (
    <div className="space-y-6">
      {/* ===== ALBUMS MANAGEMENT ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Albums</CardTitle>
            <Button size="sm" onClick={() => setAddingAlbum(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
              <FolderPlus className="size-3.5" /> New Album
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {addingAlbum && (
            <AddAlbumForm onCancel={() => setAddingAlbum(false)} onCreate={createAlbum} />
          )}
          {albums.length === 0 && !addingAlbum && (
            <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
              No albums yet. Create one to organize your gallery.
            </p>
          )}
          {albums.map((raw) => {
            const a = displayAlbum(raw);
            const dirty = isAlbumDirty(raw);
            const count = images.filter((i) => i.albumId === a.id).length;
            return (
              <div key={raw.id} className={cn("rounded-lg border p-3", dirty ? "border-amber-300 bg-amber-50/30" : "border-border", !a.isActive && "opacity-60")}>
                <div className="flex items-center gap-2">
                  <Input value={a.name} onChange={(e) => setAlbumField(raw.id, "name", e.target.value)} className="flex-1" placeholder="Album name" />
                  <span className="shrink-0 text-xs text-muted-foreground">{count} img{count === 1 ? "" : "s"}</span>
                  <Switch checked={a.isActive} onCheckedChange={(v) => setAlbumField(raw.id, "isActive", v)} />
                </div>
                <Input value={a.description} onChange={(e) => setAlbumField(raw.id, "description", e.target.value)} className="mt-2" placeholder="Description (optional)" />
                <div className="mt-2 flex items-center justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={albumDeleting === raw.id} className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        {albumDeleting === raw.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete album?</AlertDialogTitle>
                        <AlertDialogDescription>
                          The album &ldquo;{a.name}&rdquo; will be removed. Its {count} image{count === 1 ? "" : "s"} will move to Uncategorized (not deleted).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteAlbum(raw)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete album</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" disabled={!dirty || albumSaving === raw.id} onClick={() => revertAlbum(raw)}>Revert</Button>
                    <Button size="sm" disabled={!dirty || albumSaving === raw.id} onClick={() => saveAlbum(raw)} className="bg-emerald-600 hover:bg-emerald-700">
                      {albumSaving === raw.id ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ===== UPLOAD ZONE ===== */}
      <Card className="border-dashed border-emerald-300 bg-emerald-50/30">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <ImageIcon className="size-8 text-emerald-600" />
            <div>
              <h3 className="text-base font-semibold text-foreground">Upload photos</h3>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, GIF or WebP — up to 2MB each, 10 at a time.
              </p>
            </div>
            {/* Album selector for uploads */}
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Upload to:</Label>
              <Select value={selectedAlbumId || "__none__"} onValueChange={(v) => setSelectedAlbumId(v === "__none__" ? "" : v)}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Uncategorized</SelectItem>
                  {albums.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <UTUploadButton
              endpoint="galleryUploader"
              input={{ albumId: selectedAlbumId || null }}
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  toast.success(`Uploaded ${res.length} image${res.length === 1 ? "" : "s"}`);
                  refreshList();
                }
              }}
              onUploadError={(err) => { toast.error(err.message); }}
              appearance={{
                button: "data-[state=ready]:bg-emerald-600 data-[state=ready]:text-white data-[state=ready]:hover:bg-emerald-700 data-[state=uploading]:bg-emerald-700/80 data-[state=uploading]:text-white data-[state=uploading]:cursor-not-allowed data-[state=readying]:bg-emerald-400 data-[state=readying]:text-white rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                container: "flex flex-col items-center gap-2",
                allowedContent: "hidden",
              }}
              content={{ button: ({ ready }) => ready ? "Choose Photos to Upload" : "Preparing…" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* ===== IMAGES GROUPED BY ALBUM ===== */}
      {albumGroups.map(({ album, images: groupImages }) => (
        <Card key={album?.id ?? "__uncategorized__"}>
          <CardHeader>
            <CardTitle className="text-base">
              {album?.name ?? "Uncategorized"}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({groupImages.length} image{groupImages.length === 1 ? "" : "s"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupImages.length === 0 ? (
              <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                No images in this album yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groupImages.map((raw) => {
                  const img = display(raw);
                  const dirty = isDirty(raw);
                  return (
                    <Card key={raw.id} className={cn(!img.isActive && "opacity-60")}>
                      <CardContent className="p-4">
                        {/* Thumbnail */}
                        <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100">
                          <img src={img.url} alt={img.alt || img.caption || img.name} className="h-full w-full object-cover" />
                          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur">
                            <Switch checked={img.isActive} onCheckedChange={() => toggleActive(raw)} aria-label="Toggle visibility" className="scale-75" />
                            {img.isActive ? <Eye className="size-3.5 text-white" /> : <EyeOff className="size-3.5 text-white" />}
                          </div>
                        </div>
                        {/* Name */}
                        <p className="mb-2 truncate text-xs font-medium text-muted-foreground">{img.name}</p>
                        {/* Caption + alt */}
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Caption</Label>
                            <Input value={img.caption} onChange={(e) => setField(raw.id, "caption", e.target.value)} className="mt-1" placeholder="Shown under the photo in the lightbox" />
                          </div>
                          {/* Move to album */}
                          <div>
                            <Label className="text-xs">Album</Label>
                            <Select
                              value={img.albumId ?? "__none__"}
                              onValueChange={(v) => moveToAlbum(raw, v === "__none__" ? "" : v)}
                            >
                              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">Uncategorized</SelectItem>
                                {albums.map((a) => (
                                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="mt-3 flex items-center justify-between border-t pt-3">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" disabled={deletingId === raw.id} className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive">
                                {deletingId === raw.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete image?</AlertDialogTitle>
                                <AlertDialogDescription>This removes &ldquo;{img.name}&rdquo; from the gallery.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteImage(raw)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          {dirty && (
                            <Button size="sm" disabled={savingId === raw.id} onClick={() => save(raw)} className="bg-emerald-600 hover:bg-emerald-700">
                              {savingId === raw.id ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                              Save
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {images.length === 0 && (
        <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
          No images yet. Use the uploader above to add photos.
        </div>
      )}
    </div>
  );
}

// === Add album form ===
function AddAlbumForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: (data: { name: string; description: string }) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <div className="rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-emerald-800">New Album</h4>
        <Button variant="ghost" size="icon" className="size-6" onClick={onCancel}><X className="size-3" /></Button>
      </div>
      <Input value={name} onChange={(e) => setName(e.target.value)} className="mb-2" placeholder="Album name (e.g. Staff, Events)" autoFocus />
      <Input value={description} onChange={(e) => setDescription(e.target.value)} className="mb-2" placeholder="Description (optional)" />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" disabled={!name.trim()} onClick={() => onCreate({ name, description })} className="bg-emerald-600 hover:bg-emerald-700">Create</Button>
      </div>
    </div>
  );
}
