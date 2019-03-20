import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Agendamento } from '../../modelos/agendamento';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class AgendamentoDAO {

  constructor(private storage: Storage) { }
  
  salva(agendamento: Agendamento){
    const chave = this.geraChave(agendamento)
    const promise = this.storage.set(chave,agendamento);
    return from(promise);
  }  
  
  ehDuplicado(agendamento: Agendamento) {
    const chave = this.geraChave(agendamento)
    const promise = this.storage.get(chave).then(reg => reg ? true : false);
    
    return from(promise);
  }

  recupera(agendamentoId: string) {
    const promise = this.storage.get(agendamentoId);
    
    return from(promise);
  }
  
  listaTodos(){
    const agendamentos: Agendamento[] = [];
    
    const promise = this.storage.forEach((agendamento: Agendamento) => {
      agendamentos.push(agendamento)
    }).then(() => agendamentos);
    
    return from(promise);
  }

  private geraChave(agendamento: Agendamento) {
    return agendamento.emailCliente + agendamento.data.substr(0,10);
  }
}
