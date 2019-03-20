import { AgendamentosService } from './../services/agendamentos.service';
import { AlertController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AgendamentoDAO } from '../services/agendamento-dao';
import { Agendamento } from '../../modelos/agendamento';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-lista-agendamentos',
  templateUrl: './lista-agendamentos.page.html',
  styleUrls: ['./lista-agendamentos.page.scss'],
})
export class ListaAgendamentosPage implements OnInit {
  agendamentos: Agendamento[] = [];

  constructor(private angedamentoDAO: AgendamentoDAO,
              private alertController: AlertController,
              private navigationController: NavController,
              private agendamentosService: AgendamentosService,
              private agendamentoDAO: AgendamentoDAO) { }

  ngOnInit() {
    this.angedamentoDAO.listaTodos()
      .subscribe((agendamentos: Agendamento[]) => this.agendamentos = agendamentos);
  }

  ionViewDidEnter() {
    setTimeout(()=> this.atualizaAgendamentos(),5000);
  }

  atualizaAgendamentos() {
    this.agendamentos
      .filter((agendamento: Agendamento) => agendamento.confirmado)
      .forEach((agendamento: Agendamento) => {
        agendamento.visualizado = true;
        this.agendamentoDAO.salva(agendamento);
      } )
  }

  reenvia(agendamento: Agendamento) {
    const alert = this.alertController.create({
      buttons: [
        { 
          text: 'Ok',
          handler: () => {
            this.navigationController.navigateRoot('/home');
          }
        }
      ]
    });

    this.agendamentosService.agenda(agendamento)
    .pipe(mergeMap((retornoAgendamentoServiceAgenda) => {
      const observable = this.agendamentoDAO.salva(agendamento);
      if (retornoAgendamentoServiceAgenda instanceof Error)
        throw retornoAgendamentoServiceAgenda;
      return observable
    }))
    .subscribe(
      () => {
        alert.then(aviso => {
          aviso.header = "Aviso";
          aviso.message = "Agendamento reenviado com sucesso";
          aviso.present();
        });
      }, 
      (err) => {
        alert.then(aviso => {
          aviso.header = "Falha";
          aviso.message = err.message;
          aviso.present();
        });
      }
    );
  }
}
