// ========================================
// FitLife Bulgaria — Analytics & Progress Engine
// ========================================

const AnalyticsService = {
  // ── 30-Day Body Weight Sample Logs ──
  getDefaultWeightData() {
    return [
      { date: 'Day 1', weight: 81.5 },
      { date: 'Day 5', weight: 81.0 },
      { date: 'Day 10', weight: 80.4 },
      { date: 'Day 15', weight: 79.8 },
      { date: 'Day 20', weight: 79.1 },
      { date: 'Day 25', weight: 78.5 },
      { date: 'Day 30', weight: 77.8 }
    ];
  },

  // ── Strength Progression Logs (Big 3 Lifts) ──
  getDefaultStrengthData() {
    return {
      bench: [
        { label: 'Week 1', weight: 75 },
        { label: 'Week 2', weight: 77.5 },
        { label: 'Week 3', weight: 80 },
        { label: 'Week 4', weight: 82.5 },
        { label: 'Week 5', weight: 85 },
        { label: 'Week 6', weight: 90 }
      ],
      squat: [
        { label: 'Week 1', weight: 95 },
        { label: 'Week 2', weight: 100 },
        { label: 'Week 3', weight: 105 },
        { label: 'Week 4', weight: 110 },
        { label: 'Week 5', weight: 115 },
        { label: 'Week 6', weight: 120 }
      ],
      deadlift: [
        { label: 'Week 1', weight: 120 },
        { label: 'Week 2', weight: 125 },
        { label: 'Week 3', weight: 132.5 },
        { label: 'Week 4', weight: 137.5 },
        { label: 'Week 5', weight: 145 },
        { label: 'Week 6', weight: 150 }
      ]
    };
  },

  // ── 7-Day Calorie Intake vs Burned Energy ──
  getDefaultCalorieBalanceData() {
    return [
      { day: 'Mon', intake: 2350, burned: 2650 },
      { day: 'Tue', intake: 2420, burned: 2780 },
      { day: 'Wed', intake: 2200, burned: 2450 },
      { day: 'Thu', intake: 2500, burned: 2890 },
      { day: 'Fri', intake: 2380, burned: 2600 },
      { day: 'Sat', intake: 2650, burned: 3100 },
      { day: 'Sun', intake: 2150, burned: 2300 }
    ];
  },

  getWeightLogs() {
    return dbLoad('user_weight_logs', this.getDefaultWeightData());
  },

  logWeight(newWeight) {
    const logs = this.getWeightLogs();
    const now = new Date();
    const dateStr = `Day ${logs.length + 1}`;
    logs.push({ date: dateStr, weight: parseFloat(newWeight) });
    dbSave('user_weight_logs', logs);

    // Save to Supabase if connected
    const user = getCurrentUser();
    if (user && isSupabaseConnected()) {
      supabaseClient.from('progress_logs').insert({
        user_id: user.id,
        metric_type: 'weight',
        value: parseFloat(newWeight),
        unit: 'kg'
      }).then(() => {});
    }

    return logs;
  },

  // ── High-Performance Glowing SVG Chart Generators ──

  // 1. Neon Line Chart (Weight Progression)
  renderWeightSVG(data, width = 340, height = 160) {
    if (!data || data.length === 0) return '';
    const weights = data.map(d => d.weight);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const paddingX = 35;
    const paddingY = 25;
    const chartW = width - (paddingX * 2);
    const chartH = height - (paddingY * 2);

    const points = data.map((d, i) => {
      const x = paddingX + (i / (data.length - 1)) * chartW;
      const y = paddingY + chartH - ((d.weight - minW) / (maxW - minW)) * chartH;
      return { x, y, val: d.weight, label: d.date };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    // Area fill under curve
    const areaD = `${pathD} L ${points[points.length-1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00D2FF" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#00D2FF" stop-opacity="0.0"/>
          </linearGradient>
          <filter id="neonWeightGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Grid Lines -->
        <line x1="${paddingX}" y1="${paddingY}" x2="${width - paddingX}" y2="${paddingY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <line x1="${paddingX}" y1="${paddingY + chartH/2}" x2="${width - paddingX}" y2="${paddingY + chartH/2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="rgba(255,255,255,0.1)" />

        <!-- Area Fill -->
        <path d="${areaD}" fill="url(#weightGrad)" />

        <!-- Neon Line Path -->
        <path d="${pathD}" fill="none" stroke="#00D2FF" stroke-width="3" filter="url(#neonWeightGlow)" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Data Point Dots & Labels -->
        ${points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#fff" stroke="#00D2FF" stroke-width="2.5" />
          <text x="${p.x}" y="${p.y - 8}" fill="#00D2FF" font-size="10" font-weight="bold" text-anchor="middle">${p.val}</text>
          <text x="${p.x}" y="${height - 8}" fill="rgba(255,255,255,0.4)" font-size="9" text-anchor="middle">${p.label}</text>
        `).join('')}
      </svg>
    `;
  },

  // 2. Multi-Line Neon Strength Chart (Bench, Squat, Deadlift)
  renderStrengthSVG(strengthData, activeLift = 'all', width = 340, height = 170) {
    const paddingX = 35;
    const paddingY = 25;
    const chartW = width - (paddingX * 2);
    const chartH = height - (paddingY * 2);

    const minW = 60;
    const maxW = 160;

    const renderLine = (data, color, filterId) => {
      const pts = data.map((d, i) => {
        const x = paddingX + (i / (data.length - 1)) * chartW;
        const y = paddingY + chartH - ((d.weight - minW) / (maxW - minW)) * chartH;
        return { x, y, val: d.weight, label: d.label };
      });
      const pathD = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
      return { pts, pathD, color };
    };

    const lines = [];
    if (activeLift === 'all' || activeLift === 'bench') lines.push(renderLine(strengthData.bench, '#00D2FF', 'glowB'));
    if (activeLift === 'all' || activeLift === 'squat') lines.push(renderLine(strengthData.squat, '#FFD700', 'glowS'));
    if (activeLift === 'all' || activeLift === 'deadlift') lines.push(renderLine(strengthData.deadlift, '#FF4B2B', 'glowD'));

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
        <defs>
          <filter id="strengthGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- Grid Lines -->
        <line x1="${paddingX}" y1="${paddingY}" x2="${width - paddingX}" y2="${paddingY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <line x1="${paddingX}" y1="${paddingY + chartH/2}" x2="${width - paddingX}" y2="${paddingY + chartH/2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="rgba(255,255,255,0.1)" />

        <!-- Render each lift line -->
        ${lines.map(l => `
          <path d="${l.pathD}" fill="none" stroke="${l.color}" stroke-width="3" filter="url(#strengthGlow)" stroke-linecap="round" stroke-linejoin="round" />
          ${l.pts.map(p => `
            <circle cx="${p.x}" cy="${p.y}" r="4" fill="#fff" stroke="${l.color}" stroke-width="2" />
            <text x="${p.x}" y="${p.y - 7}" fill="${l.color}" font-size="9" font-weight="bold" text-anchor="middle">${p.val}kg</text>
          `).join('')}
        `).join('')}

        <!-- X-Axis Labels -->
        ${strengthData.bench.map((d, i) => {
          const x = paddingX + (i / (strengthData.bench.length - 1)) * chartW;
          return `<text x="${x}" y="${height - 8}" fill="rgba(255,255,255,0.4)" font-size="8.5" text-anchor="middle">${d.label}</text>`;
        }).join('')}
      </svg>
    `;
  },

  // 3. Side-by-Side Neon Calorie Balance Bar Chart
  renderCalorieBalanceSVG(data, width = 340, height = 160) {
    const paddingX = 30;
    const paddingY = 20;
    const chartW = width - (paddingX * 2);
    const chartH = height - (paddingY * 2);
    const maxCal = 3500;
    const groupW = chartW / data.length;
    const barW = groupW * 0.32;

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
        <defs>
          <linearGradient id="intakeBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF7675"/>
            <stop offset="100%" stop-color="#D63031"/>
          </linearGradient>
          <linearGradient id="burnedBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#55EFC4"/>
            <stop offset="100%" stop-color="#00B894"/>
          </linearGradient>
        </defs>

        <!-- Zero / Base Line -->
        <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="rgba(255,255,255,0.15)" />

        <!-- Bars -->
        ${data.map((d, i) => {
          const groupX = paddingX + (i * groupW);
          const intakeH = (d.intake / maxCal) * chartH;
          const burnedH = (d.burned / maxCal) * chartH;

          const intakeY = (height - paddingY) - intakeH;
          const burnedY = (height - paddingY) - burnedH;

          return `
            <!-- Intake Bar -->
            <rect x="${groupX + 4}" y="${intakeY}" width="${barW}" height="${intakeH}" rx="3" fill="url(#intakeBarGrad)" />
            <!-- Burned Bar -->
            <rect x="${groupX + barW + 7}" y="${burnedY}" width="${barW}" height="${burnedH}" rx="3" fill="url(#burnedBarGrad)" />
            <!-- Day Label -->
            <text x="${groupX + groupW/2}" y="${height - 6}" fill="rgba(255,255,255,0.5)" font-size="9" text-anchor="middle">${d.day}</text>
          `;
        }).join('')}
      </svg>
    `;
  }
};
