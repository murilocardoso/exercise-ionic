import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Navigation } from '@angular/router';
import { Carro } from '../../modelos/carros';
import { Acessorio } from '../../modelos/acessorio';

@Component({
  selector: 'app-escolha',
  templateUrl: './escolha.page.html',
  styleUrls: ['./escolha.page.scss'],
})

export class EscolhaPage implements OnInit {
  public carro: Carro;
  public acessorios: Acessorio[];
  private _precoTotal: number;
  private navigation: Navigation;
  
  constructor(private router: Router,
              private alertController: AlertController,
              private navigationController: NavController) { 
    this.navigation = this.router.getCurrentNavigation();
  }

  ngOnInit() {
    if (!this.navigation) {
      const alert = this.alertController.create({
        header: 'Ops! Algo deu erro',
        message: 'Não foi possível obter as informações do item selecionado',
        buttons: [{ text: 'Ok'}]
      }).then(alert => alert.present());
    }
    
    this.carro = this.navigation.extras.queryParams["carro"] as Carro;
    this._precoTotal = this.carro.preco;

    this.acessorios = [
      {nome: "Freio ABS", preco: 800},
      {nome: "Ar-condicionado", preco: 1000},
      {nome: "MP3 Player", preco: 500},
    ];
  }

  atualizaTotal(escolhido: boolean, acessorio: Acessorio) {
    escolhido ?
      this._precoTotal += acessorio.preco :
      this._precoTotal -= acessorio.preco ;
  }

  get precoTotal() {
    return this._precoTotal;
  }

  cadastraAgendamento() {
    this.navigationController.navigateForward("/cadastro", 
                                              {queryParams: {
                                                carro: this.carro, 
                                                precoTotal: this._precoTotal
                                              }});
  }
}
