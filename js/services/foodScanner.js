// ========================================
// FitLife Bulgaria — AI Food Scanner Vision Engine
// ========================================

const FoodScannerService = {
  // ── Sample Dishes with accurate nutritional profiles for computer vision recognition ──
  dishesKB: [
    {
      id: 'chicken_rice_broccoli',
      nameEn: 'Grilled Chicken Breast with Jasmine Rice & Broccoli',
      nameBg: 'Пилешко филе на скара с жасминов ориз и броколи',
      icon: '🍗',
      calories: 520,
      protein: 48,
      carbs: 58,
      fats: 8,
      fiber: 6,
      score: 96,
      ingredients: [
        { name: 'Chicken Breast (200g)', protein: 42, carbs: 0, fats: 4, cal: 220 },
        { name: 'Jasmine Rice (150g cooked)', protein: 4, carbs: 45, fats: 1, cal: 210 },
        { name: 'Steamed Broccoli (120g)', protein: 2, carbs: 9, fats: 0.5, cal: 45 },
        { name: 'Extra Virgin Olive Oil (5ml)', protein: 0, carbs: 0, fats: 4.5, cal: 45 }
      ],
      aiFeedbackBg: '🌟 Изключително чист източник на постни протеини и комплексни въглехидрати. Перфектно за след тренировка!',
      aiFeedbackEn: '🌟 Outstanding lean protein source with clean complex carbs. Ideal post-workout recovery meal!'
    },
    {
      id: 'salmon_sweet_potato',
      nameEn: 'Baked Atlantic Salmon with Sweet Potato & Asparagus',
      nameBg: 'Печена сьомга със сладък картоф и аспержи',
      icon: '🐟',
      calories: 580,
      protein: 42,
      carbs: 46,
      fats: 22,
      fiber: 7,
      score: 98,
      ingredients: [
        { name: 'Atlantic Salmon Fillet (180g)', protein: 36, carbs: 0, fats: 19, cal: 320 },
        { name: 'Baked Sweet Potato (200g)', protein: 3, carbs: 41, fats: 0.5, cal: 180 },
        { name: 'Grilled Asparagus (100g)', protein: 3, carbs: 5, fats: 2.5, cal: 80 }
      ],
      aiFeedbackBg: '🧠 Богато на Омега-3 мастни киселини, антиоксиданти и калий. Подпомага сърдечно-съдовата система и ставите.',
      aiFeedbackEn: '🧠 Rich in EPA/DHA Omega-3s, antioxidants, and potassium. Promotes joint health and lean mass retention.'
    },
    {
      id: 'protein_oat_bowl',
      nameEn: 'Protein Oatmeal Bowl with Berries & Peanut Butter',
      nameBg: 'Протеинова овесена каша с горски плодове и фъстъчено масло',
      icon: '🥣',
      calories: 450,
      protein: 36,
      carbs: 52,
      fats: 11,
      fiber: 9,
      score: 94,
      ingredients: [
        { name: 'Rolled Oats (60g)', protein: 8, carbs: 40, fats: 4, cal: 230 },
        { name: 'Whey Protein Isolate (30g)', protein: 25, carbs: 1, fats: 0.5, cal: 110 },
        { name: 'Blueberries & Raspberries (80g)', protein: 1, carbs: 8, fats: 0.5, cal: 40 },
        { name: 'Natural Peanut Butter (15g)', protein: 4, carbs: 3, fats: 8, cal: 90 }
      ],
      aiFeedbackBg: '⚡ Бавно разграждащи се фибри и бърз суроватъчен протеин. Отличен старт за сутринта!',
      aiFeedbackEn: '⚡ Sustained slow-release energy with rapid amino acid uptake. High in antioxidants!'
    },
    {
      id: 'beef_steak_potatoes',
      nameEn: 'Tenderloin Beef Steak with Roasted Potatoes & Herb Butter',
      nameBg: 'Телешки стек бонфиле с печени картофки и билки',
      icon: '🥩',
      calories: 640,
      protein: 52,
      carbs: 42,
      fats: 28,
      fiber: 5,
      score: 92,
      ingredients: [
        { name: 'Beef Tenderloin (220g)', protein: 48, carbs: 0, fats: 18, cal: 360 },
        { name: 'Roasted Baby Potatoes (180g)', protein: 4, carbs: 38, fats: 3, cal: 200 },
        { name: 'Grass-fed Butter & Herbs (10g)', protein: 0, carbs: 0, fats: 8, cal: 80 }
      ],
      aiFeedbackBg: '💪 Високо съдържание на естествен креатин, желязо и цинк за повишаване на силата и тестостерона.',
      aiFeedbackEn: '💪 Loaded with natural creatine, bioavailable heme-iron, and zinc for power & strength gains.'
    },
    {
      id: 'greek_salad_eggs',
      nameEn: 'Mediterranean Salad with Boiled Eggs & Feta',
      nameBg: 'Средиземноморска салата с варени яйца и сирене',
      icon: '🥗',
      calories: 340,
      protein: 22,
      carbs: 12,
      fats: 24,
      fiber: 4,
      score: 90,
      ingredients: [
        { name: 'Free-range Boiled Eggs (2 whole)', protein: 13, carbs: 1, fats: 10, cal: 140 },
        { name: 'Bulgarian White Cheese / Feta (50g)', protein: 8, carbs: 1, fats: 11, cal: 130 },
        { name: 'Cucumbers, Tomatoes, Olives', protein: 1, carbs: 10, fats: 3, cal: 70 }
      ],
      aiFeedbackBg: '🥑 Нисковъглехидратно и богато на холин и микроелементи. Отлично за междинно хранене или вечеря.',
      aiFeedbackEn: '🥑 Low-carb and high in choline, carotenoids, and quality dietary fats.'
    }
  ],

  // ── AI Vision Analysis Simulation ──
  async analyzeFoodImage(imageSrc) {
    // Pick matched or random dish based on image / seed
    return new Promise((resolve) => {
      setTimeout(() => {
        // Random selection or hash-based
        const index = Math.floor(Math.random() * this.dishesKB.length);
        const dish = this.dishesKB[index];
        resolve({
          success: true,
          dish: dish,
          image: imageSrc,
          confidence: (94 + Math.random() * 5).toFixed(1)
        });
      }, 1200);
    });
  },

  // ── Save scanned meal directly to user logs & Supabase ──
  async logScannedMeal(dish, mealType = 'lunch') {
    const isBg = getLang() === 'bg';
    const mealRecord = {
      type: 'nutrition_' + mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: dish.icon || '🍽️',
      name: isBg ? dish.nameBg : dish.nameEn,
      protein: dish.protein,
      carbs: dish.carbs,
      fats: dish.fats,
      cal: dish.calories
    };

    // Save to localStorage meals
    const existing = dbLoad('daily_meals', []);
    existing.unshift(mealRecord);
    dbSave('daily_meals', existing);

    // Save to Supabase if connected
    const user = getCurrentUser();
    if (user && isSupabaseConnected()) {
      await supabaseClient.from('meal_logs').insert({
        user_id: user.id,
        meal_type: mealType,
        name: mealRecord.name,
        calories: mealRecord.cal,
        protein_g: mealRecord.protein,
        carbs_g: mealRecord.carbs,
        fats_g: mealRecord.fats,
        icon: mealRecord.icon
      });
    }

    return mealRecord;
  }
};
