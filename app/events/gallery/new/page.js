"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, X } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import FormShell from "@/components/common/FormShell";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { crumbsFor, resourceConfigs } from "@/utils/resourceConfigs";
import { RESOURCES, STATUS_OPTIONS } from "@/utils/constants";
import { createContentService } from "@/services/contentService";
import uploadService from "@/services/uploadService";
import { resolveImageUrl } from "@/utils/imageUrl";
import { useToast } from "@/contexts/ToastContext";

const config = resourceConfigs[RESOURCES.GALLERY_ITEMS];

export default function NewGalleryItemsPage() {
  const router = useRouter();
  const toast = useToast();
  const inputRef = useRef(null);
  const service = createContentService(RESOURCES.GALLERY_ITEMS);
  const [files, setFiles] = useState([]);
  const [meta, setMeta] = useState({
    title_prefix: "Gallery",
    category: "",
    year: "",
    location: "",
    status: "draft",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const addFiles = (list) => {
    const next = Array.from(list || []).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [
      ...prev,
      ...next.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const onSubmit = async () => {
    if (!files.length) {
      toast.error("Add at least one image.");
      return;
    }
    setSaving(true);
    try {
      for (let i = 0; i < files.length; i += 1) {
        const upload = await uploadService.uploadFile(files[i].file, "gallery-items");
        await service.create({
          image_url: upload.url,
          title: `${meta.title_prefix || "Gallery"} ${i + 1}`,
          description: meta.description || "",
          category: meta.category || "",
          year: meta.year || "",
          location: meta.location || "",
          alt_text: `${meta.title_prefix || "Gallery"} ${i + 1}`,
          status: meta.status || "draft",
        });
      }
      toast.success(`Created ${files.length} gallery item(s).`);
      router.push(config.basePath);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout breadcrumbs={crumbsFor(config, [{ label: "New" }])}>
      <FormShell
        title="Add gallery items"
        description="Upload multiple images at once. Shared metadata applies to all new items."
        onSubmit={onSubmit}
        onCancel={() => router.push(config.basePath)}
        loading={saving}
        submitLabel={`Create ${files.length || ""} item${files.length === 1 ? "" : "s"}`.trim()}
      >
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center"
        >
          <ImagePlus className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-700">Drag & drop images here</p>
          <p className="text-xs text-slate-500">or click to browse multiple files</p>
          <Button type="button" variant="secondary" className="mt-4" onClick={() => inputRef.current?.click()}>
            Choose files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {files.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {files.map((f) => (
              <div key={f.id} className="relative overflow-hidden rounded-xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImageUrl(f.preview)} alt="" className="aspect-video w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="absolute right-2 top-2 rounded-lg bg-white/90 p-1 text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {saving ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading and creating items…
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Title prefix"
            value={meta.title_prefix}
            onChange={(e) => setMeta((m) => ({ ...m, title_prefix: e.target.value }))}
          />
          <Input
            label="Category"
            value={meta.category}
            onChange={(e) => setMeta((m) => ({ ...m, category: e.target.value }))}
          />
          <Input
            label="Year"
            value={meta.year}
            onChange={(e) => setMeta((m) => ({ ...m, year: e.target.value }))}
          />
          <Input
            label="Location"
            value={meta.location}
            onChange={(e) => setMeta((m) => ({ ...m, location: e.target.value }))}
          />
          <Select
            label="Status"
            value={meta.status}
            onChange={(e) => setMeta((m) => ({ ...m, status: e.target.value }))}
            options={STATUS_OPTIONS}
          />
          <div className="md:col-span-2">
            <Textarea
              label="Shared description"
              value={meta.description}
              onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))}
            />
          </div>
        </div>
      </FormShell>
    </AdminLayout>
  );
}
