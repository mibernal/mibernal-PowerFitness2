import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: AngularFirestore) { }

  createOrder(order: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Genera automáticamente el número de pedido
      const numeroPedido = this.generateOrderNumber();
      
      // Establece el número de pedido y estado en el objeto de pedido
      order.numero_pedido = numeroPedido;
      order.estado = 'pendiente';

      this.firestore
        .collection('pedidos')
        .add(order)
        .then((docRef) => {
          resolve(numeroPedido); // Resuelve la promesa con el ID del pedido
        })
        .catch((error) => {
          reject(error); // Rechaza la promesa si hay un error al agregar el pedido
        });
    });
  }

  getOrder(orderId: string): Observable<any> {
    // Obtiene un pedido específico por su ID de Firestore
    return this.firestore.collection('pedidos').doc(orderId).valueChanges()
      .pipe(
        map((details: any) => {
          console.log('Fetched order details:', details);
          return details;
        }),
        catchError(error => {
          console.error('Error al obtener el pedido:', error);
          return of(null);
        })
      );
  }  

  // Agrega métodos adicionales según tus necesidades, como actualizar el estado del pedido, obtener historial de pedidos, etc.

  private generateOrderNumber(): string {
    // Esta función puede generar un número de pedido único según tu lógica
    // Por ejemplo, puedes usar la fecha actual o un contador
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER-${timestamp}-${random}`;
  }

  getUserOrdersByEmail(email: string): Observable<any[]> {
    return this.firestore.collection('pedidos', (ref) =>
      ref.where('email', '==', email)
    ).valueChanges();
  }

}
