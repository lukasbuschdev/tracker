import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEnComponent } from './help-en.component';

describe('HelpEnComponent', () => {
  let component: HelpEnComponent;
  let fixture: ComponentFixture<HelpEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpEnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
