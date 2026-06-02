import {
  Briefcase, Camera, Sparkles, Home, Zap, ShoppingBag, Car,
  BookOpen, Dumbbell, Wrench, Armchair, Baby, PawPrint, Palette,
  UtensilsCrossed, Music, Building2, Gamepad2, Plane, LayoutGrid,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Jobs & Services":     Briefcase,
  "Photography & Video": Camera,
  "Health & Beauty":     Sparkles,
  "Real Estate":         Home,
  "Electronics":         Zap,
  "Clothing & Apparel":  ShoppingBag,
  "Vehicles":            Car,
  "Books & Education":   BookOpen,
  "Sports & Outdoors":   Dumbbell,
  "Garden & Tools":      Wrench,
  "Furniture":           Armchair,
  "Baby & Kids":         Baby,
  "Pets & Animals":      PawPrint,
  "Art & Collectibles":  Palette,
  "Food & Beverages":    UtensilsCrossed,
  "Music & Instruments": Music,
  "Office & Business":   Building2,
  "Toys & Games":        Gamepad2,
  "Travel & Experiences":Plane,
  "Other":               LayoutGrid,
};

export const CATEGORY_GRADIENTS: Record<string, string> = {
  "Jobs & Services":     "linear-gradient(135deg,#4f46e5,#3730a3)",
  "Photography & Video": "linear-gradient(135deg,#7c3aed,#4c1d95)",
  "Health & Beauty":     "linear-gradient(135deg,#ec4899,#9d174d)",
  "Real Estate":         "linear-gradient(135deg,#0d9488,#0c4a6e)",
  "Electronics":         "linear-gradient(135deg,#2563eb,#1e1b4b)",
  "Clothing & Apparel":  "linear-gradient(135deg,#c026d3,#701a75)",
  "Vehicles":            "linear-gradient(135deg,#475569,#0f172a)",
  "Books & Education":   "linear-gradient(135deg,#d97706,#7c2d12)",
  "Sports & Outdoors":   "linear-gradient(135deg,#16a34a,#052e16)",
  "Garden & Tools":      "linear-gradient(135deg,#059669,#064e3b)",
  "Furniture":           "linear-gradient(135deg,#ea580c,#78350f)",
  "Baby & Kids":         "linear-gradient(135deg,#38bdf8,#1d4ed8)",
  "Pets & Animals":      "linear-gradient(135deg,#84cc16,#14532d)",
  "Art & Collectibles":  "linear-gradient(135deg,#9333ea,#3b0764)",
  "Food & Beverages":    "linear-gradient(135deg,#dc2626,#831843)",
  "Music & Instruments": "linear-gradient(135deg,#06b6d4,#1e3a5f)",
  "Office & Business":   "linear-gradient(135deg,#334155,#020617)",
  "Toys & Games":        "linear-gradient(135deg,#eab308,#c2410c)",
  "Travel & Experiences":"linear-gradient(135deg,#f43f5e,#7c3aed)",
  "Other":               "linear-gradient(135deg,#6b7280,#1f2937)",
};

export const FALLBACK_GRADIENT = "linear-gradient(135deg,#6b7280,#1f2937)";
