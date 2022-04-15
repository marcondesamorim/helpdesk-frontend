import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-delete',
  templateUrl: './tecnico-delete.component.html',
  styleUrls: ['./tecnico-delete.component.css'],
})
export class TecnicoDeleteComponent implements OnInit {
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

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe((resposta) => {
      this.tecnico = resposta;
      this.setChecked();
    });
  }

  setChecked(): void {
    if (this.tecnico.perfis.includes('ADMIN')) {
      this.adminCheckbox.checked = true;
    }
    if (this.tecnico.perfis.includes('CLIENTE')) {
      this.clienteCheckbox.checked = true;
    }
    if (this.tecnico.perfis.includes('TECNICO')) {
      this.tecnicoCheckbox.checked = true;
    }
  }

  delete(): void {
    this.service.delete(this.tecnico.id).subscribe(
      () => {
        this.toast.success('Técnico deletado com sucesso!', 'Delete');
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
}
