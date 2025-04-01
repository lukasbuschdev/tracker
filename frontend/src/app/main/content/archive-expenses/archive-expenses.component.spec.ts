import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveExpensesComponent } from './archive-expenses.component';

describe('ArchiveExpensesComponent', () => {
  let component: ArchiveExpensesComponent;
  let fixture: ComponentFixture<ArchiveExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
