/**
 * Generate test cookbook PDFs for SpiceChef app testing.
 * All recipes are original — free to use, no copyright issues.
 */
const PDFDocument = require('pdfkit');
const fs = require('fs');

function createCookbook(filename, title, subtitle, author, recipes) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filename));

  // Title page
  doc.moveDown(6);
  doc.fontSize(32).font('Helvetica-Bold').text(title, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(14).font('Helvetica-Oblique').text(`by ${author}`, { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(12).font('Helvetica').text(subtitle, { align: 'center' });

  for (const recipe of recipes) {
    doc.addPage();

    // Recipe title
    doc.fontSize(24).font('Helvetica-Bold').text(recipe.title);
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica').text(recipe.description);
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica').text(recipe.meta);
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica').text(`Tags: ${recipe.tags}`);
    doc.moveDown(1);

    // Ingredients
    doc.fontSize(14).font('Helvetica-Bold').text('Ingredients');
    doc.moveDown(0.3);
    for (const ing of recipe.ingredients) {
      doc.fontSize(11).font('Helvetica').text(`  \u2022 ${ing}`);
    }
    doc.moveDown(1);

    // Instructions
    doc.fontSize(14).font('Helvetica-Bold').text('Instructions');
    doc.moveDown(0.3);
    for (const step of recipe.steps) {
      doc.fontSize(11).font('Helvetica').text(step, { lineGap: 3 });
      doc.moveDown(0.4);
    }
  }

  doc.end();
  console.log(`Created: ${filename} (${recipes.length} recipes)`);
}

// ── Cookbook 1: Simple Indian Kitchen ──
createCookbook(
  'simple_indian_kitchen.pdf',
  'Simple Indian Kitchen',
  'A collection of classic Indian recipes for home cooks',
  'SpiceChef Test Kitchen',
  [
    {
      title: 'Chana Masala',
      description: 'A hearty chickpea curry that\'s a staple across North India. Tangy, spiced, and deeply satisfying.',
      meta: 'Serves: 4 | Prep: 10 min | Cook: 25 min | Total: 35 min',
      tags: 'Vegetarian, Vegan, Gluten-Free, Indian, Chickpeas',
      ingredients: [
        '2 cans (400g each) chickpeas, drained and rinsed',
        '1 large onion, finely diced',
        '3 cloves garlic, minced',
        '1 inch fresh ginger, grated',
        '2 medium tomatoes, chopped',
        '2 tbsp vegetable oil',
        '1 tsp cumin seeds',
        '1 tsp ground coriander',
        '1 tsp garam masala',
        '1/2 tsp turmeric',
        '1/2 tsp red chilli powder',
        '1 tsp amchur (dry mango powder)',
        'Salt to taste',
        'Fresh coriander leaves for garnish',
      ],
      steps: [
        '1. Heat oil in a heavy-bottomed pan over medium heat. Add cumin seeds and let them splutter for 30 seconds.',
        '2. Add the diced onion and cook for 8 minutes until golden brown, stirring occasionally.',
        '3. Add garlic and ginger, cook for 2 minutes until fragrant.',
        '4. Add the ground coriander, turmeric, and chilli powder. Stir for 1 minute.',
        '5. Add the chopped tomatoes and cook for 5 minutes until they break down into a paste.',
        '6. Add the drained chickpeas and 1/2 cup water. Stir well to coat. Bring to a simmer.',
        '7. Cover and cook for 15 minutes on medium-low heat, stirring occasionally. Mash a few chickpeas against the side of the pan for a thicker sauce.',
        '8. Stir in garam masala and amchur powder. Season with salt. Garnish with fresh coriander and serve with rice or naan.',
      ],
    },
    {
      title: 'Tadka Dal',
      description: 'Comforting yellow lentils finished with a sizzling spice tempering. The ultimate comfort food.',
      meta: 'Serves: 4 | Prep: 5 min | Cook: 30 min | Total: 35 min',
      tags: 'Vegetarian, Vegan, Gluten-Free, Indian, Lentils, Comfort Food',
      ingredients: [
        '1 cup yellow lentils (toor dal), rinsed',
        '3 cups water',
        '1/2 tsp turmeric',
        'Salt to taste',
        '2 tbsp ghee or vegetable oil',
        '1 tsp cumin seeds',
        '1 tsp mustard seeds',
        '2 dried red chillies',
        '8-10 curry leaves',
        '3 cloves garlic, thinly sliced',
        '1 medium onion, thinly sliced',
        '2 medium tomatoes, chopped',
        '1/2 tsp red chilli powder',
        'Fresh coriander for garnish',
      ],
      steps: [
        '1. Wash the lentils in several changes of water until the water runs clear. Add to a pot with 3 cups water and turmeric.',
        '2. Bring to a boil, then reduce heat to low. Skim any foam that rises. Cook for 25 minutes until lentils are completely soft.',
        '3. Whisk the cooked lentils until smooth. Add salt and adjust consistency with water if needed.',
        '4. For the tadka: Heat ghee in a small pan over high heat. Add cumin seeds and mustard seeds. When they start to pop (about 30 seconds), add dried chillies and curry leaves.',
        '5. Add sliced garlic and cook for 1 minute until golden. Add sliced onion and cook for 5 minutes.',
        '6. Add chopped tomatoes and chilli powder. Cook for 3 minutes until tomatoes soften.',
        '7. Pour the sizzling tadka over the cooked dal. Stir gently. Garnish with fresh coriander. Serve hot with steamed rice.',
      ],
    },
    {
      title: 'Jeera Rice',
      description: 'Fragrant cumin-tempered basmati rice. The perfect side dish for any curry.',
      meta: 'Serves: 4 | Prep: 5 min | Cook: 20 min | Total: 25 min',
      tags: 'Vegetarian, Vegan, Gluten-Free, Indian, Rice, Quick, Side Dish',
      ingredients: [
        '1.5 cups basmati rice',
        '2.5 cups water',
        '2 tbsp ghee or butter',
        '1.5 tsp cumin seeds',
        '4 whole cloves',
        '2 green cardamom pods, lightly crushed',
        '1 bay leaf',
        '1/2 tsp salt',
        'Fresh coriander for garnish (optional)',
      ],
      steps: [
        '1. Rinse the basmati rice in cold water 3-4 times until the water runs clear. Soak in water for 20 minutes, then drain.',
        '2. Heat ghee in a heavy-bottomed pot over medium heat. Add cumin seeds, cloves, cardamom pods, and bay leaf. Fry for 1 minute until the cumin is fragrant.',
        '3. Add the drained rice and gently stir for 2 minutes, coating each grain with the spiced ghee.',
        '4. Add water and salt. Bring to a boil, then immediately reduce to the lowest heat. Cover tightly and cook for 15 minutes. Do not open the lid.',
        '5. Turn off heat and let the rice rest, covered, for 5 minutes. Fluff gently with a fork. Remove the bay leaf, cloves, and cardamom. Garnish with fresh coriander.',
      ],
    },
    {
      title: 'Masala Chai',
      description: 'Spiced milk tea brewed the traditional way. Warming, aromatic, and perfectly balanced.',
      meta: 'Serves: 2 | Prep: 2 min | Cook: 8 min | Total: 10 min',
      tags: 'Vegetarian, Indian, Drink, Quick, Spiced Tea',
      ingredients: [
        '1.5 cups water',
        '1 cup whole milk',
        '2 tsp loose black tea (Assam or CTC)',
        '2 tbsp sugar (adjust to taste)',
        '3 green cardamom pods, lightly crushed',
        '1 inch fresh ginger, sliced',
        '4 whole black peppercorns',
        '1 small cinnamon stick',
        '2 whole cloves',
      ],
      steps: [
        '1. Add water, ginger, cardamom, peppercorns, cinnamon, and cloves to a small saucepan. Bring to a boil over medium heat.',
        '2. Reduce heat and simmer for 3 minutes to let the spices infuse into the water.',
        '3. Add the tea leaves and sugar. Simmer for 2 minutes, letting the tea brew strong.',
        '4. Add milk and bring back to a boil. Watch carefully as it will rise quickly. When it starts to foam up, reduce heat immediately.',
        '5. Let it simmer for 2 more minutes, then strain into cups through a fine sieve. Serve immediately while hot.',
      ],
    },
  ]
);

// ── Cookbook 2: Quick Weeknight Meals ──
createCookbook(
  'quick_weeknight_meals.pdf',
  'Quick Weeknight Meals',
  'Fast, flavourful meals ready in 30 minutes or less',
  'SpiceChef Test Kitchen',
  [
    {
      title: 'Garlic Butter Pasta',
      description: 'A classic Italian-inspired pasta that comes together in 15 minutes with pantry staples.',
      meta: 'Serves: 2 | Prep: 3 min | Cook: 12 min | Total: 15 min',
      tags: 'Vegetarian, Italian, Pasta, Quick, Under 30 min',
      ingredients: [
        '200g spaghetti or linguine',
        '4 cloves garlic, thinly sliced',
        '3 tbsp butter',
        '2 tbsp extra virgin olive oil',
        '1/4 tsp red pepper flakes',
        '1/3 cup grated Parmesan cheese',
        '2 tbsp fresh parsley, chopped',
        'Salt and black pepper to taste',
      ],
      steps: [
        '1. Cook pasta in salted boiling water according to package directions. Reserve 1/2 cup pasta water before draining.',
        '2. While pasta cooks, heat butter and olive oil in a large pan over medium-low heat. Add garlic slices and red pepper flakes. Cook for 2 minutes until garlic is golden (not brown).',
        '3. Add drained pasta to the garlic butter. Toss well, adding pasta water a splash at a time to create a silky sauce.',
        '4. Remove from heat. Add Parmesan and parsley. Toss to combine. Season with salt and pepper. Serve immediately.',
      ],
    },
    {
      title: 'Sesame Vegetable Stir Fry',
      description: 'Crisp vegetables in a savoury-sweet sauce. Ready faster than delivery.',
      meta: 'Serves: 2 | Prep: 10 min | Cook: 8 min | Total: 18 min',
      tags: 'Vegetarian, Vegan, Asian, Quick, Under 30 min, Healthy',
      ingredients: [
        '1 red bell pepper, sliced',
        '1 cup broccoli florets',
        '1 medium carrot, julienned',
        '1 cup snap peas',
        '2 cloves garlic, minced',
        '1 tbsp fresh ginger, grated',
        '2 tbsp soy sauce',
        '1 tbsp sesame oil',
        '1 tbsp rice vinegar',
        '1 tsp honey or maple syrup',
        '2 tbsp vegetable oil',
        '1 tbsp sesame seeds',
      ],
      steps: [
        '1. Mix soy sauce, sesame oil, rice vinegar, and honey in a small bowl. Set aside.',
        '2. Heat vegetable oil in a wok or large pan over high heat until smoking.',
        '3. Add broccoli and carrot first. Stir fry for 3 minutes.',
        '4. Add bell pepper, snap peas, garlic, and ginger. Stir fry for 2 minutes.',
        '5. Pour in the sauce. Toss everything for 1 minute until glazed and fragrant.',
        '6. Sprinkle with sesame seeds. Serve over steamed rice.',
      ],
    },
    {
      title: 'Egg Fried Rice',
      description: 'The secret is day-old rice and a screaming hot wok. Simple but perfect.',
      meta: 'Serves: 2 | Prep: 5 min | Cook: 8 min | Total: 13 min',
      tags: 'Asian, Quick, Under 30 min, Rice, Eggs',
      ingredients: [
        '3 cups cooked rice (preferably day-old, cold)',
        '3 eggs, beaten',
        '3 tbsp soy sauce',
        '1 tbsp sesame oil',
        '3 green onions, sliced',
        '1 cup frozen peas',
        '2 cloves garlic, minced',
        '2 tbsp vegetable oil',
        'White pepper to taste',
      ],
      steps: [
        '1. Heat 1 tbsp oil in a wok over high heat. Pour in beaten eggs and scramble for 1 minute until just set. Remove and set aside.',
        '2. Add remaining oil to the wok. Add garlic and frozen peas. Stir fry for 1 minute.',
        '3. Add cold rice, breaking up any clumps. Spread flat and let it sear for 2 minutes without stirring, then toss.',
        '4. Add soy sauce and sesame oil. Toss to coat evenly. Add the scrambled eggs back in, breaking into pieces.',
        '5. Toss in green onions and white pepper. Give a final stir and serve immediately.',
      ],
    },
  ]
);
