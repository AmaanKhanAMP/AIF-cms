"use client";

import { use } from "react";
import ContentFormPage from "@/components/content/ContentFormPage";
import { crumbsFor, resourceConfigs } from "@/utils/resourceConfigs";
import { RESOURCES } from "@/utils/constants";

const config = resourceConfigs[RESOURCES.GALLERY_ITEMS];

export default function EditGalleryItemPage({ params }) {
  const { id } = use(params);
  return (
    <ContentFormPage
      {...config}
      id={id}
      title="Edit gallery item"
      description="Update gallery image metadata."
      breadcrumbs={crumbsFor(config, [{ label: "Edit" }])}
    />
  );
}
