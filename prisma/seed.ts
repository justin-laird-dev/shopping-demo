import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

type SeedProduct = {
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  imageUrl: string;
};

const categoryImage: Record<string, string> = {
  Produce: "/categories/produce.svg",
  Dairy: "/categories/dairy.svg",
  Bakery: "/categories/bakery.svg",
  Pantry: "/categories/pantry.svg",
  "Meat & Seafood": "/categories/meat-seafood.svg",
  Beverages: "/categories/beverages.svg",
  Snacks: "/categories/snacks.svg",
  Frozen: "/categories/frozen.svg",
};

const products: SeedProduct[] = [
  // Produce
  { name: "Honeycrisp Apples", category: "Produce", price: 1.99, unit: "lb", description: "Crisp, sweet apples grown in local orchards. Great for snacking or baking." },
  { name: "Organic Baby Spinach", category: "Produce", price: 3.49, unit: "5 oz bag", description: "Tender organic spinach leaves, pre-washed and ready to eat." },
  { name: "Roma Tomatoes", category: "Produce", price: 1.49, unit: "lb", description: "Firm, flavorful tomatoes ideal for sauces and salads." },
  { name: "Avocados", category: "Produce", price: 1.25, unit: "each", description: "Ripe and ready avocados, perfect for guacamole or toast." },
  { name: "Broccoli Crowns", category: "Produce", price: 1.79, unit: "lb", description: "Fresh broccoli crowns, steam or roast for a quick side." },
  { name: "Bananas", category: "Produce", price: 0.59, unit: "lb", description: "Sweet, ripe bananas — a classic everyday snack." },
  { name: "Red Seedless Grapes", category: "Produce", price: 2.99, unit: "lb", description: "Sweet, crunchy red grapes with no seeds to worry about." },
  { name: "Green Seedless Grapes", category: "Produce", price: 2.99, unit: "lb", description: "Crisp green grapes, a refreshing everyday snack." },
  { name: "Navel Oranges", category: "Produce", price: 1.29, unit: "lb", description: "Juicy, seedless navel oranges, easy to peel." },
  { name: "Russet Potatoes", category: "Produce", price: 3.49, unit: "5 lb bag", description: "All-purpose russet potatoes for baking, mashing, or frying." },
  { name: "Sweet Potatoes", category: "Produce", price: 1.29, unit: "lb", description: "Naturally sweet potatoes, great roasted or mashed." },
  { name: "Yellow Onions", category: "Produce", price: 0.99, unit: "lb", description: "Versatile all-purpose yellow onions for everyday cooking." },
  { name: "Green Bell Peppers", category: "Produce", price: 1.49, unit: "each", description: "Crisp green bell peppers, great raw or cooked." },
  { name: "Carrots", category: "Produce", price: 1.29, unit: "lb", description: "Sweet, crunchy carrots for snacking or cooking." },
  { name: "Cucumbers", category: "Produce", price: 0.89, unit: "each", description: "Cool, crisp cucumbers, perfect for salads." },
  { name: "Strawberries", category: "Produce", price: 3.99, unit: "16 oz", description: "Sweet, juicy strawberries at peak ripeness." },
  { name: "Blueberries", category: "Produce", price: 3.99, unit: "6 oz", description: "Plump, antioxidant-rich blueberries." },
  { name: "Cauliflower", category: "Produce", price: 2.99, unit: "each", description: "Fresh whole cauliflower, great roasted or riced." },
  { name: "Zucchini", category: "Produce", price: 1.29, unit: "lb", description: "Mild, tender zucchini for grilling or sautéing." },
  { name: "Garlic", category: "Produce", price: 0.69, unit: "bulb", description: "Aromatic fresh garlic bulbs." },
  { name: "Lemons", category: "Produce", price: 0.59, unit: "each", description: "Bright, juicy lemons for cooking and drinks." },
  { name: "Limes", category: "Produce", price: 0.49, unit: "each", description: "Tart, juicy limes for drinks and cooking." },
  { name: "Celery", category: "Produce", price: 1.99, unit: "bunch", description: "Crisp celery stalks, great for snacking or stock." },
  { name: "Button Mushrooms", category: "Produce", price: 2.49, unit: "8 oz", description: "Fresh white button mushrooms, sliced or whole." },
  { name: "Iceberg Lettuce", category: "Produce", price: 1.79, unit: "head", description: "Crisp, mild iceberg lettuce for salads and sandwiches." },
  { name: "Romaine Lettuce", category: "Produce", price: 1.99, unit: "head", description: "Crunchy romaine hearts, perfect for a classic salad." },

  // Dairy
  { name: "Whole Milk", category: "Dairy", price: 3.79, unit: "gallon", description: "Fresh whole milk from grass-fed cows." },
  { name: "Large Grade A Eggs", category: "Dairy", price: 4.29, unit: "dozen", description: "Farm-fresh large eggs, dozen pack." },
  { name: "Sharp Cheddar Cheese", category: "Dairy", price: 5.49, unit: "8 oz block", description: "Aged sharp cheddar with a rich, tangy flavor." },
  { name: "Plain Greek Yogurt", category: "Dairy", price: 4.99, unit: "32 oz tub", description: "Thick and creamy Greek yogurt, high in protein." },
  { name: "Unsalted Butter", category: "Dairy", price: 4.49, unit: "16 oz", description: "Creamy unsalted butter, perfect for baking." },
  { name: "Willowbrook 2% Milk", category: "Dairy", price: 3.79, unit: "gallon", description: "Reduced-fat milk with a smooth, creamy taste." },
  { name: "Willowbrook Skim Milk", category: "Dairy", price: 3.69, unit: "gallon", description: "Fat-free milk, light and refreshing." },
  { name: "Willowbrook Chocolate Milk", category: "Dairy", price: 3.99, unit: "half gallon", description: "Rich, chocolatey milk the whole family will enjoy." },
  { name: "Sunrise Farms Buttermilk", category: "Dairy", price: 3.29, unit: "quart", description: "Cultured buttermilk for baking and marinades." },
  { name: "Sunrise Farms Half & Half", category: "Dairy", price: 2.99, unit: "pint", description: "Smooth half & half for coffee and cooking." },
  { name: "Sunrise Farms Heavy Whipping Cream", category: "Dairy", price: 3.49, unit: "pint", description: "Rich whipping cream for desserts and sauces." },
  { name: "Mild Cheddar Cheese", category: "Dairy", price: 5.29, unit: "8 oz block", description: "Smooth, mild cheddar for everyday snacking." },
  { name: "Mozzarella Cheese Block", category: "Dairy", price: 5.49, unit: "8 oz block", description: "Semi-soft mozzarella, great melted or sliced." },
  { name: "Shredded Mozzarella", category: "Dairy", price: 4.29, unit: "8 oz bag", description: "Pre-shredded mozzarella, ready for pizza night." },
  { name: "Shredded Cheddar", category: "Dairy", price: 4.29, unit: "8 oz bag", description: "Pre-shredded cheddar for tacos, casseroles, and more." },
  { name: "Cream Cheese", category: "Dairy", price: 2.99, unit: "8 oz block", description: "Smooth, spreadable cream cheese." },
  { name: "Sour Cream", category: "Dairy", price: 2.49, unit: "16 oz tub", description: "Tangy, creamy sour cream." },
  { name: "Cottage Cheese", category: "Dairy", price: 3.99, unit: "16 oz tub", description: "Creamy cottage cheese, a protein-rich snack." },
  { name: "Vanilla Greek Yogurt", category: "Dairy", price: 1.49, unit: "5.3 oz cup", description: "Smooth Greek yogurt with a hint of vanilla." },
  { name: "Strawberry Greek Yogurt", category: "Dairy", price: 1.49, unit: "5.3 oz cup", description: "Creamy Greek yogurt swirled with strawberry." },
  { name: "String Cheese", category: "Dairy", price: 4.99, unit: "12-pack", description: "Individually wrapped mozzarella string cheese." },
  { name: "Salted Butter", category: "Dairy", price: 4.49, unit: "16 oz", description: "Creamy salted butter for spreading and cooking." },
  { name: "Organic Free-Range Eggs", category: "Dairy", price: 5.99, unit: "dozen", description: "Eggs from free-range hens raised without cages." },
  { name: "Parmesan Cheese Wedge", category: "Dairy", price: 7.99, unit: "8 oz", description: "Aged, nutty parmesan for grating over any dish." },

  // Bakery
  { name: "Sourdough Loaf", category: "Bakery", price: 4.99, unit: "each", description: "Crusty artisan sourdough baked fresh daily." },
  { name: "Whole Wheat Bread", category: "Bakery", price: 3.29, unit: "loaf", description: "Soft whole wheat sandwich bread." },
  { name: "Butter Croissants", category: "Bakery", price: 5.99, unit: "4-pack", description: "Flaky, buttery croissants baked in-store." },
  { name: "Bagels", category: "Bakery", price: 3.99, unit: "6-pack", description: "Chewy plain bagels, great toasted with cream cheese." },
  { name: "Cinnamon Raisin Bagels", category: "Bakery", price: 4.29, unit: "6-pack", description: "Sweet bagels studded with cinnamon and raisins." },
  { name: "Everything Bagels", category: "Bakery", price: 4.29, unit: "6-pack", description: "Bagels topped with a savory seed and spice blend." },
  { name: "Hearth & Home White Sandwich Bread", category: "Bakery", price: 2.99, unit: "loaf", description: "Soft, classic white bread for everyday sandwiches." },
  { name: "Hearth & Home Multigrain Bread", category: "Bakery", price: 3.79, unit: "loaf", description: "Hearty bread made with a blend of whole grains." },
  { name: "Hearth & Home Rye Bread", category: "Bakery", price: 3.79, unit: "loaf", description: "Traditional rye bread with a robust flavor." },
  { name: "Brioche Buns", category: "Bakery", price: 4.29, unit: "6-pack", description: "Soft, slightly sweet brioche buns for burgers." },
  { name: "Hamburger Buns", category: "Bakery", price: 2.99, unit: "8-pack", description: "Soft sandwich buns, perfect for burgers." },
  { name: "Hot Dog Buns", category: "Bakery", price: 2.99, unit: "8-pack", description: "Soft split-top buns sized for hot dogs." },
  { name: "Blueberry Muffins", category: "Bakery", price: 4.99, unit: "4-pack", description: "Moist muffins packed with blueberries." },
  { name: "Chocolate Chip Muffins", category: "Bakery", price: 4.99, unit: "4-pack", description: "Bakery-style muffins loaded with chocolate chips." },
  { name: "Dinner Rolls", category: "Bakery", price: 3.49, unit: "12-pack", description: "Soft, fluffy rolls perfect alongside any meal." },
  { name: "Baguette", category: "Bakery", price: 2.99, unit: "each", description: "Crusty French baguette baked fresh daily." },
  { name: "English Muffins", category: "Bakery", price: 3.49, unit: "6-pack", description: "Nooked-and-crannied muffins, great toasted." },
  { name: "Cinnamon Rolls", category: "Bakery", price: 4.99, unit: "4-pack", description: "Soft rolls swirled with cinnamon and topped with icing." },
  { name: "Pita Bread", category: "Bakery", price: 3.29, unit: "6-pack", description: "Soft pocket bread for sandwiches and dipping." },
  { name: "Naan Bread", category: "Bakery", price: 3.99, unit: "4-pack", description: "Soft, pillowy naan, great with curries or as a wrap." },

  // Pantry
  { name: "Extra Virgin Olive Oil", category: "Pantry", price: 8.99, unit: "16.9 fl oz", description: "Cold-pressed extra virgin olive oil for cooking and dressings." },
  { name: "Penne Pasta", category: "Pantry", price: 1.69, unit: "16 oz box", description: "Classic durum wheat penne pasta." },
  { name: "Marinara Sauce", category: "Pantry", price: 3.49, unit: "24 oz jar", description: "Slow-simmered tomato marinara sauce." },
  { name: "Long Grain White Rice", category: "Pantry", price: 4.29, unit: "2 lb bag", description: "Versatile long grain rice, a pantry staple." },
  { name: "Canned Black Beans", category: "Pantry", price: 1.19, unit: "15 oz can", description: "Ready-to-eat black beans, high in fiber." },
  { name: "Peanut Butter", category: "Pantry", price: 4.79, unit: "16 oz jar", description: "Creamy peanut butter made from roasted peanuts." },
  { name: "Spaghetti Pasta", category: "Pantry", price: 1.69, unit: "16 oz box", description: "Classic long-cut spaghetti." },
  { name: "Elbow Macaroni", category: "Pantry", price: 1.69, unit: "16 oz box", description: "Short-cut macaroni, perfect for mac and cheese." },
  { name: "Golden Valley Brown Rice", category: "Pantry", price: 3.99, unit: "2 lb bag", description: "Whole-grain brown rice with a nutty flavor." },
  { name: "Golden Valley Jasmine Rice", category: "Pantry", price: 4.49, unit: "2 lb bag", description: "Fragrant jasmine rice, light and fluffy." },
  { name: "Canned Chickpeas", category: "Pantry", price: 1.19, unit: "15 oz can", description: "Tender chickpeas, ready for salads or hummus." },
  { name: "Canned Kidney Beans", category: "Pantry", price: 1.19, unit: "15 oz can", description: "Hearty kidney beans for chili and stews." },
  { name: "Canned Diced Tomatoes", category: "Pantry", price: 1.29, unit: "14.5 oz can", description: "Ripe diced tomatoes, a cooking essential." },
  { name: "Vegetable Broth", category: "Pantry", price: 2.49, unit: "32 oz carton", description: "Savory vegetable broth for soups and sauces." },
  { name: "Chicken Broth", category: "Pantry", price: 2.49, unit: "32 oz carton", description: "Rich chicken broth for soups and cooking." },
  { name: "Almond Butter", category: "Pantry", price: 7.99, unit: "16 oz jar", description: "Creamy almond butter made from roasted almonds." },
  { name: "Strawberry Jam", category: "Pantry", price: 3.49, unit: "18 oz jar", description: "Sweet strawberry jam made with real fruit." },
  { name: "Golden Valley Honey", category: "Pantry", price: 5.99, unit: "12 oz bottle", description: "Pure, golden honey, naturally sweet." },
  { name: "Maple Syrup", category: "Pantry", price: 8.99, unit: "12 fl oz", description: "Rich, pure maple syrup for pancakes and waffles." },
  { name: "Yellow Mustard", category: "Pantry", price: 1.99, unit: "14 oz bottle", description: "Classic tangy yellow mustard." },
  { name: "Ketchup", category: "Pantry", price: 2.99, unit: "20 oz bottle", description: "Rich, tomato ketchup for everyday meals." },
  { name: "Mayonnaise", category: "Pantry", price: 4.29, unit: "30 oz jar", description: "Smooth, creamy mayonnaise." },
  { name: "Balsamic Vinegar", category: "Pantry", price: 5.99, unit: "16.9 fl oz", description: "Rich, slightly sweet balsamic vinegar." },
  { name: "Canola Oil", category: "Pantry", price: 4.49, unit: "48 fl oz", description: "Light, neutral-tasting cooking oil." },
  { name: "All-Purpose Flour", category: "Pantry", price: 3.49, unit: "5 lb bag", description: "Versatile flour for baking and cooking." },
  { name: "Granulated Sugar", category: "Pantry", price: 3.29, unit: "4 lb bag", description: "Fine granulated sugar for baking and sweetening." },
  { name: "Baking Powder", category: "Pantry", price: 2.29, unit: "8 oz can", description: "Essential leavening agent for baking." },
  { name: "Quick Oats", category: "Pantry", price: 3.49, unit: "42 oz canister", description: "Quick-cooking rolled oats for breakfast." },
  { name: "Nonna's Kitchen Alfredo Sauce", category: "Pantry", price: 3.99, unit: "15 oz jar", description: "Creamy, rich alfredo sauce for pasta night." },
  { name: "Nonna's Kitchen Arrabbiata Sauce", category: "Pantry", price: 3.99, unit: "24 oz jar", description: "Spicy tomato sauce with a kick of chili." },

  // Meat & Seafood
  { name: "Boneless Chicken Breast", category: "Meat & Seafood", price: 4.99, unit: "lb", description: "Fresh boneless, skinless chicken breast." },
  { name: "Ground Beef 85/15", category: "Meat & Seafood", price: 6.49, unit: "lb", description: "Fresh ground beef, great for burgers and tacos." },
  { name: "Atlantic Salmon Fillet", category: "Meat & Seafood", price: 11.99, unit: "lb", description: "Wild-caught Atlantic salmon fillet." },
  { name: "Applewood Smoked Bacon", category: "Meat & Seafood", price: 6.99, unit: "12 oz", description: "Thick-cut bacon smoked over applewood." },
  { name: "Ground Beef 80/20", category: "Meat & Seafood", price: 5.99, unit: "lb", description: "Juicy ground beef, well suited for grilling." },
  { name: "Boneless Pork Chops", category: "Meat & Seafood", price: 5.49, unit: "lb", description: "Lean, tender boneless pork chops." },
  { name: "Chicken Thighs", category: "Meat & Seafood", price: 3.49, unit: "lb", description: "Juicy, flavorful bone-in chicken thighs." },
  { name: "Chicken Drumsticks", category: "Meat & Seafood", price: 2.99, unit: "lb", description: "Classic chicken drumsticks for grilling or baking." },
  { name: "Ground Turkey", category: "Meat & Seafood", price: 4.99, unit: "lb", description: "Lean ground turkey, a versatile protein." },
  { name: "Beef Ribeye Steak", category: "Meat & Seafood", price: 14.99, unit: "lb", description: "Well-marbled ribeye steak, great for grilling." },
  { name: "Beef Sirloin Steak", category: "Meat & Seafood", price: 9.99, unit: "lb", description: "Lean, flavorful sirloin steak." },
  { name: "Baby Back Ribs", category: "Meat & Seafood", price: 7.99, unit: "lb", description: "Tender pork baby back ribs, ready for the grill." },
  { name: "Countryside Farms Italian Sausage", category: "Meat & Seafood", price: 5.49, unit: "19 oz pack", description: "Savory Italian sausage links with classic herbs." },
  { name: "Countryside Farms Breakfast Sausage", category: "Meat & Seafood", price: 4.99, unit: "12 oz pack", description: "Seasoned breakfast sausage links." },
  { name: "Peeled Shrimp", category: "Meat & Seafood", price: 9.99, unit: "lb", description: "Peeled and deveined shrimp, ready to cook." },
  { name: "Tilapia Fillet", category: "Meat & Seafood", price: 7.99, unit: "lb", description: "Mild, flaky tilapia fillets." },
  { name: "Cod Fillet", category: "Meat & Seafood", price: 9.49, unit: "lb", description: "Fresh, flaky cod fillets." },
  { name: "Lump Crab Meat", category: "Meat & Seafood", price: 12.99, unit: "8 oz", description: "Sweet, tender lump crab meat." },
  { name: "Countryside Farms Deli Ham", category: "Meat & Seafood", price: 6.99, unit: "lb", description: "Sliced deli ham, thin-cut for sandwiches." },
  { name: "Countryside Farms Deli Turkey", category: "Meat & Seafood", price: 7.49, unit: "lb", description: "Sliced deli turkey breast, thin-cut for sandwiches." },
  { name: "Hot Dogs", category: "Meat & Seafood", price: 4.49, unit: "8-pack", description: "Classic all-beef hot dogs." },

  // Beverages
  { name: "Orange Juice", category: "Beverages", price: 4.49, unit: "52 fl oz", description: "100% pure squeezed orange juice, no pulp." },
  { name: "Sparkling Water 12-Pack", category: "Beverages", price: 5.99, unit: "12-pack", description: "Naturally flavored sparkling water, zero calories." },
  { name: "Ground Coffee", category: "Beverages", price: 9.99, unit: "12 oz bag", description: "Medium roast ground coffee, rich and smooth." },
  { name: "Green Tea Bags", category: "Beverages", price: 3.99, unit: "20-count box", description: "Antioxidant-rich green tea bags." },
  { name: "Meadowbrook Apple Juice", category: "Beverages", price: 3.99, unit: "64 fl oz", description: "Sweet, crisp apple juice." },
  { name: "Meadowbrook Cranberry Juice", category: "Beverages", price: 4.49, unit: "64 fl oz", description: "Tart cranberry juice cocktail." },
  { name: "Sunrise Roasters Whole Bean Coffee", category: "Beverages", price: 10.99, unit: "12 oz bag", description: "Whole bean coffee, medium-dark roast." },
  { name: "Sunrise Roasters Decaf Ground Coffee", category: "Beverages", price: 9.99, unit: "12 oz bag", description: "Smooth decaf coffee, full flavor without the caffeine." },
  { name: "Black Tea Bags", category: "Beverages", price: 3.99, unit: "20-count box", description: "Classic bold black tea bags." },
  { name: "Herbal Chamomile Tea", category: "Beverages", price: 4.49, unit: "20-count box", description: "Soothing caffeine-free chamomile tea." },
  { name: "Cola 12-Pack", category: "Beverages", price: 5.99, unit: "12-pack", description: "Classic cola in convenient cans." },
  { name: "Lemon-Lime Soda 12-Pack", category: "Beverages", price: 5.99, unit: "12-pack", description: "Crisp, refreshing lemon-lime soda." },
  { name: "Root Beer 12-Pack", category: "Beverages", price: 5.99, unit: "12-pack", description: "Smooth, creamy root beer." },
  { name: "Bottled Spring Water 24-Pack", category: "Beverages", price: 4.99, unit: "24-pack", description: "Pure spring water in individual bottles." },
  { name: "Sports Drink 8-Pack", category: "Beverages", price: 6.99, unit: "8-pack", description: "Electrolyte-replenishing sports drink." },
  { name: "Energy Drink 4-Pack", category: "Beverages", price: 7.99, unit: "4-pack", description: "Caffeinated energy drink for a quick boost." },
  { name: "Almond Milk", category: "Beverages", price: 3.49, unit: "64 fl oz", description: "Smooth, dairy-free almond milk." },
  { name: "Oat Milk", category: "Beverages", price: 4.29, unit: "64 fl oz", description: "Creamy, dairy-free oat milk." },
  { name: "Sweetened Iced Tea", category: "Beverages", price: 3.29, unit: "64 fl oz", description: "Refreshing sweetened iced tea." },
  { name: "Lemonade", category: "Beverages", price: 3.29, unit: "64 fl oz", description: "Classic sweet-tart lemonade." },
  { name: "Instant Coffee", category: "Beverages", price: 6.99, unit: "7 oz jar", description: "Convenient instant coffee crystals." },
  { name: "Hot Cocoa Mix", category: "Beverages", price: 3.99, unit: "8-count box", description: "Rich cocoa mix for a warm treat." },

  // Snacks
  { name: "Tortilla Chips", category: "Snacks", price: 3.49, unit: "13 oz bag", description: "Crunchy corn tortilla chips, great with salsa." },
  { name: "Mixed Nuts", category: "Snacks", price: 7.99, unit: "16 oz jar", description: "A roasted blend of almonds, cashews, and pecans." },
  { name: "Popcorn", category: "Snacks", price: 2.99, unit: "3-pack microwave", description: "Classic buttery microwave popcorn." },
  { name: "Granola Bars", category: "Snacks", price: 4.49, unit: "8-pack", description: "Chewy oats-and-honey granola bars." },
  { name: "Crestline Potato Chips", category: "Snacks", price: 3.99, unit: "9 oz bag", description: "Classic salted kettle-cooked potato chips." },
  { name: "Crestline Pretzels", category: "Snacks", price: 3.49, unit: "12 oz bag", description: "Crunchy salted pretzel twists." },
  { name: "Cheese Crackers", category: "Snacks", price: 3.99, unit: "12 oz box", description: "Bite-sized crackers baked with real cheese." },
  { name: "Wheat Crackers", category: "Snacks", price: 3.99, unit: "12 oz box", description: "Light, crispy whole wheat crackers." },
  { name: "Trail Mix", category: "Snacks", price: 6.99, unit: "16 oz bag", description: "A hearty mix of nuts, seeds, and dried fruit." },
  { name: "Dried Cranberries", category: "Snacks", price: 4.49, unit: "12 oz bag", description: "Sweet-tart dried cranberries." },
  { name: "Willow Bake Chocolate Chip Cookies", category: "Snacks", price: 4.49, unit: "14 oz pack", description: "Soft-baked cookies loaded with chocolate chips." },
  { name: "Willow Bake Oatmeal Cookies", category: "Snacks", price: 4.49, unit: "14 oz pack", description: "Chewy oatmeal cookies with a hint of cinnamon." },
  { name: "Fruit Snacks", category: "Snacks", price: 4.99, unit: "10-pack", description: "Fruit-flavored chewy snacks, kid favorite." },
  { name: "Beef Jerky", category: "Snacks", price: 6.99, unit: "3.25 oz bag", description: "Savory, protein-packed beef jerky." },
  { name: "Salsa", category: "Snacks", price: 3.99, unit: "16 oz jar", description: "Zesty tomato salsa, mild heat." },
  { name: "Guacamole Dip", category: "Snacks", price: 4.49, unit: "8 oz container", description: "Creamy avocado guacamole, ready to serve." },
  { name: "Hummus", category: "Snacks", price: 3.99, unit: "10 oz container", description: "Smooth, creamy chickpea hummus." },
  { name: "Rice Cakes", category: "Snacks", price: 3.29, unit: "6-pack", description: "Light, crunchy rice cakes." },
  { name: "Peanut Butter Crackers", category: "Snacks", price: 3.49, unit: "8-pack", description: "Peanut butter sandwiched between crisp crackers." },
  { name: "Dark Chocolate Bar", category: "Snacks", price: 3.29, unit: "3.5 oz bar", description: "Rich, smooth dark chocolate." },
  { name: "Milk Chocolate Bar", category: "Snacks", price: 2.99, unit: "3.5 oz bar", description: "Creamy, classic milk chocolate." },

  // Frozen
  { name: "Frozen Mixed Berries", category: "Frozen", price: 4.99, unit: "16 oz bag", description: "A blend of strawberries, blueberries, and raspberries, flash-frozen." },
  { name: "Frozen Pepperoni Pizza", category: "Frozen", price: 6.99, unit: "each", description: "Stone-baked pepperoni pizza, oven-ready." },
  { name: "Vanilla Ice Cream", category: "Frozen", price: 5.49, unit: "48 fl oz", description: "Rich and creamy classic vanilla ice cream." },
  { name: "Frozen French Fries", category: "Frozen", price: 3.29, unit: "2 lb bag", description: "Crispy golden crinkle-cut fries." },
  { name: "Hearthstone Cheese Pizza", category: "Frozen", price: 6.49, unit: "each", description: "Classic cheese pizza on a stone-baked crust." },
  { name: "Creamery Row Chocolate Ice Cream", category: "Frozen", price: 5.49, unit: "48 fl oz", description: "Rich, creamy chocolate ice cream." },
  { name: "Creamery Row Strawberry Ice Cream", category: "Frozen", price: 5.49, unit: "48 fl oz", description: "Sweet ice cream swirled with real strawberries." },
  { name: "Frozen Broccoli Florets", category: "Frozen", price: 2.49, unit: "12 oz bag", description: "Flash-frozen broccoli florets, steam-ready." },
  { name: "Frozen Corn", category: "Frozen", price: 2.29, unit: "12 oz bag", description: "Sweet corn kernels, flash-frozen." },
  { name: "Frozen Peas", category: "Frozen", price: 2.29, unit: "12 oz bag", description: "Tender green peas, flash-frozen." },
  { name: "Frozen Chicken Nuggets", category: "Frozen", price: 6.99, unit: "2 lb bag", description: "Breaded chicken nuggets, oven or air-fryer ready." },
  { name: "Frozen Waffles", category: "Frozen", price: 3.49, unit: "10-pack", description: "Crispy, fluffy toaster waffles." },
  { name: "Frozen Cheese Ravioli", category: "Frozen", price: 5.99, unit: "25 oz bag", description: "Cheese-filled ravioli, ready to boil." },
  { name: "Frozen Meatballs", category: "Frozen", price: 7.99, unit: "2 lb bag", description: "Fully cooked, oven-ready meatballs." },
  { name: "Frozen Fish Sticks", category: "Frozen", price: 5.99, unit: "24 oz box", description: "Breaded fish sticks, oven-ready." },
  { name: "Frozen Veggie Burgers", category: "Frozen", price: 6.49, unit: "4-pack", description: "Plant-based veggie burger patties." },
  { name: "Frozen Mango Chunks", category: "Frozen", price: 4.99, unit: "16 oz bag", description: "Sweet mango chunks, flash-frozen at peak ripeness." },
  { name: "Frozen Onion Rings", category: "Frozen", price: 4.49, unit: "16 oz bag", description: "Crispy battered onion rings, oven-ready." },
  { name: "Frozen Garlic Bread", category: "Frozen", price: 3.99, unit: "13 oz", description: "Buttery garlic bread, oven-ready." },
  { name: "Frozen Popsicles", category: "Frozen", price: 4.49, unit: "18-pack", description: "Assorted fruit-flavored ice pops." },
  { name: "Frozen Breakfast Burritos", category: "Frozen", price: 5.99, unit: "4-pack", description: "Microwave-ready breakfast burritos." },
].map((p) => ({ ...p, imageUrl: categoryImage[p.category] }));

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });
  console.log(`Seeded ${products.length} products across ${new Set(products.map((p) => p.category)).size} categories.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
