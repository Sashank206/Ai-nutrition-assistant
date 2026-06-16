# AI Nutrition Assistant: Premium Dashboard UI Design Specification
*Document Version: 1.0.0 | Role: Senior Product Designer*

This document provides the high-fidelity UI layout, component hierarchy, Tailwind CSS recommendations, and mobile responsiveness specifications for the premium dark-themed Dashboard of the **AI Nutrition Assistant**.

---

## 1. Grid & Layout Structure

The dashboard layout utilizes a responsive **12-column grid system** on desktop. Below is the visual spacing model:

```
+---------------------------------------------------------------------------------------------------------+
|                                              GLOBAL HEADER                                              |
+------------------------------------+--------------------------------------------------------------------+
|                                    |  WELCOME BANNER & TOP METRICS (Cols 12)                            |
|                                    |  [Welcome Msg] | [Daily Calorie Goal] | [Remaining Calories]       |
|                                    +--------------------------------------------------------------------+
|                                    |  ANALYTICS GRID (Cols 12 - reflows as 5 cards)                    |
|                                    |  [Calories] | [Protein] | [Carbs] | [Fats] | [BMI]                  |
|                                    +--------------------------------------------------------------------+
|            SIDEBAR NAV             |  CHARTS SECTION                                                    |
|             (Cols 2)               |  [Daily Calories Area - Cols 5] | [Weekly Nutrition Bar - Cols 4] |
|                                    |  [Goal Completion Ring - Cols 3]                                   |
|                                    +--------------------------------------------------------------------+
|                                    |  FEED & MEAL RECOMMENDATION SPLIT                                  |
|                                    |  [Recent Meals Feed - Cols 7]     | [Diet Recommendations - Cols 5] |
|                                    |  - Includes "Add Meal Button"     |                                |
+------------------------------------+--------------------------------------------------------------------+
|                                                                                    [FLOATING AI BUTTON] |
+---------------------------------------------------------------------------------------------------------+
```

### Grid Grid Allocation (Desktop):
* **Workspace Sidebar**: `col-span-2` (collapsible, fixed height `100vh`, sticky).
* **Main Dashboard Window**: `col-span-10` (scrollable, padding `p-8`).
* **Top Banner Section**: Spans `col-span-12`.
* **Analytics Cards Row**: Flexbox wrapped or `grid-cols-5`.
* **Charts Section**: Spans `col-span-12` split as:
  * Daily Calorie Trend: `col-span-5`
  * Weekly Nutrition Trend: `col-span-4`
  * Goal Completion Ring: `col-span-3`
* **Meal & Diet Section**: Spans `col-span-12` split as:
  * Recent Meals Feed: `col-span-7`
  * Diet Recommendations: `col-span-5`
* **AI Section**: Positioned absolute/fixed in the viewport's bottom-right corner (`bottom-6 right-6`).

---

## 2. Component Hierarchy

```
[DashboardContainer]
 ├── [Header]
 │    ├── [Branding]
 │    └── [ProfileWidget]
 ├── [WelcomeBannerCard]
 │    ├── [UserGreeting]
 │    ├── [DailyCalorieGoalDisplay]
 │    └── [RemainingCalorieDisplay] (Value + Circular Ring Indicator)
 ├── [AnalyticsGrid]
 │    ├── [MetricCard: Calories] (Total eaten vs progress bar)
 │    ├── [MetricCard: Protein] (Pill macro tracker)
 │    ├── [MetricCard: Carbs] (Pill macro tracker)
 │    ├── [MetricCard: Fats] (Pill macro tracker)
 │    └── [MetricCard: BMI] (Index reading + weight class label)
 ├── [ChartsGrid]
 │    ├── [DailyCaloriesTrendCard] (SVG Smooth Area Chart)
 │    ├── [WeeklyNutritionTrendCard] (Stacked Bar Chart showing Protein/Carb/Fat split)
 │    └── [GoalCompletionRingCard] (Radial Progress gauge with weekly average consistency)
 ├── [MealRecommendationSplit]
 │    ├── [RecentMealsSection]
 │    │    ├── [SectionHeader]
 │    │    ├── [RecentMealsList]
 │    │    │    └── [MealCardItem] (Image, timestamps, macro labels)
 │    │    └── [AddMealButtonCTA] (Triggers bottom-sheet modal or navigation link)
 │    └── [DietRecommendationsSection]
 │         ├── [SectionHeader]
 │         └── [RecommendedRecipeCard] (Caloric count, ingredients summary, regenerate toggle)
 └── [FloatingAIAssistant]
      ├── [AssistantTriggerBubble] (Pulsing glowing button with AI face icon)
      └── [AssistantChatWidget] (Collapsible chat window overlay)
```

