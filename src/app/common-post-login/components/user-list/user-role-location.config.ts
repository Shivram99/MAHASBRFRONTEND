export type UserLocationField = 'registryId' | 'divisionCode' | 'districtId';

const ROLE_LOCATION_FIELD_MAP: Readonly<Record<string, readonly UserLocationField[]>> = Object.freeze({
  ROLE_DES_REGION: ['divisionCode'],
  ROLE_DES_DISTRICT: ['divisionCode', 'districtId'],
  ROLE_REG_AUTH_API: ['registryId'],
  ROLE_REG_AUTH_CSV: ['registryId']
});

export const USER_LOCATION_FIELDS: readonly UserLocationField[] = ['registryId', 'divisionCode', 'districtId'];

export function resolveRequiredLocationFields(
  roles: readonly string[] | null | undefined
): Set<UserLocationField> {
  const requiredFields = new Set<UserLocationField>();

  (roles ?? [])
    .map((role) => role?.trim().toUpperCase())
    .filter((role): role is string => Boolean(role))
    .forEach((role) => {
      (ROLE_LOCATION_FIELD_MAP[role] ?? []).forEach((field) => requiredFields.add(field));
    });

  return requiredFields;
}
