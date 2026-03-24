import { create } from 'zustand';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeStep {
  order: number;
  text: string;
  timer_seconds?: number;
}

export interface Recipe {
  id: string;
  cookbook_id: string;
  title: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  base_serves: number;
  tags: string[];
  duration_mins: number;
}

export interface Cookbook {
  id: string;
  title: string;
  accent_color: string;
  recipe_count: number;
  created_at: string;
}

const ACCENT_PALETTE = ['#6B3A2A', '#2C4A3E', '#3D3228', '#1B3A4B', '#4A3728'];

const MOCK_COOKBOOKS: Cookbook[] = [
  {
    id: 'cb1',
    title: 'Italian Classics',
    accent_color: '#6B3A2A',
    recipe_count: 2,
    created_at: '2026-03-01',
  },
  {
    id: 'cb2',
    title: 'Quick Weeknight Dinners',
    accent_color: '#2C4A3E',
    recipe_count: 2,
    created_at: '2026-03-10',
  },
];

const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1',
    cookbook_id: 'cb1',
    title: 'Spaghetti Carbonara',
    ingredients: [
      { name: 'spaghetti', amount: 400, unit: 'g' },
      { name: 'pancetta or guanciale', amount: 200, unit: 'g' },
      { name: 'eggs', amount: 4, unit: '' },
      { name: 'pecorino romano, grated', amount: 100, unit: 'g' },
      { name: 'cracked black pepper', amount: 2, unit: 'tsp' },
      { name: 'sea salt', amount: 1, unit: 'tbsp' },
    ],
    steps: [
      { order: 1, text: 'Bring a large pot of heavily salted water to a rolling boil.' },
      {
        order: 2,
        text: 'Cook the pancetta in a wide skillet over medium heat until crispy and the fat has rendered, about 8 minutes.',
        timer_seconds: 480,
      },
      {
        order: 3,
        text: 'Cook spaghetti in the boiling water until al dente (1 minute less than the package says).',
        timer_seconds: 540,
      },
      {
        order: 4,
        text: 'Whisk together eggs, grated pecorino, and a generous amount of cracked black pepper in a bowl until smooth.',
      },
      { order: 5, text: 'Reserve 1 cup of pasta cooking water. Drain the spaghetti.' },
      {
        order: 6,
        text: 'Remove pan from heat. Add hot pasta to the pancetta. Pour the egg mixture over and toss vigorously, adding pasta water a splash at a time — the sauce should be glossy and creamy, not scrambled. Serve immediately.',
      },
    ],
    base_serves: 4,
    tags: ['pasta', 'italian', 'classic'],
    duration_mins: 30,
  },
  {
    id: 'r2',
    cookbook_id: 'cb1',
    title: 'Risotto ai Funghi',
    ingredients: [
      { name: 'arborio rice', amount: 320, unit: 'g' },
      { name: 'mixed mushrooms', amount: 300, unit: 'g' },
      { name: 'warm vegetable stock', amount: 1200, unit: 'ml' },
      { name: 'dry white wine', amount: 150, unit: 'ml' },
      { name: 'shallots, finely diced', amount: 2, unit: '' },
      { name: 'unsalted butter', amount: 60, unit: 'g' },
      { name: 'parmesan, grated', amount: 80, unit: 'g' },
      { name: 'olive oil', amount: 2, unit: 'tbsp' },
    ],
    steps: [
      { order: 1, text: 'Heat stock in a saucepan over low heat. Keep it barely simmering throughout.' },
      {
        order: 2,
        text: 'In a wide, heavy-bottomed pan, sauté shallots in half the butter and all the oil over medium heat until soft and translucent, about 4 minutes.',
        timer_seconds: 240,
      },
      {
        order: 3,
        text: 'Add mushrooms. Cook, stirring occasionally, until golden and fragrant, about 5 minutes.',
        timer_seconds: 300,
      },
      {
        order: 4,
        text: 'Add arborio rice. Stir to coat every grain in the fat. Toast for 2 minutes — edges should turn translucent.',
        timer_seconds: 120,
      },
      { order: 5, text: 'Pour in the white wine. Stir until fully absorbed.' },
      {
        order: 6,
        text: 'Add warm stock one ladle at a time, stirring after each addition and waiting until absorbed before adding the next. Continue for 18 minutes until rice is creamy and just tender.',
        timer_seconds: 1080,
      },
      {
        order: 7,
        text: 'Remove from heat. Beat in remaining butter and all parmesan vigorously — this is the mantecatura. Season generously, rest 2 minutes, and serve.',
      },
    ],
    base_serves: 4,
    tags: ['risotto', 'italian', 'vegetarian'],
    duration_mins: 40,
  },
  {
    id: 'r3',
    cookbook_id: 'cb2',
    title: 'Garlic Butter Chicken',
    ingredients: [
      { name: 'chicken breasts', amount: 4, unit: '' },
      { name: 'unsalted butter', amount: 4, unit: 'tbsp' },
      { name: 'garlic cloves, minced', amount: 5, unit: '' },
      { name: 'fresh thyme sprigs', amount: 4, unit: '' },
      { name: 'lemon', amount: 1, unit: '' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'black pepper', amount: 0.5, unit: 'tsp' },
    ],
    steps: [
      { order: 1, text: 'Pat chicken breasts completely dry with paper towels. Season generously with salt and pepper on both sides.' },
      {
        order: 2,
        text: 'Heat a heavy skillet over medium-high heat until very hot. Sear chicken for 5–6 minutes per side until deeply golden. Do not move it.',
        timer_seconds: 360,
      },
      { order: 3, text: 'Reduce heat to medium. Push chicken to one side. Add butter, garlic, and thyme to the pan.' },
      {
        order: 4,
        text: 'As the butter melts and foams, tilt the pan and baste the chicken repeatedly with a spoon for 3 minutes until cooked through (internal temp 74°C / 165°F).',
        timer_seconds: 180,
      },
      {
        order: 5,
        text: 'Transfer to a board. Squeeze lemon into the pan juices and stir. Rest the chicken for 5 minutes before slicing. Serve with the pan sauce.',
        timer_seconds: 300,
      },
    ],
    base_serves: 4,
    tags: ['chicken', 'quick', 'weeknight'],
    duration_mins: 25,
  },
  {
    id: 'r4',
    cookbook_id: 'cb2',
    title: 'Roasted Tomato Soup',
    ingredients: [
      { name: 'ripe tomatoes, halved', amount: 1000, unit: 'g' },
      { name: 'red onion, quartered', amount: 1, unit: '' },
      { name: 'garlic cloves, unpeeled', amount: 6, unit: '' },
      { name: 'olive oil', amount: 4, unit: 'tbsp' },
      { name: 'vegetable stock', amount: 500, unit: 'ml' },
      { name: 'fresh basil leaves', amount: 20, unit: '' },
      { name: 'salt and pepper', amount: 1, unit: 'to taste' },
    ],
    steps: [
      { order: 1, text: 'Preheat oven to 200°C / 400°F.' },
      {
        order: 2,
        text: 'Arrange tomatoes cut-side up, onion, and garlic on a large baking tray. Drizzle generously with olive oil and season well. Roast for 35 minutes until caramelised at the edges.',
        timer_seconds: 2100,
      },
      {
        order: 3,
        text: 'Squeeze the garlic from their skins into a blender. Add all the roasted vegetables and every drop of tray juices.',
      },
      {
        order: 4,
        text: 'Add stock and basil leaves. Blend until completely smooth. Adjust consistency with more stock if needed.',
      },
      { order: 5, text: 'Taste and adjust seasoning. Reheat gently over medium heat. Serve with crusty bread and a drizzle of olive oil.' },
    ],
    base_serves: 4,
    tags: ['soup', 'vegetarian', 'weeknight'],
    duration_mins: 45,
  },
];

interface RecipeState {
  cookbooks: Cookbook[];
  recipes: Recipe[];
  getCookbook: (id: string) => Cookbook | undefined;
  getRecipesByCookbook: (cookbookId: string) => Recipe[];
  getRecipe: (id: string) => Recipe | undefined;
  addCookbook: (title: string, newRecipes?: Recipe[]) => Cookbook;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  cookbooks: MOCK_COOKBOOKS,
  recipes: MOCK_RECIPES,

  getCookbook: (id) => get().cookbooks.find((c) => c.id === id),

  getRecipesByCookbook: (cookbookId) =>
    get().recipes.filter((r) => r.cookbook_id === cookbookId),

  getRecipe: (id) => get().recipes.find((r) => r.id === id),

  addCookbook: (title, newRecipes = []) => {
    const id = `cb_${Date.now()}`;
    const cookbook: Cookbook = {
      id,
      title,
      accent_color: ACCENT_PALETTE[get().cookbooks.length % ACCENT_PALETTE.length],
      recipe_count: newRecipes.length,
      created_at: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      cookbooks: [...state.cookbooks, cookbook],
      recipes: [...state.recipes, ...newRecipes],
    }));
    return cookbook;
  },
}));
