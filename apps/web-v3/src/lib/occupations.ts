import {
  Briefcase,
  Calculator,
  Camera,
  ChartLine,
  Clapperboard,
  Code,
  Database,
  DraftingCompass,
  FlaskConical,
  Gavel,
  GraduationCap,
  Handshake,
  HeartPulse,
  Layers,
  Leaf,
  Lightbulb,
  ListTodo,
  Music,
  Palette,
  PenLine,
  PenTool,
  Settings,
  CircleHelp,
  UserRoundCog,
  Video,
  Waypoints,
  Brush,
  type LucideIcon,
} from 'lucide-react';

// Values must match the API (lowercase).
export const OCCUPATIONS: { name: string; icon: LucideIcon }[] = [
  { name: 'accountant', icon: Calculator },
  { name: 'architect', icon: DraftingCompass },
  { name: 'artist', icon: Brush },
  { name: 'business analyst', icon: Lightbulb },
  { name: 'consultant', icon: UserRoundCog },
  { name: 'data scientist', icon: Database },
  { name: 'doctor', icon: HeartPulse },
  { name: 'engineer', icon: Settings },
  { name: 'environmental scientist', icon: Leaf },
  { name: 'filmmaker', icon: Clapperboard },
  { name: 'graphic designer', icon: Palette },
  { name: 'illustrator', icon: PenTool },
  { name: 'lawyer', icon: Gavel },
  { name: 'marketing specialist', icon: ChartLine },
  { name: 'musician', icon: Music },
  { name: 'photographer', icon: Camera },
  { name: 'product manager', icon: ListTodo },
  { name: 'project manager', icon: Waypoints },
  { name: 'sales representative', icon: Handshake },
  { name: 'scientist', icon: FlaskConical },
  { name: 'software developer', icon: Code },
  { name: 'teacher/tutor', icon: GraduationCap },
  { name: 'ui/ux designer', icon: Layers },
  { name: 'videographer', icon: Video },
  { name: 'virtual assistant', icon: Briefcase },
  { name: 'writer', icon: PenLine },
  { name: 'others', icon: CircleHelp },
];

export const occupationIcon = (name?: string) =>
  OCCUPATIONS.find((o) => o.name === name?.toLowerCase())?.icon ?? CircleHelp;

/** Unicode-safe ("sofía" -> "Sofía"), keeps acronyms readable ("ui/ux designer" -> "UI/UX Designer"). */
export const titleCase = (s?: string) =>
  (s ?? '')
    .split(/(\s+|\/)/)
    .map((w) =>
      /^(ui|ux)$/i.test(w) ? w.toUpperCase() : w.charAt(0).toLocaleUpperCase() + w.slice(1),
    )
    .join('');
