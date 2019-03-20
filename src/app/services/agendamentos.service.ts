import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, catchError} from 'rxjs/operators';
import { of } from 'rxjs';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class AgendamentosService {

  constructor(private http: HttpClient) { }

  agenda(agendamento){
    return this.http
      .post(API +"/api/agendamento/agenda", agendamento)
      .pipe(tap((x) => agendamento.enviado = true))
      .pipe(catchError((err) => of(new Error("Falha ao tentar gravar agendamento, tente novamente mais tarde."))));
  }
}
