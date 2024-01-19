import { Product } from "./product.model";

// search.model.ts
export interface SearchResults {
    products: Product[]; // Asegúrate de importar la interfaz Product desde tu modelo
    categories: any[]; // Puedes crear una interfaz específica para las categorías si es necesario
  }
  