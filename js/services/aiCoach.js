// ========================================
// FitLife Bulgaria — AI Coach Intelligence Engine
// ========================================

const AICoachService = {
  // ── Exercise Database Knowledge Base for AI ──
  exerciseKB: {
    chest: [
      { name: 'Barbell Bench Press', nameBg: 'Вдигане от лег с щанга', sets: 4, reps: '8-10', kg: 60, rest: '90s', tier: 'compound' },
      { name: 'Incline DB Press', nameBg: 'Полулег с дъмбели', sets: 3, reps: '10-12', kg: 22, rest: '75s', tier: 'compound' },
      { name: 'Cable Chest Flyes', nameBg: 'Флайс на горен скрипец', sets: 3, reps: '12-15', kg: 15, rest: '60s', tier: 'isolation' },
      { name: 'Weighted Chest Dips', nameBg: 'Кофички с тежест', sets: 3, reps: '8-12', kg: 0, rest: '90s', tier: 'compound' },
      { name: 'Push-Ups (Diamond/Standard)', nameBg: 'Лицеви опори', sets: 3, reps: '15-20', kg: 0, rest: '45s', tier: 'bodyweight' }
    ],
    back: [
      { name: 'Conventional Deadlift', nameBg: 'Класическа мъртва тяга', sets: 4, reps: '5-8', kg: 100, rest: '120s', tier: 'compound' },
      { name: 'Wide Grip Pull-Ups', nameBg: 'Набирания широк хват', sets: 4, reps: '8-10', kg: 0, rest: '90s', tier: 'compound' },
      { name: 'Barbell Bent-Over Row', nameBg: 'Гребане с щанга', sets: 3, reps: '10-12', kg: 65, rest: '75s', tier: 'compound' },
      { name: 'Lat Pulldown', nameBg: 'Придърпване на скрипец', sets: 3, reps: '10-12', kg: 55, rest: '60s', tier: 'isolation' },
      { name: 'Seated Cable Row', nameBg: 'Гребане на долен скрипец', sets: 3, reps: '12-15', kg: 50, rest: '60s', tier: 'isolation' }
    ],
    legs: [
      { name: 'Barbell Back Squat', nameBg: 'Клек с щанга зад врат', sets: 4, reps: '8-10', kg: 85, rest: '120s', tier: 'compound' },
      { name: 'Leg Press 45°', nameBg: 'Лег преса 45 градуса', sets: 3, reps: '10-12', kg: 140, rest: '90s', tier: 'compound' },
      { name: 'Romanian Deadlift', nameBg: 'Румънска тяга с дъмбели', sets: 3, reps: '10-12', kg: 26, rest: '75s', tier: 'compound' },
      { name: 'Lying Leg Curls', nameBg: 'Бедрено сгъване от лег', sets: 3, reps: '12-15', kg: 40, rest: '60s', tier: 'isolation' },
      { name: 'Walking Lunges', nameBg: 'Напади с дъмбели', sets: 3, reps: '12 per leg', kg: 16, rest: '60s', tier: 'compound' }
    ],
    shoulders: [
      { name: 'Overhead Standing Press (OHP)', nameBg: 'Раменна преса с щанга', sets: 4, reps: '8-10', kg: 45, rest: '90s', tier: 'compound' },
      { name: 'DB Lateral Raises', nameBg: 'Разтваряне с дъмбели встрани', sets: 4, reps: '12-15', kg: 10, rest: '45s', tier: 'isolation' },
      { name: 'Cable Face Pulls', nameBg: 'Фейспул за задно рамо', sets: 3, reps: '15-20', kg: 22, rest: '45s', tier: 'isolation' },
      { name: 'DB Arnold Press', nameBg: 'Арнолд преса с дъмбели', sets: 3, reps: '10-12', kg: 18, rest: '60s', tier: 'compound' }
    ],
    arms: [
      { name: 'Barbell Bicep Curl', nameBg: 'Сгъване за бицепс с прав лост', sets: 3, reps: '10-12', kg: 30, rest: '60s', tier: 'isolation' },
      { name: 'Incline DB Hammer Curl', nameBg: 'Чуково сгъване на полулег', sets: 3, reps: '10-12', kg: 14, rest: '60s', tier: 'isolation' },
      { name: 'Overhead Tricep Rope Extension', nameBg: 'Френско на скрипец с въже', sets: 3, reps: '12-15', kg: 25, rest: '60s', tier: 'isolation' },
      { name: 'Close-Grip Bench Press', nameBg: 'Тесен лег за трицепс', sets: 3, reps: '8-10', kg: 55, rest: '75s', tier: 'compound' }
    ],
    core: [
      { name: 'Hanging Leg Raises', nameBg: 'Повдигане на крака от вис', sets: 3, reps: '15', kg: 0, rest: '45s', tier: 'core' },
      { name: 'Ab Wheel Rollouts', nameBg: 'Колело за коремни мускули', sets: 3, reps: '12', kg: 0, rest: '60s', tier: 'core' },
      { name: 'Weighted Cable Crunch', nameBg: 'Молитва на горен скрипец', sets: 3, reps: '15-20', kg: 35, rest: '45s', tier: 'core' }
    ]
  },

  // ── AI Generator Algorithm ──
  generateWorkoutPlan(options = {}) {
    const goal = options.goal || 'hypertrophy'; // hypertrophy, fatloss, strength, endurance
    const level = options.level || 'intermediate'; // beginner, intermediate, advanced
    const daysPerWeek = parseInt(options.days || 4);
    const equipment = options.equipment || 'full_gym'; // full_gym, dumbbells, bodyweight
    const isBg = getLang() === 'bg';

    let split = [];

    if (daysPerWeek === 3) {
      split = [
        { title: isBg ? 'Ден 1: Бутащи (Гърди, Рамо, Трицепс)' : 'Day 1: Push (Chest, Shoulders, Triceps)', muscle: 'workout_muscle_chest', icon: '🔥', exercises: [...this.exerciseKB.chest.slice(0, 3), ...this.exerciseKB.shoulders.slice(0, 2), ...this.exerciseKB.arms.slice(2, 4)] },
        { title: isBg ? 'Ден 2: Дърпащи (Гръб, Бицепс, Корем)' : 'Day 2: Pull (Back, Biceps, Core)', muscle: 'workout_muscle_back', icon: '⚡', exercises: [...this.exerciseKB.back.slice(0, 3), ...this.exerciseKB.arms.slice(0, 2), ...this.exerciseKB.core.slice(0, 2)] },
        { title: isBg ? 'Ден 3: Крака & Прасци' : 'Day 3: Legs & Lower Body', muscle: 'workout_muscle_legs', icon: '🦵', exercises: [...this.exerciseKB.legs, ...this.exerciseKB.core.slice(2, 3)] }
      ];
    } else if (daysPerWeek === 5) {
      split = [
        { title: isBg ? 'Понеделник: Гърди & Корем' : 'Monday: Chest & Core', muscle: 'workout_muscle_chest', icon: '🏋️', exercises: [...this.exerciseKB.chest, ...this.exerciseKB.core.slice(0, 1)] },
        { title: isBg ? 'Вторник: Гръб & Задно рамо' : 'Tuesday: Back & Rear Delts', muscle: 'workout_muscle_back', icon: '🔙', exercises: [...this.exerciseKB.back, ...this.exerciseKB.shoulders.slice(2, 3)] },
        { title: isBg ? 'Сряда: Крака (Квадрицепс Focus)' : 'Wednesday: Legs (Quad Focus)', muscle: 'workout_muscle_legs', icon: '🦵', exercises: [...this.exerciseKB.legs.slice(0, 4)] },
        { title: isBg ? 'Четвъртък: Рамене & Трапец' : 'Thursday: Shoulders & Traps', muscle: 'workout_muscle_shoulders', icon: '🏔️', exercises: [...this.exerciseKB.shoulders, ...this.exerciseKB.core.slice(1, 2)] },
        { title: isBg ? 'Петък: Ръце (Бицепс + Трицепс Super-Set)' : 'Friday: Arms (Biceps & Triceps Super-Set)', muscle: 'workout_muscle_arms', icon: '💪', exercises: [...this.exerciseKB.arms, ...this.exerciseKB.core.slice(0, 2)] }
      ];
    } else {
      // 4 Days (Upper / Lower standard split)
      split = [
        { title: isBg ? 'Ден 1: Горна част (Сила A)' : 'Day 1: Upper Body (Power A)', muscle: 'workout_muscle_chest', icon: '🏋️', exercises: [this.exerciseKB.chest[0], this.exerciseKB.back[1], this.exerciseKB.shoulders[0], this.exerciseKB.arms[0], this.exerciseKB.arms[2]] },
        { title: isBg ? 'Ден 2: Долна част & Корем' : 'Day 2: Lower Body & Abs', muscle: 'workout_muscle_legs', icon: '🦵', exercises: [...this.exerciseKB.legs.slice(0, 4), this.exerciseKB.core[0]] },
        { title: isBg ? 'Ден 3: Горна част (Хипертрофия B)' : 'Day 3: Upper Body (Hypertrophy B)', muscle: 'workout_muscle_back', icon: '💪', exercises: [this.exerciseKB.chest[1], this.exerciseKB.back[2], this.exerciseKB.shoulders[1], this.exerciseKB.chest[2], this.exerciseKB.arms[1]] },
        { title: isBg ? 'Ден 4: Долна част & Задно бедро' : 'Day 4: Lower Body (Posterior Chain)', muscle: 'workout_muscle_legs', icon: '🔥', exercises: [this.exerciseKB.legs[2], this.exerciseKB.legs[1], this.exerciseKB.legs[3], ...this.exerciseKB.core.slice(1, 3)] }
      ];
    }

    // Adjust reps and weights according to goals
    split.forEach(day => {
      day.exercises.forEach(ex => {
        if (goal === 'strength') {
          ex.sets = Math.min(ex.sets + 1, 5);
          ex.reps = ex.tier === 'compound' ? '5' : '8-10';
        } else if (goal === 'fatloss') {
          ex.reps = ex.tier === 'compound' ? '12' : '15-20';
          ex.rest = '45s';
        }
      });
    });

    return split;
  },

  // ── Scientific Macro Calculator (Mifflin-St Jeor formula) ──
  calculateNutrition(profile = {}) {
    const weight = parseFloat(profile.weight || 78);
    const height = parseFloat(profile.height || 180);
    const age = profile.birthday ? Math.max(18, new Date().getFullYear() - new Date(profile.birthday).getFullYear()) : 26;
    const isMale = (profile.gender || 'male').toLowerCase() !== 'female';
    const goal = profile.goal || 'maintain';

    // BMR (Mifflin-St Jeor)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (isMale ? 5 : -161);
    let tdee = Math.round(bmr * 1.45); // Moderate activity

    let targetCalories = tdee;
    if (goal.includes('loss') || goal.includes('toned') || goal.includes('отслабване')) {
      targetCalories = tdee - 450; // Caloric deficit
    } else if (goal.includes('bulk') || goal.includes('muscle') || goal.includes('маса')) {
      targetCalories = tdee + 350; // Lean surplus
    }

    const proteinG = Math.round(weight * 2.2); // 2.2g per kg
    const fatsG = Math.round((targetCalories * 0.25) / 9); // 25% of calories from fat
    const carbsG = Math.max(100, Math.round((targetCalories - (proteinG * 4) - (fatsG * 9)) / 4));

    return {
      tdee,
      calories: targetCalories,
      protein: proteinG,
      carbs: carbsG,
      fats: fatsG,
      waterLiters: (weight * 0.035).toFixed(1)
    };
  },

  // ── AI Conversational Knowledge Base ──
  askCoach(query) {
    const q = query.toLowerCase();
    const isBg = getLang() === 'bg';

    if (q.includes('protein') || q.includes('протеин')) {
      return isBg
        ? '💡 **Препоръка за протеин:** За оптимално мускулно възстановяване и растеж, целта ти е **1.8 - 2.2g протеин на кг телесно тегло**. Добри източници са пилешко месо, риба тон, яйца, извара и суроватъчен протеин.'
        : '💡 **Protein Target:** For optimal muscle hypertrophy and recovery, aim for **1.8 - 2.2g of protein per kg of body weight**. Best sources: chicken breast, salmon, eggs, greek yogurt, and whey isolate.';
    }

    if (q.includes('creatine') || q.includes('креатин')) {
      return isBg
        ? '💊 **Креатин монохидрат:** Най-изследваната и безопасна добавка. Приемай **5 грама дневно** по всяко време на деня с достатъчно вода (3-4 литра). Не е необходима зареждаща фаза.'
        : '💊 **Creatine Monohydrate:** The most researched fitness supplement. Take **5g daily** consistently with plenty of water (3-4L). No loading phase is required.';
    }

    if (q.includes('before workout') || q.includes('преди тренировка') || q.includes('pre workout')) {
      return isBg
        ? '⚡ **Преди тренировка:** 60-90 минути преди залата консумирай лесносмилаеми въглехидрати с умерен протеин (напр. овесени ядки с банан и лъжица протеин или оризовки с мед).'
        : '⚡ **Pre-Workout Fuel:** 60-90 minutes before lifting, consume easily digestible carbs with moderate protein (e.g. oatmeal with banana + whey protein or rice cakes with honey).';
    }

    if (q.includes('bench') || q.includes('лег') || q.includes('гърди')) {
      return isBg
        ? '🏋️ **Съвет за лежанка:** Прибери лопатките плътно към пейката (retraction), дръж краката забити в пода за лек leg drive и спускай лоста към долната част на гърдите с 45° ъгъл в лактите.'
        : '🏋️ **Bench Press Pro Tip:** Retract and depress your scapula into the bench, maintain leg drive with feet flat, and lower the bar to your lower sternum keeping elbows at a 45-degree angle.';
    }

    // Default intelligent response
    return isBg
      ? `🤖 **FitLife AI Coach:** Анализирах твоя профил и активност. За най-добри резултати следвай прогресивно натоварване (progressive overload), спи 7-8 часа и поддържай дневните си макроси!`
      : `🤖 **FitLife AI Coach:** Based on your current stats, consistency in progressive overload, 7-8 hours of quality sleep, and hitting your personalized daily macros will yield 90% of your results!`;
  }
};
