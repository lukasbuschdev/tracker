import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpFrComponent } from './help-fr.component';

describe('HelpFrComponent', () => {
  let component: HelpFrComponent;
  let fixture: ComponentFixture<HelpFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpFrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
