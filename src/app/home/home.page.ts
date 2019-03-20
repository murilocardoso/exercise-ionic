import { Component, OnInit } from '@angular/core';
import { Carro } from '../../modelos/carros';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { CarrosService } from '../services/carros.service';
import { EscolhaPage } from '../escolha/escolha.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public carros : Carro[];
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private carrosService: CarrosService,
    private navigationController: NavController)
  {}   

  ngOnInit(): void {
    const loading = this.loadingController.create({
      message: 'Aguarde, carregando listagem de carros'
    });

    loading.then(loading => loading.present());

    this.carrosService.lista()
      .subscribe(carros => { 
          this.carros = carros; 
          loading.then(loading => loading.dismiss());
        },
        err => {            
          console.log(err);
          loading.then(loading => loading.dismiss());
          const alert = this.alertController.create({
            header: 'Falha na conexão',
            message: 'Não foi possível carregar a listagem de carros',
            buttons: [{ text: 'Ok'}]
          }).then(alert => alert.present());
        }
      );  
  }

  selecionaCarro(carro: Carro) {
    this.navigationController.navigateForward("/escolha", { queryParams: {carro} });
  }
}