export interface Product {
  id?: string; // Automatic, será generado automáticamente por Firestore
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  size: string;
  stock: number;
  discount: number;
  imageUrl: string; 
  imageUrl2: string; 
  imageUrl3: string; 
  imageUrl4: string; 
}
