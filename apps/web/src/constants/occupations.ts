import { IconType } from 'react-icons';
import {
  FaCode,
  FaPaintBrush,
  FaChartLine,
  FaMusic,
  FaPen,
  FaFilm,
  FaPalette,
  FaDatabase,
  FaTasks,
  FaDraftingCompass,
  FaCameraRetro,
  FaCalculator,
  FaUserTie,
  FaFlask,
  FaCogs,
  FaChalkboardTeacher,
  FaProjectDiagram,
  FaHandshake,
  FaLightbulb,
  FaPencilRuler,
  FaVideo,
  FaBriefcase,
  FaBalanceScale,
  FaHeartbeat,
  FaLeaf,
  FaObjectGroup,
  FaQuestionCircle,
} from 'react-icons/fa';

export type OccupationItem = {
  name: string;
  icon: IconType;
};

export const OCCUPATIONS: OccupationItem[] = [
  { name: 'accountant', icon: FaCalculator },
  { name: 'architect', icon: FaDraftingCompass },
  { name: 'artist', icon: FaPaintBrush },
  { name: 'business analyst', icon: FaLightbulb },
  { name: 'consultant', icon: FaUserTie },
  { name: 'data scientist', icon: FaDatabase },
  { name: 'doctor', icon: FaHeartbeat },
  { name: 'engineer', icon: FaCogs },
  { name: 'environmental scientist', icon: FaLeaf },
  { name: 'filmmaker', icon: FaFilm },
  { name: 'graphic designer', icon: FaPalette },
  { name: 'illustrator', icon: FaPencilRuler },
  { name: 'lawyer', icon: FaBalanceScale },
  { name: 'marketing specialist', icon: FaChartLine },
  { name: 'musician', icon: FaMusic },
  { name: 'photographer', icon: FaCameraRetro },
  { name: 'product manager', icon: FaTasks },
  { name: 'project manager', icon: FaProjectDiagram },
  { name: 'sales representative', icon: FaHandshake },
  { name: 'scientist', icon: FaFlask },
  { name: 'software developer', icon: FaCode },
  { name: 'teacher/tutor', icon: FaChalkboardTeacher },
  { name: 'ui/ux designer', icon: FaObjectGroup },
  { name: 'videographer', icon: FaVideo },
  { name: 'virtual assistant', icon: FaBriefcase },
  { name: 'writer', icon: FaPen },
  { name: 'others', icon: FaQuestionCircle },
];

export type Occupation = (typeof OCCUPATIONS)[number]['name'];
