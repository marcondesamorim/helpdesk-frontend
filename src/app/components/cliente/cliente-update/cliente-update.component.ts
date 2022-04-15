import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css'],
})
export class ClienteUpdateComponent implements OnInit {
  cliente: Cliente = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: '',
  };

  @ViewChild('adminCheckbox') adminCheckbox: MatCheckbox;
  @ViewChild('clienteCheckbox') clienteCheckbox: MatCheckbox;
  @ViewChild('tecnicoCheckbox') tecnicoCheckbox: MatCheckbox;

  constructor(
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe((resposta) => {
      this.cliente = resposta;
      this.cliente.perfis = this.setChecked();
    });
  }

  setChecked(): any[] {
    const perfis = [];
    if (this.cliente.perfis.includes('ADMIN')) {
      this.adminCheckbox.checked = true;
      perfis.push(0);
    }
    if (this.cliente.perfis.includes('CLIENTE')) {
      this.clienteCheckbox.checked = true;
      perfis.push(1);
    }
    if (this.cliente.perfis.includes('TECNICO')) {
      this.clienteCheckbox.checked = true;
      perfis.push(2);
    }
    return perfis;
  }

  update(): void {
    this.service.update(this.cliente).subscribe(
      () => {
        this.toast.success('cliente atualizado com sucesso!', 'Update');
        this.router.navigate(['clientes']);
      },
      (ex) => {
        console.log(ex);
        if (ex.error.errors) {
          ex.error.errors.forEach((element: { message: string }) => {
            this.toast.error(element.message);
          });
        } else {
          this.toast.error(ex.error.message);
        }
      }
    );
  }

  addPerfil(perfil: any): void {
    console.log('perfil: ' + perfil);
    if (this.cliente.perfis.includes(perfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    } else {
      this.cliente.perfis.push(perfil);
    }
    console.log(this.cliente.perfis);
  }

  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid;
  }
}
