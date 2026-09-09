import * as migration_20260909_212817_maintenance_mode from "./20260909_212817_maintenance_mode";

export const migrations = [
  {
    up: migration_20260909_212817_maintenance_mode.up,
    down: migration_20260909_212817_maintenance_mode.down,
    name: "20260909_212817_maintenance_mode",
  },
];
