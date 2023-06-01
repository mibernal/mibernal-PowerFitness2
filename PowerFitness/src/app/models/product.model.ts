import { AuthError } from "firebase/auth";

export interface Product {
  imageUrls: any;
  brand: string;
  category: string;
  description: string;
  discount: number;
  flavors: string[];
  id?: string;
  imageUrl: string[];
  name: string;
  price: number;
  size: string;
  sizes: string[];
  stock: number;
  selectedSize?: string;
  selectedFlavor?: string;
}