---

## 3. Tailwind CSS Design Recommendations

To deliver a visual experience that feels premium, modern, and clean, apply these Tailwind classes and custom configurations:

### Premium Theme Constants (Extend in `theme` / Config)
```css
/* Tailwind v4 CSS Custom Properties */
@theme {
  --color-obsidian: #090A0F;
  --color-surface-slate: #12141C;
  --color-border-slate: #1F2433;
  --color-bio-green: #10B981;
  --color-electric-teal: #06B6D4;
  --color-amber-glow: #F59E0B;
}
```

### Component Styling Classes

1. **Dashboard Wrapper Background**:
   * Style: Pitch Obsidian dark with a subtle top-right radial gradient glow.
   * Tailwind: `min-h-screen bg-[#090A0F] text-[#F3F4F6] relative overflow-hidden bg-radial-[at_top_right] from-emerald-500/5 via-transparent to-transparent`

2. **Glassmorphism Cards**:
   * Style: Dark slate surface container with a fine border, high blur factor, and spring hover scaling.
   * Tailwind: `bg-[#12141C]/80 backdrop-blur-xl border border-[#1F2433] rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/20`

3. **Pulsing AI Floating Bubble**:
   * Style: Floating teal circle button with gradient ring glows.
   * Tailwind: `fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-tr from-cyan-500 to-teal-400 text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all active:scale-95 cursor-pointer animate-bounce`

4. **Circular Target Meters (SVG Gauge)**:
   * Style: Dash-array animation mapping remaining values.
   * Tailwind circle: `stroke-current text-emerald-400 transition-all duration-500 ease-out`
   * Tailwind track: `stroke-current text-[#1F2433]`

5. **Gradient Call-to-Action Buttons**:
   * Style: Bio-Green to Electric Teal pill buttons.
   * Tailwind: `bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 active:scale-97 cursor-pointer`

---

## 4. Mobile Responsive Reflow (Viewport Adaptations)

A SaaS dashboard must be accessible across smartphones and desktop monitors. Here are the responsive viewport configurations:

### Mobile Viewport Reflow Grid (`< 640px`):
* **Navigation Menu**: Desktop sidebar collapses completely (`hidden`). Navigation moves to a **sticky floating bottom nav** (`fixed bottom-0 left-0 right-0 z-40 bg-[#12141C]/90 backdrop-blur-lg border-t border-[#1F2433] flex justify-around py-2`) containing 5 key action tabs with a centered, slightly larger "Add Meal" button.
* **Welcome Banner & Top Metrics**: Adapts to a vertical flex container. The circular Remaining Calories gauge is stacked below the Welcome Greeting.
* **Analytics Grid**: Reflows from `grid-cols-5` into a `grid-cols-2` layout (where Calories, Protein, Carbs, and Fats form 4 grid items, and the BMI card spans `col-span-2` at the bottom).
* **Charts Section**: Converts to single-column stacking:
  1. Daily Calories Trend Area Chart
  2. Weekly Nutrition Stacked Bar Chart
  3. Goal Completion gauge
* **Meal & Diet Split**: Switches from side-by-side Columns into a top-to-bottom layout. The Recent Meals Feed is shown first, followed by Today's Recommendations.
* **Tap Targets**: All buttons, cards, and input slots scale to a minimum clickable area of `48px x 48px` to support simple thumb interactions on screens.
