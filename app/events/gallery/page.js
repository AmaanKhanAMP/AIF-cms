"use client";

import ContentListPage from "@/components/content/ContentListPage";
import { crumbsFor, resourceConfigs } from "@/utils/resourceConfigs";
import { RESOURCES } from "@/utils/constants";

const config = resourceConfigs[RESOURCES.GALLERY_ITEMS];

export default function GalleryPage() {
  return <ContentListPage {...config} breadcrumbs={crumbsFor(config)} />;
}
