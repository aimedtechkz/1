import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Ambulance,
  Armchair,
  Bone,
  Droplets,
  Ear,
  Eye,
  HeartPulse,
  Lamp,
  ScanLine,
  Scissors,
  Smile,
  Stethoscope,
  TestTube,
  Bandage,
} from "lucide-react";
import type { CategoryId } from "@/lib/categories";

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  furniture: Armchair,
  urology: Droplets,
  gynecology: HeartPulse,
  ent: Ear,
  orthopedics: Bone,
  diagnostics: ScanLine,
  resuscitation: Activity,
  therapy: Stethoscope,
  surgery: Scissors,
  traumatology: Bandage,
  laboratory: TestTube,
  dentistry: Smile,
  ophthalmology: Eye,
  electrical: Lamp,
  transport: Ambulance,
};
