export interface Product {
  selectedFlavor: string;
  selectedSize: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  size: string;
  sizes: string[]; // Agregado: Atributo sizes
  stock: number;
  discount: number;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
  imageUrl4: string;
  flavor: string;
  flavors: string[]; // Agregado: Atributo flavors
}
