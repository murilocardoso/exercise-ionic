import { AlertController, NavController } from '@ionic/angular';
import { UsuarioService } from './../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Usuario } from '../../modelos/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private alertController: AlertController,
              private navigationController: NavController) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,
                   Validators.email]],
      senha: ['', Validators.required]
    });
  }

  login() {
    console.log('LoginPage.login()');
    this.usuarioService
      .efetuaLogin(this.loginForm.get('email').value,
                   this.loginForm.get('senha').value)
      .subscribe(
        (usuario: Usuario) => {
          console.log('LoginPage.login().subscribe');
          this.navigationController.navigateRoot('/home');
        } 
        ,
        (err) => {
          const alert = this.alertController.create({
            header: "Falha",
            message: "Não foi possível realizar autenticação.",
            buttons: [{ text: 'Ok' }]
          });
          alert.then(aviso => aviso.present());
        }
      );
  }

}
