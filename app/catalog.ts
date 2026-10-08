export const products = [
  {
    slug: "ira-textured-cushion",
    name: "Ira Textured Cushion",
    category: "Cushions",
    price: 2450,
    image: "/images/living.jpg",
    position: "47% 62%",
    material: "Cotton & linen",
    size: "50 × 50 cm",
    color: "Natural ivory",
    description:
      "A little texture. A softer place to land. Woven in a tactile cotton-linen blend, Ira brings quiet character to your favourite corner.",
    care: "Gentle cold wash. Dry flat in the shade. Cushion cover only; insert sold separately.",
  },
  {
    slug: "noor-linen-bedding",
    name: "Noor Linen Duvet Set",
    category: "Bedding",
    price: 12900,
    image: "/images/bedroom.jpg",
    position: "45% 65%",
    material: "Pure washed linen",
    size: "King · 240 × 220 cm",
    color: "Soft white",
    description:
      "For slow mornings and deeper rest. Airy, beautifully relaxed linen that feels lived-in from the very first night.",
    care: "Machine wash at 30°C with similar colours. Includes one duvet cover and two pillowcases.",
  },
  {
    slug: "saanjh-woven-throw",
    name: "Saanjh Woven Throw",
    category: "Throws",
    price: 4850,
    image: "/images/living.jpg",
    position: "60% 65%",
    material: "Textured cotton",
    size: "130 × 170 cm",
    color: "Warm oat",
    description:
      "An invitation to linger a little longer. Soft cotton, a generous weave and a delicate fringe bring warmth to everyday rituals.",
    care: "Gentle cold wash. Do not bleach. Reshape while damp and dry flat.",
  },
  {
    slug: "aara-linen-curtains",
    name: "Aara Linen Curtains",
    category: "Curtains",
    price: 6900,
    image: "/images/hero.jpg",
    position: "100% 45%",
    material: "Linen blend",
    size: "Pair · 140 × 250 cm",
    color: "Sand",
    description:
      "Let the light in, softly. Airy linen-blend panels filter afternoon sunlight and lend an effortless drape to your space.",
    care: "Dry clean recommended to preserve the drape. Includes two curtain panels.",
  },
];
export type Product = (typeof products)[number];
export const money = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
