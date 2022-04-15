import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css'],
})
export class ClienteDeleteComponent implements OnInit {
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

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe((resposta) => {
      this.cliente = resposta;
      this.setChecked();
    });
  }

  setChecked(): void {
    if (this.cliente.perfis.includes('ADMIN')) {
      this.adminCheckbox.checked = true;
    }
    if (this.cliente.perfis.includes('CLIENTE')) {
      this.clienteCheckbox.checked = true;
    }
    if (this.cliente.perfis.includes('TECNICO')) {
      this.clienteCheckbox.checked = true;
    }
  }

  delete(): void {
    this.service.delete(this.cliente.id).subscribe(
      () => {
        this.toast.success('cliente deletado com sucesso!', 'Delete');
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
}
