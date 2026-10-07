import type { Block } from "payload";
import { sectionControlsFor } from "./shared";
import { brandColorField, homepageVisualFields, textRole } from "../fields/visualStyle";
import { fallbackImageField, responsiveImagesField, responsiveVideosField } from "../fields/responsiveMedia";

/** The approved three-scene homepage opening, not a generic replacement hero. */
export const NewHomepageOpeningBlock: Block = {
  slug: "newHomepageOpening",
  labels: { singular: "New homepage opening", plural: "New homepage openings" },
  fields: [
    ...sectionControlsFor("hero"),
    ...homepageVisualFields,
    {
      type: "tabs",
      tabs: [
        {
          label: "Scene 1 · maritime forum",
          fields: [
            { name: "eyebrow", type: "text", required: true },
            { name: "heading", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
            { name: "headingURL", label: "Discover More · destination", type: "text", admin: { description: "The heading is not a link. This is the button destination; empty uses the maritime forum website for this language." } },
            { name: "showDiscoverButton", label: "Show Discover More button", type: "checkbox", defaultValue: true },
            { name: "discoverLabel", label: "Discover More · button text", type: "text", admin: { description: "Empty uses Discover More in English or اكتشف المزيد in Arabic." } },
            brandColorField("discoverTextColor", "Discover More · text color (default #ffffff)"),
            brandColorField("discoverBorderColor", "Discover More · border color (default #74659f)"),
            brandColorField("discoverBackgroundColor", "Discover More · background color (default #74659f)"),
            fallbackImageField("sceneOneImage", "Scene 1 fallback image", "hero"),
            responsiveImagesField("sceneOneImages", "Scene 1 images by screen", "hero"),
            responsiveVideosField("sceneOneVideos", "Scene 1 videos by screen"),
            { name: "sceneOneTextStyles", label: "Scene 1 text colors and sizes", type: "group", fields: [textRole("eyebrow", "Eyebrow"), textRole("heading", "Heading"), textRole("body", "Description")] },
          ],
        },
        {
          label: "Scenes 2 and 3",
          fields: [
            { name: "heritageHeading", type: "text", required: true },
            { name: "showPresentationSkip", label: "Scene 2 · show Skip the presentation", type: "checkbox", defaultValue: true },
            { name: "presentationSkipLabel", label: "Scene 2 · skip button text", type: "text", admin: { description: "Empty uses Skip the presentation / تخطى العرض. Jumps past all hero scenes and the panorama to the next visible content section." } },
            fallbackImageField("sceneTwoImage", "Scene 2 fallback image", "hero"),
            responsiveImagesField("sceneTwoImages", "Scene 2 images by screen", "hero"),
            responsiveVideosField("sceneTwoVideos", "Scene 2 videos by screen"),
            { name: "sceneTwoTextStyles", label: "Scene 2 heading color and sizes", type: "group", fields: [textRole("heading", "Heading")] },
            { name: "futureHeading", type: "text", required: true },
            fallbackImageField("sceneThreeImage", "Scene 3 fallback image · animation retained", "hero"),
            responsiveImagesField("sceneThreeImages", "Scene 3 images by screen", "hero"),
            responsiveVideosField("sceneThreeVideos", "Scene 3 videos by screen"),
            { name: "sceneThreeTextStyles", label: "Scene 3 heading color and sizes", type: "group", fields: [textRole("heading", "Heading")] },
          ],
        },
      ],
    },
  ],
};
