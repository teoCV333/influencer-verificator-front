import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinamicModalComponent } from './dinamic-modal.component';

describe('DinamicModalComponent', () => {
  let component: DinamicModalComponent;
  let fixture: ComponentFixture<DinamicModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DinamicModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinamicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
