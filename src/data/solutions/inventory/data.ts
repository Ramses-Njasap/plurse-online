// inventory-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All content for the inventory solution page.
// Schema-driven — content mirrors the actual database structure.
// Update copy here without touching any component.

// ── Category tree — mirrors schema's parent_category_id self-reference ────────
export interface CategoryNode {
  id:       string;
  name:     string;
  desc?:    string;
  children?: CategoryNode[];
}

export const CATEGORY_TREE: CategoryNode = {
  id:   "root",
  name: "Your Business",
  children: [
    {
      id:   "electronics",
      name: "Electronics",
      desc: "Parent",
      children: [
        { id: "phones",      name: "Phones"       },
        { id: "laptops",     name: "Laptops"      },
        { id: "accessories", name: "Accessories"  },
      ],
    },
    {
      id:   "clothing",
      name: "Clothing",
      desc: "Parent",
      children: [
        { id: "mens",   name: "Men's"   },
        { id: "womens", name: "Women's" },
      ],
    },
    {
      id:   "food",
      name: "Food & Beverage",
      desc: "Parent",
      children: [
        { id: "dry",   name: "Dry Goods"  },
        { id: "fresh", name: "Fresh Items" },
      ],
    },
  ],
};

// ── Feature sections ───────────────────────────────────────────────────────────
export const FEATURES = [
  {
    id:      "products-skus",
    eyebrow: "Products & SKUs",
    headline: "One product. Unlimited variants. Zero confusion.",
    body:    "Every product in Plurse can carry multiple SKUs — each with its own unique code, name and images. A single 'T-Shirt' product might have SKUs for every size and colour combination. Each SKU is tracked independently so you always know exactly which variant is running low.",
    image:   "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&q=85",
    alt:     "Product variants on a clothing rail",
    flip:    false,
    callouts: [
      "Unique SKU code per variant for fast lookup",
      "Multiple images per product and per SKU",
      "Active / inactive flags to manage availability",
    ],
  },
  {
    id:      "attributes",
    eyebrow: "Flexible Attributes",
    headline: "Describe every product exactly as it is.",
    body:    "Attributes let you attach any specification to a SKU — colour, weight, material, dimensions, anything. You define the attribute name and unit once, then assign values per SKU. No rigid templates, no missing fields. Your product data matches reality.",
    image:   "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=1000&q=85",
    alt:     "Product specification labels and detail tags",
    flip:    true,
    callouts: [
      "Custom attribute names — colour, weight, material, size",
      "Units defined per attribute — kg, cm, m², or unitless",
      "One attribute definition, reused across all SKUs",
    ],
  },
  {
    id:      "stock-purchases",
    eyebrow: "Stock Purchases",
    headline: "Every restock, fully recorded. Every margin, fully visible.",
    body:    "When stock arrives, Plurse records the purchase price, quantity, supplier, batch number, manufacture and expiry dates. Minimum and maximum selling prices are tracked so you always know what you paid, what to charge, and when stock expires.",
    image:   "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1000&q=85",
    alt:     "Stock purchase records and financial tracking",
    flip:    false,
    callouts: [
      "Price per unit, total cost and shipping recorded",
      "Min and max selling price per purchase",
      "Batch numbers, manufacture and expiry dates tracked",
    ],
  },
  {
    id:      "suppliers",
    eyebrow: "Supplier Management",
    headline: "Know who supplies you — and how to reach them.",
    body:    "Every supplier has a full profile: name, contact person, phone, email and address. Every stock purchase is linked to its supplier so you can trace any batch back to its source instantly. When you need to reorder, everything is already there.",
    image:   "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=85",
    alt:     "Business supplier meeting and partnership",
    flip:    true,
    callouts: [
      "Full contact details — name, phone, email, address",
      "Every purchase linked to its supplier",
      "Instant traceability from batch to source",
    ],
  },
];

// ── Outcomes ───────────────────────────────────────────────────────────────────
export const OUTCOMES = [
  {
    icon:  "📦",
    title: "Never oversell",
    body:  "Real-time SKU-level tracking means your stock counts are always accurate — no more selling what you don't have.",
  },
  {
    icon:  "⏰",
    title: "Restock before you run out",
    body:  "Purchase history shows how fast stock moves so you order at the right time, every time.",
  },
  {
    icon:  "💰",
    title: "Know your margins",
    body:  "Min and max selling prices calculated from actual purchase costs — never guess a price again.",
  },
  {
    icon:  "🔍",
    title: "Trace any batch instantly",
    body:  "Batch numbers, expiry dates and supplier links mean any issue takes minutes to resolve, not days.",
  },
];