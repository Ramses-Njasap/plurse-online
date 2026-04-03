// gallery-data.ts — single source of truth for all gallery images
// Swap src values with real Plurse screenshots when ready.

export interface GalleryImage {
  id: number;
  src: string;
  label: string;
  tall?: boolean; // controls masonry height variation
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    label: "Dashboard Overview",
    tall: true,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&q=80",
    label: "Sales Analytics",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    label: "Inventory Management",
    tall: true,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
    label: "Cash Flow Monitor",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1526628953301-3cd9a04699bf?w=1200&q=80",
    label: "Customer Insights",
    tall: false,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    label: "User Management",
    tall: true,
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
    label: "Team Collaboration",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    label: "Point of Sale",
    tall: true,
  },
];