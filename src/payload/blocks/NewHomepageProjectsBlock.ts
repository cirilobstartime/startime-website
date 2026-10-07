import type { Block } from "payload";
import { sectionControlsFor } from "./shared";
import { homepageItemVisualFields, homepageVisualFields } from "../fields/visualStyle";
import { fallbackImageField, responsiveImagesField } from "../fields/responsiveMedia";

export const NewHomepageProjectsBlock: Block = {
  slug: "newHomepageProjects",
  labels: { singular: "New homepage projects", plural: "New homepage projects" },
  fields: [
    ...sectionControlsFor("homeProjectsSection"),
    ...homepageVisualFields,
    { name: "eyebrow", type: "text", required: true },
    { name: "heading", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    { name: "ctaLabel", type: "text", required: true },
    { name: "ctaURL", type: "text", admin: { description: "Leave empty to send every project card to the Projects section of the current language's Investment page. An individual project link takes priority when set." } },
    { name: "showCTA", type: "checkbox", defaultValue: true },
    {
      name: "pageProjects",
      label: "Homepage-only project slides",
      type: "array",
      minRows: 1,
      maxRows: 30,
      admin: { description: "These projects belong to this homepage only. Drag to reorder; each language can have different copy, imagery, colors, and links. They do not change Investment." },
      fields: [
        { name: "title", type: "text", required: true, admin: { description: "When this project has no logo, its title becomes the identity mark. The text area expands to the available slide width (up to 760 px) so names stay on one line where space allows; long names may wrap naturally on smaller screens. Adjust its per-screen font size under 'This item only' if needed." } },
        { name: "projectName", label: "Project name below logo", type: "text", admin: { description: "Shown directly below the logo on this homepage slide. Leave empty to use the title above. Edit English and Arabic independently." } },
        { name: "description", type: "textarea", required: true },
        fallbackImageField("image", "Project fallback photograph", "project"),
        responsiveImagesField("images", "Slide image by screen", "project"),
        fallbackImageField("logo", "Optional project fallback logo · leave empty to show title", "projectLogo", false),
        responsiveImagesField("logos", "Project logo by screen", "projectLogo"),
        { name: "destination", type: "text", admin: { description: "Optional override for this project. Leave empty to use the section destination, or the current language's Investment Projects section by default." } },
        { name: "visible", type: "checkbox", defaultValue: true },
        ...homepageItemVisualFields,
      ],
    },
    { name: "projects", type: "relationship", relationTo: "projects", hasMany: true, admin: { hidden: true, description: "Legacy import only. Homepage now uses homepage-only project slides above." } },
  ],
};
