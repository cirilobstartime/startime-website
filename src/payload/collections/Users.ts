import type { CollectionConfig } from "payload";
import {
  administerCmsUsers,
  administerRole,
  createCmsUser,
  readOwnCmsUser,
  updateOwnCmsUser,
} from "../access/cmsUsers";

export const Users: CollectionConfig = {
  slug: "cms-users",
  auth: true,
  access: {
    create: createCmsUser,
    delete: administerCmsUsers,
    read: readOwnCmsUser,
    update: updateOwnCmsUser,
  },
  admin: {
    group: "Administration",
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      defaultValue: "editor",
      access: {
        create: administerRole,
        update: administerRole,
      },
      options: [
        { label: "Administrator", value: "administrator" },
        { label: "Content editor", value: "editor" },
      ],
      required: true,
    },
  ],
};
