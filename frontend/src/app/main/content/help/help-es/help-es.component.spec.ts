import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEsComponent } from './help-es.component';

describe('HelpEsComponent', () => {
  let component: HelpEsComponent;
  let fixture: ComponentFixture<HelpEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpEsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
