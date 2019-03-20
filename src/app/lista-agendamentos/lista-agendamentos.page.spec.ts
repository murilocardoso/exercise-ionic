import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAgendamentosPage } from './lista-agendamentos.page';

describe('ListaAgendamentosPage', () => {
  let component: ListaAgendamentosPage;
  let fixture: ComponentFixture<ListaAgendamentosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaAgendamentosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAgendamentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
