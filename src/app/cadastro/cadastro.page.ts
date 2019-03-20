import { AlertController, NavController } from '@ionic/angular';
import { AgendamentosService } from './../services/agendamentos.service';
import { Component, OnInit } from '@angular/core';
import { Navigation } from '@angular/router';
import { Carro } from '../../modelos/carros';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AlertPromise } from 'selenium-webdriver';
import { Agendamento } from '../../modelos/agendamento';
import { mergeMap } from 'rxjs/operators';
import { AgendamentoDAO } from '../services/agendamento-dao';
import { Vibration } from '@ionic-native/vibration/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  private navigation: Navigation; 
  public carro: Carro;
  public precoTotal: number;
  public agendaForm: FormGroup;
  
  constructor(private route: Router,
              private formBuilder: FormBuilder,
              private agendamentosService: AgendamentosService,
              private alertController: AlertController,
              private navigationController: NavController,
              private agendamentoDAO: AgendamentoDAO,
              private vibration: Vibration,
              private datePicker: DatePicker)
  { 
    this.navigation = this.route.getCurrentNavigation();
  }

  ngOnInit() {
    if (!this.navigation) {
      const alert = this.alertController.create({
        header: 'Ops! Algo deu erro',
        message: 'Não foi possível obter as informações do item selecionado',
        buttons: [{ text: 'Ok'}]
      }).then(alert => alert.present());
    }
  
    this.agendaForm = this.formBuilder.group({
      nome: ['', Validators.required],
      endereco: ['', Validators.required],
      email: ['', [Validators.required,
                  Validators.email]],
      data: ['', Validators.required]
    });

    this.carro = this.navigation.extras.queryParams["carro"] as Carro;
    this.precoTotal = this.navigation.extras.queryParams["precoTotal"];
  }

  public agenda() {

    if (!this.agendaForm.valid) 
      return

    const agendamento: Agendamento = {
      nomeCliente: this.agendaForm.get('nome').value,
      enderecoCliente: this.agendaForm.get('endereco').value,
      emailCliente: this.agendaForm.get('email').value,
      modeloCarro: this.carro.nome,
      precoTotal: this.precoTotal,
      confirmado: false,
      enviado: false,
      data: this.agendaForm.get('data').value,
      visualizado:false
    };

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

    this.agendamentoDAO.ehDuplicado(agendamento)
      .pipe(mergeMap(ehDuplicado => {
        if (ehDuplicado) 
          throw new Error("Agendamento já realizado");
        return this.agendamentosService.agenda(agendamento)
      }))
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
            aviso.message = "Agendamento realizado com sucesso";
            aviso.present();
            this.vibration.vibrate(500);
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
/*
  selecionaData() {
    var options = {
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
    }
    this.datePicker.show(options)
      .then(date => this.agendaForm.controls['data'].setValue(date.toISOString), 
            err => alert('Error'+ err));
  }
*/ 
}