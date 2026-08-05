export const DB_COLLECTIONS = [
  "aboutus",
  "assets",
  "auditlogs",
  "companystructures",
  "contacts",
  "homepages",
  "inquiries",
  "otps",
  "projects",
  "services",
  "sessions",
  "testimonials",
  "users",
];

export const getDbCollections = () => DB_COLLECTIONS;

export const getDbCollectionsExcept = (exceptions: string[]) =>
  DB_COLLECTIONS.filter(
    (collection: string) => !exceptions.includes(collection),
  );
