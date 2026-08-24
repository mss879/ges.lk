/**
 * Row shapes for the tables created by supabase/migrations/.
 *
 * Hand-written rather than generated so the app builds before the database
 * exists. If you later run `supabase gen types typescript`, replace this file
 * and keep the exported names.
 */

export type InquiryStatus = "new" | "read" | "converted" | "archived";
export type ProjectCategory = "residential" | "commercial";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: InquiryStatus;
  lead_id: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Pipeline {
  id: string;
  name: string;
  is_default: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface PipelineStage {
  id: string;
  pipeline_id: string;
  name: string;
  is_default: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  pipeline_id: string;
  stage_id: string;
  inquiry_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  notes: string | null;
  value: number | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  /** null for images seeded from /public; set for files uploaded to storage */
  storage_path: string | null;
  alt: string | null;
  position: number;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  location: string | null;
  capacity: string | null;
  category: ProjectCategory;
  description: string | null;
  is_published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithImages extends Project {
  project_images: ProjectImage[];
}
