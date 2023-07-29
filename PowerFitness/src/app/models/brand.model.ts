import { AuthError } from "firebase/auth";

export interface Brand {
    id?: string;
    brand: string;
    image: string[]; // Array de URLs de las imágenes de la marca
  }
