import type {
  ActivityRow,
  CommunicationNoteRow,
  CommunicationPhotoRow,
  CommunicationRow,
  MediaNoteRow,
  PersonalNoteRow,
  TaskNoteRow,
  TaskPhotoRow,
  TaskRow,
  TopPerformerRow,
} from '@/types/database';

export interface NoteUI {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
}

export interface PhotoUI {
  id: string;
  storagePath: string;
  url: string | null;
  name: string | null;
  caption: string | null;
  uploadedByName: string;
  uploadedAt: string;
}

export interface TaskUI extends TaskRow {
  completedByName: string | null;
  createdByName: string | null;
  notes: NoteUI[];
  photos: PhotoUI[];
}

export interface CommunicationUI extends CommunicationRow {
  completedByName: string | null;
  createdByName: string | null;
  notes: NoteUI[];
  photos: PhotoUI[];
}

export type PersonalNoteUI = PersonalNoteRow;
export type ActivityUI = ActivityRow & { actorName: string | null };
export type TopPerformerUI = TopPerformerRow;

export interface MediaNoteUI extends MediaNoteRow {
  url: string | null;
  uploadedByName: string;
}

export interface RawMediaNoteRow extends MediaNoteRow {
  uploader: RawProfileRef | null;
}

// Raw embedded-select shapes returned by PostgREST before UI mapping.
export interface RawProfileRef {
  name: string;
}

export interface RawTaskRow extends TaskRow {
  task_notes: (TaskNoteRow & { author: RawProfileRef | null })[];
  task_photos: (TaskPhotoRow & { uploader: RawProfileRef | null })[];
  completed_by_profile: RawProfileRef | null;
  created_by_profile: RawProfileRef | null;
}

export interface RawCommunicationRow extends CommunicationRow {
  communication_notes: (CommunicationNoteRow & { author: RawProfileRef | null })[];
  communication_photos: (CommunicationPhotoRow & { uploader: RawProfileRef | null })[];
  completed_by_profile: RawProfileRef | null;
  created_by_profile: RawProfileRef | null;
}
