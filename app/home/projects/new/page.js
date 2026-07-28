"use client";

import ContentFormPage from "@/components/content/ContentFormPage";
import { crumbsFor, resourceConfigs } from "@/utils/resourceConfigs";
import { RESOURCES } from "@/utils/constants";

const config = resourceConfigs[RESOURCES.HOME_PROJECTS];

export default function NewHomeProjectPage() {
  return (
    <ContentFormPage
      {...config}
      title="New project"
      description="Add a homepage project highlight."
      breadcrumbs={crumbsFor(config, [{ label: "New" }])}
    />
  );
}
