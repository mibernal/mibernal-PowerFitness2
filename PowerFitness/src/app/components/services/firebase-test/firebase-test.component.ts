import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-firebase-test',
  templateUrl: './firebase-test.component.html',
  styleUrls: ['./firebase-test.component.scss']
})
export class FirebaseTestComponent implements OnInit {

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    // Verificar la conexión a Firebase
    console.log('Conectando a Firebase...');
    this.firestore.firestore.enableNetwork().then(() => {
      console.log('Conectado a Firebase!');
      // Leer datos de Firestore
      this.firestore.collection('products').get().subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data());
        });
      });
    }).catch((error) => {
      console.log('Error de conexión:', error);
    });
  }
}
