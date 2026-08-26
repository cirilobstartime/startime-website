import type { Access, FieldAccess } from "payload";

type CmsUserIdentity = {
  collection?: string;
  id?: number | string;
  role?: string;
};

function cmsUser(value: unknown): CmsUserIdentity | null {
  if (!value || typeof value !== "object") return null;
  const user = value as CmsUserIdentity;
  return user.collection === "cms-users" ? user : null;
}

export const manageCmsContent: Access = ({ req }) => Boolean(cmsUser(req.user));

export function isAdministrator(value: unknown): boolean {
  return cmsUser(value)?.role === "administrator";
}

export const createCmsUser: Access = async ({ req }) => {
  if (isAdministrator(req.user)) return true;
  if (req.user) return false;
  const users = await req.payload.count({
    collection: "cms-users",
    overrideAccess: true,
  });
  return users.totalDocs === 0;
};

export const readOwnCmsUser: Access = ({ req }) => {
  if (isAdministrator(req.user)) return true;
  const user = cmsUser(req.user);
  return user?.id ? { id: { equals: user.id } } : false;
};

export const updateOwnCmsUser: Access = readOwnCmsUser;

export const administerCmsUsers: Access = ({ req }) =>
  isAdministrator(req.user);

export const administerRole: FieldAccess = ({ req }) =>
  isAdministrator(req.user) || !req.user;
