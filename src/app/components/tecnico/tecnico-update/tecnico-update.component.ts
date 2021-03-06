import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css'],
})
export class TecnicoUpdateComponent implements OnInit {
  tecnico: Tecnico = {
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
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe((resposta) => {
      this.tecnico = resposta;
      this.tecnico.perfis = this.setChecked();
    });
  }

  setChecked(): any[] {
    const perfis = [];
    if (this.tecnico.perfis.includes('ADMIN')) {
      this.adminCheckbox.checked = true;
      perfis.push(0);
    }
    if (this.tecnico.perfis.includes('CLIENTE')) {
      this.clienteCheckbox.checked = true;
      perfis.push(1);
    }
    if (this.tecnico.perfis.includes('TECNICO')) {
      this.tecnicoCheckbox.checked = true;
      perfis.push(2);
    }
    return perfis;
  }

  update(): void {
    this.service.update(this.tecnico).subscribe(
      () => {
        this.toast.success('T??cnico atualizado com sucesso!', 'Update');
        this.router.navigate(['tecnicos']);
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
    if (this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
    console.log(this.tecnico.perfis);
  }

  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid;
  }
}
