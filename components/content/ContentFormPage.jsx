"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/layouts/AdminLayout";
import FormShell from "@/components/common/FormShell";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import ImageUpload from "@/components/ui/ImageUpload";
import LoadingSkeleton, { Skeleton } from "@/components/common/LoadingSkeleton";
import { createContentService } from "@/services/contentService";
import { useToast } from "@/contexts/ToastContext";
import { STATUS_OPTIONS } from "@/utils/constants";

export default function ContentFormPage({
  resource,
  id,
  basePath,
  breadcrumbs,
  title,
  description,
  fields,
  folder,
  defaults = {},
}) {
  const router = useRouter();
  const toast = useToast();
  const service = createContentService(resource);
  const isNew = !id || id === "new";
  const [form, setForm] = useState({ status: "draft", ...defaults });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await service.get(id);
        if (!cancelled) setForm({ ...defaults, ...(res.data || {}) });
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load item.");
        router.replace(basePath);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]); // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    fields.forEach((f) => {
      if (f.required && !String(form[f.name] ?? "").trim()) {
        next[f.name] = `${f.label} is required.`;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSaving(true);
    try {
      const payload = {};
      fields.forEach((f) => {
        let val = form[f.name];
        if (f.type === "number" && val !== "" && val != null) val = Number(val);
        payload[f.name] = val;
      });
      if (isNew) await service.create(payload);
      else await service.update(id, payload);
      toast.success(isNew ? "Created successfully." : "Saved successfully.");
      router.push(basePath);
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      {loading ? (
        <div className="mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-8 w-64" />
          <LoadingSkeleton rows={2} />
        </div>
      ) : (
        <FormShell
          title={title}
          description={description}
          onSubmit={onSubmit}
          onCancel={() => router.push(basePath)}
          loading={saving}
          submitLabel={isNew ? "Create" : "Save changes"}
        >
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => {
              if (field.type === "image") {
                return (
                  <div key={field.name} className={field.full ? "md:col-span-2" : ""}>
                    <ImageUpload
                      label={field.label}
                      value={form[field.name] || ""}
                      onChange={(url) => setField(field.name, url)}
                      folder={folder || resource}
                      aspect={field.aspect || "video"}
                    />
                    {errors[field.name] ? (
                      <p className="mt-1 text-xs text-red-600">{errors[field.name]}</p>
                    ) : null}
                  </div>
                );
              }
              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="md:col-span-2">
                    <Textarea
                      label={field.label}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={(e) => setField(field.name, e.target.value)}
                      error={errors[field.name]}
                      rows={field.rows || 4}
                    />
                  </div>
                );
              }
              if (field.type === "select") {
                return (
                  <Select
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={form[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    options={field.options || STATUS_OPTIONS}
                    error={errors[field.name]}
                  />
                );
              }
              return (
                <Input
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name] ?? ""}
                  onChange={(e) => setField(field.name, e.target.value)}
                  error={errors[field.name]}
                  placeholder={field.placeholder}
                />
              );
            })}
          </div>
        </FormShell>
      )}
    </AdminLayout>
  );
}
