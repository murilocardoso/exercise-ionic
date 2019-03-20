import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Usuario } from '../../modelos/usuario';
import { BehaviorSubject } from 'rxjs';

const API = environment.ApiUrl;
const CHAVE = 'avatar-usuario'

@Injectable({
providedIn: 'root'
})
export class UsuarioService {
    private usuarioLogadoSubject = new BehaviorSubject<Usuario>(null);
    private avatarSubject = new BehaviorSubject<string>('../../assets/img/avatar-padrao.jpg');

    constructor(private http: HttpClient) { }

    public efetuaLogin(email, senha) { 
        console.log('UsuarioService.efetuaLogin');   
        return  this.http.post<Usuario>(API + '/api/login', {email, senha})
                            .pipe(tap((usuario : Usuario) => {
                                console.log('UsuarioService.efetuaLogin - Transmitir Usuario');   
                                this.usuarioLogadoSubject.next(usuario);
                            }));
    }

    obtemUsuarioLogado() {
        return this.usuarioLogadoSubject.asObservable();
    }

    public salvaAvatar(avatar) {
        this.avatarSubject.next(avatar);
    }

    public obtemAvatar() {
        return this.avatarSubject.asObservable();
    }
}