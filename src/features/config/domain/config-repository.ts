import type { NapeProHubConfig } from "./types";

export type ConfigStatus = "published" | "hidden" | "deleted";

export type PublishedConfigRecord = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  authorDisplayName?: string;
  usageTags: string[];
  placement?: string;
  firmwareVersion?: string;
  hubSchemaVersion: string;
  config: NapeProHubConfig;
  searchText: string;
  status: ConfigStatus;
  createdAt: string;
  updatedAt: string;
};

export type NewPublishedConfigRecord = Omit<
  PublishedConfigRecord,
  "createdAt" | "updatedAt"
> & {
  manageTokenHash: string;
};

export interface ConfigRepository {
  create(input: NewPublishedConfigRecord): Promise<PublishedConfigRecord>;
  findById(id: string): Promise<PublishedConfigRecord | null>;
  findBySlug(slug: string): Promise<PublishedConfigRecord | null>;
  listPublished(options?: {
    query?: string;
    limit?: number;
  }): Promise<PublishedConfigRecord[]>;
}
