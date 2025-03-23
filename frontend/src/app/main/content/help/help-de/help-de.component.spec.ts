import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeComponent } from './help-de.component';

describe('HelpDeComponent', () => {
  let component: HelpDeComponent;
  let fixture: ComponentFixture<HelpDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpDeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
