import { Injectable } from '@angular/core';
import { Carro } from '../../modelos/carros';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class CarrosService {
  private carros: Observable<Carro[]>;
  
  constructor(private http: HttpClient) { }

  public lista() {    
    return  this.http.get<Carro[]>(API + '/api/carro/listaTodos');
  }
}
