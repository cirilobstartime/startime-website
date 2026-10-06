import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { DesignSettingsData } from "@/lib/designSettings";

export const getDesignSettings = cache(
  async (): Promise<DesignSettingsData> => {
    try {
      return (await (
        await getPayload({ config: configPromise })
      ).findGlobal({
        slug: "design-settings",
        depth: 0,
        overrideAccess: true,
      })) as DesignSettingsData;
    } catch (error) {
      console.error(
        "Global design settings unavailable; preserving existing design with brand heading defaults",
        error,
      );
      return {};
    }
  },
);
