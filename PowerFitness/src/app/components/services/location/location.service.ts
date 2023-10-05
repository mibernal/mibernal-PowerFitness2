import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'https://www.datos.gov.co/resource/xdk5-pm3f.json';
  private departmentsSubject = new BehaviorSubject<string[]>([]);
  departments$ = this.departmentsSubject.asObservable();
  private citiesSubject = new BehaviorSubject<string[]>([]);
  cities$ = this.citiesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchDepartments();
  }

  private fetchDepartments(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (departments) => {
        // Remove duplicates by using a Set to store unique departments
        const uniqueDepartments = new Set(departments.map((department) => department.departamento));
        this.departmentsSubject.next([...uniqueDepartments]);
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  getCitiesByDepartment(departmentId: string): Observable<any[]> {
    if (departmentId) {
      const params = { departamento: departmentId };
      return this.http.get<any[]>(this.apiUrl, { params }).pipe(
        map((cities) => {
          // Extract city names (municipios) and emit as an array of strings
          return cities.map((city) => city.municipio); // Modify "ciudad" to "municipio"
        })
      );
    } else {
      // If no department selected, emit an empty array of cities
      return this.citiesSubject.pipe(map(() => []));
    }
  }
}
