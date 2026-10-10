import type { Lesson, Unit } from './types';
import { boardUnit } from './units/board';
import { rulesUnit } from './units/rules';
import { checkmatesUnit } from './units/checkmates';
import { safetyUnit } from './units/safety';
import { tacticsUnit } from './units/tactics';
import { openingsUnit } from './units/openings';
import { endgamesUnit } from './units/endgames';
import { strategyUnit } from './units/strategy';

/** Ordered curriculum: absolute basics first. */
export const curriculum: Unit[] = [
  boardUnit, rulesUnit, checkmatesUnit, safetyUnit, tacticsUnit, openingsUnit, endgamesUnit, strategyUnit,
];

export const allLessons: Lesson[] = curriculum.flatMap((u) => u.lessons);
export const lessonById = new Map(allLessons.map((l) => [l.id, l]));
export const unitOfLesson = new Map(curriculum.flatMap((u) => u.lessons.map((l) => [l.id, u] as const)));
