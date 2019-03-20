import { AlertController } from '@ionic/angular';
import { UsuarioService } from './../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../modelos/usuario';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  public usuarioLogado$: Observable<Usuario>;
  public avatar$: Observable<string>;
  
  constructor(private usuarioService: UsuarioService,
              private camera: Camera,
              private webview: WebView,
              private alertController: AlertController){ 
    this.usuarioLogado$ = this.usuarioService.obtemUsuarioLogado();
    this.avatar$ = this.usuarioService.obtemAvatar();
  }

  tiraFoto(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }).then( fotoUri => {
      fotoUri = this.webview.convertFileSrc(fotoUri);
      this.usuarioService.salvaAvatar(fotoUri);
    }).catch((err) => {
      const alert = this.alertController.create({
        header: "Falha",
        message: "Não foi possível captura foto."+ err.message,
        buttons: [{ text: 'Ok' }]
      });
      alert.then(aviso => aviso.present());
    });
  }

  ngOnInit() {}
}
