"""
Generate test cookbook PDFs for SpiceChef app testing.
These are original recipes — free to use, no copyright issues.
"""

from fpdf import FPDF


class CookbookPDF(FPDF):
    def header(self):
        pass

    def chapter_title(self, title):
        self.set_font("Helvetica", "B", 22)
        self.cell(0, 15, title, new_x="LMARGIN", new_y="NEXT", align="C")
        self.ln(5)

    def section_heading(self, text):
        self.set_font("Helvetica", "B", 14)
        self.cell(0, 10, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def body_text(self, text):
        self.set_font("Helvetica", "", 11)
        self.multi_cell(0, 6, text)
        self.ln(3)

    def ingredient_line(self, text):
        self.set_font("Helvetica", "", 11)
        self.cell(5)
        self.cell(0, 6, f"- {text}", new_x="LMARGIN", new_y="NEXT")

    def recipe_separator(self):
        self.ln(5)
        self.set_draw_color(180, 180, 180)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(8)


def create_indian_cookbook():
    pdf = CookbookPDF()
    pdf.set_auto_page_break(auto=True, margin=20)

    # Title page
    pdf.add_page()
    pdf.ln(40)
    pdf.set_font("Helvetica", "B", 32)
    pdf.cell(0, 20, "Simple Indian Kitchen", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.set_font("Helvetica", "I", 16)
    pdf.cell(0, 12, "by SpiceChef Test Kitchen", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(10)
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 10, "A collection of classic Indian recipes", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.cell(0, 10, "for home cooks of all skill levels", new_x="LMARGIN", new_y="NEXT", align="C")

    # Recipe 1: Chana Masala
    pdf.add_page()
    pdf.chapter_title("Chana Masala")
    pdf.body_text("A hearty chickpea curry that's a staple across North India. Tangy, spiced, and deeply satisfying.")
    pdf.body_text("Serves: 4 | Prep: 10 min | Cook: 25 min | Total: 35 min")
    pdf.body_text("Tags: Vegetarian, Vegan, Gluten-Free, Indian, Chickpeas")

    pdf.section_heading("Ingredients")
    for ing in [
        "2 cans (400g each) chickpeas, drained and rinsed",
        "1 large onion, finely diced",
        "3 cloves garlic, minced",
        "1 inch fresh ginger, grated",
        "2 medium tomatoes, chopped (or 1 can diced tomatoes)",
        "2 tbsp vegetable oil",
        "1 tsp cumin seeds",
        "1 tsp ground coriander",
        "1 tsp garam masala",
        "1/2 tsp turmeric",
        "1/2 tsp red chilli powder",
        "1 tsp amchur (dry mango powder) or juice of half a lemon",
        "Salt to taste",
        "Fresh coriander leaves for garnish",
    ]:
        pdf.ingredient_line(ing)

    pdf.ln(5)
    pdf.section_heading("Instructions")
    pdf.body_text(
        "1. Heat oil in a heavy-bottomed pan over medium heat. Add cumin seeds and let them splutter for 30 seconds."
    )
    pdf.body_text(
        "2. Add the diced onion and cook for 8 minutes until golden brown, stirring occasionally."
    )
    pdf.body_text(
        "3. Add garlic and ginger, cook for 2 minutes until fragrant."
    )
    pdf.body_text(
        "4. Add the ground coriander, turmeric, and chilli powder. Stir for 1 minute."
    )
    pdf.body_text(
        "5. Add the chopped tomatoes and cook for 5 minutes until they break down into a paste."
    )
    pdf.body_text(
        "6. Add the drained chickpeas and 1/2 cup water. Stir well to coat. Bring to a simmer."
    )
    pdf.body_text(
        "7. Cover and cook for 15 minutes on medium-low heat, stirring occasionally. "
        "Mash a few chickpeas against the side of the pan for a thicker sauce."
    )
    pdf.body_text(
        "8. Stir in garam masala and amchur powder. Season with salt. "
        "Garnish with fresh coriander and serve with rice or naan."
    )

    pdf.recipe_separator()

    # Recipe 2: Tadka Dal
    pdf.add_page()
    pdf.chapter_title("Tadka Dal")
    pdf.body_text("Comforting yellow lentils finished with a sizzling spice tempering. The ultimate comfort food.")
    pdf.body_text("Serves: 4 | Prep: 5 min | Cook: 30 min | Total: 35 min")
    pdf.body_text("Tags: Vegetarian, Vegan, Gluten-Free, Indian, Lentils, Comfort Food")

    pdf.section_heading("Ingredients")
    for ing in [
        "1 cup yellow lentils (toor dal or moong dal), rinsed",
        "3 cups water",
        "1/2 tsp turmeric",
        "Salt to taste",
        "",
        "For the tadka (tempering):",
        "2 tbsp ghee or vegetable oil",
        "1 tsp cumin seeds",
        "1 tsp mustard seeds",
        "2 dried red chillies",
        "8-10 curry leaves",
        "3 cloves garlic, thinly sliced",
        "1 medium onion, thinly sliced",
        "2 medium tomatoes, chopped",
        "1/2 tsp red chilli powder",
        "Fresh coriander for garnish",
    ]:
        if ing:
            pdf.ingredient_line(ing)
        else:
            pdf.ln(3)

    pdf.ln(5)
    pdf.section_heading("Instructions")
    pdf.body_text(
        "1. Wash the lentils in several changes of water until the water runs clear. "
        "Add to a pot with 3 cups water and turmeric."
    )
    pdf.body_text(
        "2. Bring to a boil, then reduce heat to low. Skim any foam that rises. "
        "Cook for 25 minutes until lentils are completely soft and breaking apart."
    )
    pdf.body_text(
        "3. Whisk the cooked lentils until smooth. Add salt and adjust consistency with water if needed."
    )
    pdf.body_text(
        "4. For the tadka: Heat ghee in a small pan over high heat. Add cumin seeds and mustard seeds. "
        "When they start to pop (about 30 seconds), add dried chillies and curry leaves."
    )
    pdf.body_text(
        "5. Add sliced garlic and cook for 1 minute until golden. Add sliced onion and cook for 5 minutes."
    )
    pdf.body_text(
        "6. Add chopped tomatoes and chilli powder. Cook for 3 minutes until tomatoes soften."
    )
    pdf.body_text(
        "7. Pour the sizzling tadka over the cooked dal. Stir gently. "
        "Garnish with fresh coriander. Serve hot with steamed rice."
    )

    # Recipe 3: Jeera Rice
    pdf.add_page()
    pdf.chapter_title("Jeera Rice")
    pdf.body_text("Fragrant cumin-tempered basmati rice. The perfect side dish for any curry.")
    pdf.body_text("Serves: 4 | Prep: 5 min | Cook: 20 min | Total: 25 min")
    pdf.body_text("Tags: Vegetarian, Vegan, Gluten-Free, Indian, Rice, Quick, Side Dish")

    pdf.section_heading("Ingredients")
    for ing in [
        "1.5 cups basmati rice",
        "2.5 cups water",
        "2 tbsp ghee or butter",
        "1.5 tsp cumin seeds",
        "4 whole cloves",
        "2 green cardamom pods, lightly crushed",
        "1 bay leaf",
        "1/2 tsp salt",
        "Fresh coriander for garnish (optional)",
    ]:
        pdf.ingredient_line(ing)

    pdf.ln(5)
    pdf.section_heading("Instructions")
    pdf.body_text(
        "1. Rinse the basmati rice in cold water 3-4 times until the water runs clear. "
        "Soak in water for 20 minutes, then drain."
    )
    pdf.body_text(
        "2. Heat ghee in a heavy-bottomed pot over medium heat. Add cumin seeds, cloves, "
        "cardamom pods, and bay leaf. Fry for 1 minute until the cumin is fragrant and darker."
    )
    pdf.body_text(
        "3. Add the drained rice and gently stir for 2 minutes, coating each grain with the spiced ghee."
    )
    pdf.body_text(
        "4. Add water and salt. Bring to a boil, then immediately reduce to the lowest heat. "
        "Cover tightly and cook for 15 minutes. Do not open the lid."
    )
    pdf.body_text(
        "5. Turn off heat and let the rice rest, covered, for 5 minutes. "
        "Fluff gently with a fork. Remove the bay leaf, cloves, and cardamom. "
        "Garnish with fresh coriander if desired."
    )

    # Recipe 4: Masala Chai
    pdf.add_page()
    pdf.chapter_title("Masala Chai")
    pdf.body_text("Spiced milk tea brewed the traditional way. Warming, aromatic, and perfectly balanced.")
    pdf.body_text("Serves: 2 | Prep: 2 min | Cook: 8 min | Total: 10 min")
    pdf.body_text("Tags: Vegetarian, Indian, Drink, Quick, Spiced Tea")

    pdf.section_heading("Ingredients")
    for ing in [
        "1.5 cups water",
        "1 cup whole milk",
        "2 tsp loose black tea (Assam or CTC)",
        "2 tbsp sugar (adjust to taste)",
        "3 green cardamom pods, lightly crushed",
        "1 inch fresh ginger, sliced",
        "4 whole black peppercorns",
        "1 small cinnamon stick",
        "2 whole cloves",
    ]:
        pdf.ingredient_line(ing)

    pdf.ln(5)
    pdf.section_heading("Instructions")
    pdf.body_text(
        "1. Add water, ginger, cardamom, peppercorns, cinnamon, and cloves to a small saucepan. "
        "Bring to a boil over medium heat."
    )
    pdf.body_text(
        "2. Reduce heat and simmer for 3 minutes to let the spices infuse into the water."
    )
    pdf.body_text(
        "3. Add the tea leaves and sugar. Simmer for 2 minutes, letting the tea brew strong."
    )
    pdf.body_text(
        "4. Add milk and bring back to a boil. Watch carefully as it will rise quickly. "
        "When it starts to foam up, reduce heat immediately."
    )
    pdf.body_text(
        "5. Let it simmer for 2 more minutes, then strain into cups through a fine sieve. "
        "Serve immediately while hot."
    )

    pdf.output("simple_indian_kitchen.pdf")
    print("Created: simple_indian_kitchen.pdf (4 recipes)")


def create_quick_meals_cookbook():
    pdf = CookbookPDF()
    pdf.set_auto_page_break(auto=True, margin=20)

    # Title page
    pdf.add_page()
    pdf.ln(40)
    pdf.set_font("Helvetica", "B", 32)
    pdf.cell(0, 20, "Quick Weeknight Meals", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.set_font("Helvetica", "I", 16)
    pdf.cell(0, 12, "by SpiceChef Test Kitchen", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(10)
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 10, "Fast, flavourful meals ready in 30 minutes or less", new_x="LMARGIN", new_y="NEXT", align="C")

    # Recipe 1: Garlic Butter Pasta
    pdf.add_page()
    pdf.chapter_title("Garlic Butter Pasta")
    pdf.body_text("A classic Italian-inspired pasta that comes together in 15 minutes with pantry staples.")
    pdf.body_text("Serves: 2 | Prep: 3 min | Cook: 12 min | Total: 15 min")
    pdf.body_text("Tags: Vegetarian, Italian, Pasta, Quick, Under 30 min")

    pdf.section_heading("Ingredients")
    for ing in [
        "200g spaghetti or linguine",
        "4 cloves garlic, thinly sliced",
        "3 tbsp butter",
        "2 tbsp extra virgin olive oil",
        "1/4 tsp red pepper flakes",
        "1/3 cup grated Parmesan cheese",
        "2 tbsp fresh parsley, chopped",
        "Salt and black pepper to taste",
        "Reserved pasta water (1/2 cup)",
    ]:
        pdf.ingredient_line(ing)

    pdf.ln(5)
    pdf.section_heading("Instructions")
    pdf.body_text("1. Cook pasta in salted boiling water according to package directions. Reserve 1/2 cup pasta water before draining.")
    pdf.body_text("2. While pasta cooks, heat butter and olive oil in a large pan over medium-low heat. Add garlic slices and red pepper flakes. Cook for 2 minutes until garlic is golden (not brown).")
    pdf.body_text("3. Add drained pasta to the garlic butter. Toss well, adding pasta water a splash at a time to create a silky sauce.")
    pdf.body_text("4. Remove from heat. Add Parmesan and parsley. Toss to combine. Season with salt and pepper. Serve immediately.")

    # Recipe 2: Vegetable Stir Fry
    pdf.add_page()
    pdf.chapter_title("Sesame Vegetable Stir Fry")
    pdf.body_text("Crisp vegetables in a savoury-sweet sauce. Ready faster than delivery.")
    pdf.body_text("Serves: 2 | Prep: 10 min | Cook: 8 min | Total: 18 min")
    pdf.body_text("Tags: Vegetarian, Vegan, Asian, Quick, Under 30 min, Healthy")

    pdf.section_heading("Ingredients")
    for ing in [
        "1 red bell pepper, sliced",
        "1 cup broccoli florets",
        "1 medium carrot, julienned",
        "1 cup snap peas",
        "2 cloves garlic, minced",
        "1 tbsp fresh ginger, grated",
        "2 tbsp soy sauce",
        "1 tbsp sesame oil",
        "1 tbsp rice vinegar",
        "1 tsp honey or maple syrup",
        "2 tbsp vegetable oil",
        "1 tbsp sesame seeds",
        "Cooked rice for serving",
    ]:
        pdf.ingredient_line(ing)

    pdf.ln(5)
    pdf.section_heading("Instructions")
    pdf.body_text("1. Mix soy sauce, sesame oil, rice vinegar, and honey in a small bowl. Set aside.")
    pdf.body_text("2. Heat vegetable oil in a wok or large pan over high heat until smoking.")
    pdf.body_text("3. Add broccoli and carrot first. Stir fry for 3 minutes.")
    pdf.body_text("4. Add bell pepper, snap peas, garlic, and ginger. Stir fry for 2 minutes.")
    pdf.body_text("5. Pour in the sauce. Toss everything for 1 minute until glazed and fragrant.")
    pdf.body_text("6. Sprinkle with sesame seeds. Serve over steamed rice.")

    # Recipe 3: Egg Fried Rice
    pdf.add_page()
    pdf.chapter_title("Egg Fried Rice")
    pdf.body_text("The secret is day-old rice and a screaming hot wok. Simple but perfect.")
    pdf.body_text("Serves: 2 | Prep: 5 min | Cook: 8 min | Total: 13 min")
    pdf.body_text("Tags: Asian, Quick, Under 30 min, Rice, Eggs")

    pdf.section_heading("Ingredients")
    for ing in [
        "3 cups cooked rice (preferably day-old, cold)",
        "3 eggs, beaten",
        "3 tbsp soy sauce",
        "1 tbsp sesame oil",
        "3 green onions, sliced",
        "1 cup frozen peas",
        "2 cloves garlic, minced",
        "2 tbsp vegetable oil",
        "White pepper to taste",
    ]:
        pdf.ingredient_line(ing)

    pdf.ln(5)
    pdf.section_heading("Instructions")
    pdf.body_text("1. Heat 1 tbsp oil in a wok over high heat. Pour in beaten eggs and scramble for 1 minute until just set. Remove and set aside.")
    pdf.body_text("2. Add remaining oil to the wok. Add garlic and frozen peas. Stir fry for 1 minute.")
    pdf.body_text("3. Add cold rice, breaking up any clumps. Spread flat and let it sear for 2 minutes without stirring, then toss.")
    pdf.body_text("4. Add soy sauce and sesame oil. Toss to coat evenly. Add the scrambled eggs back in, breaking into pieces.")
    pdf.body_text("5. Toss in green onions and white pepper. Give a final stir and serve immediately.")

    pdf.output("quick_weeknight_meals.pdf")
    print("Created: quick_weeknight_meals.pdf (3 recipes)")


if __name__ == "__main__":
    create_indian_cookbook()
    create_quick_meals_cookbook()
