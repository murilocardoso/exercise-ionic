import { Agendamento } from './../modelos/agendamento';
import { AgendamentoDAO } from './services/agendamento-dao';
import { AgendamentosService } from './services/agendamentos.service';
import { ListaAgendamentosPage } from './lista-agendamentos/lista-agendamentos.page';
import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UsuarioService } from './services/usuario.service';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public paginas = [
    {titulo: 'Agendamentos', rota: '/lista-agendamentos', icone: 'calendar'},
    {titulo: 'Perfil', rota: '/perfil', icone: 'person'}
  ]

  public disabledMenu: boolean = true;
  public usuarioLogado$: Observable<Usuario>;
  public avatar$: Observable<string>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navigationController: NavController,
    private usuarioService: UsuarioService,
    private oneSignal: OneSignal,
    private agendamentoDAO: AgendamentoDAO){
    this.initializeApp();
    this.usuarioLogado$ = this.usuarioService.obtemUsuarioLogado();
    this.usuarioLogado$
      .subscribe((usuario:Usuario) => {
        usuario ? this.disabledMenu = false : this.disabledMenu = true; 
      });
    this.avatar$ = this.usuarioService.obtemAvatar();

    /*
    const iosConfigs = {
      kOSSettingsKeyAutoPrompt: true, //abrir pop-up solicitando permissão para mostrar notificação
      kOSSettingsKeyInAppLaunchURL: false //receber url na notificação para navegar dentro do app
    }
    */

    this.oneSignal
      .startInit('CHAVE','SENHA');
      //.iosSettings(iosConfigs);

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((notificacao: OSNotification) => {      
      const dadosAdicionais = notificacao.payload.additionalData;
      const agendamentoId = dadosAdicionais['agendamento-id'];
      if(agendamentoId) {
        this.agendamentoDAO.recupera(agendamentoId).subscribe((agendamento:Agendamento) => {
          agendamento.confirmado = true;
          this.agendamentoDAO.salva(agendamento);
        });
      }
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });

    this.oneSignal.endInit();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  navegaMenu(rota) {
    console.log(rota);
    this.navigationController.navigateForward(rota);
  }
}
