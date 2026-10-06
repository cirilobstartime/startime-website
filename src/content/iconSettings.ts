import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { IconSettingsData } from "./iconDimensions";

export const getIconSettings = cache(async (): Promise<IconSettingsData> => {
  try {
    const payload = await getPayload({ config: configPromise });
    return await payload.findGlobal({ slug: "icon-settings", depth: 0, overrideAccess: true }) as IconSettingsData;
  } catch (error) {
    console.error("Unable to load icon settings; retaining approved sizes", error);
    return {};
  }
});
