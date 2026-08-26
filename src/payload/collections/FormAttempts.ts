import type { CollectionConfig } from "payload";

export const FormAttempts: CollectionConfig = {
  slug: "form-attempts",
  admin: { hidden: true },
  access: {
    create: () => false,
    delete: () => false,
    read: () => false,
    update: () => false,
  },
  fields: [
    {
      name: "attemptKey",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    { name: "expiresAt", type: "date", required: true, index: true },
    { name: "formKey", type: "text", required: true, index: true },
    { name: "ipHash", type: "text", required: true, index: true },
  ],
};
