import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyDeComponent } from './privacy-de.component';

describe('PrivacyDeComponent', () => {
  let component: PrivacyDeComponent;
  let fixture: ComponentFixture<PrivacyDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyDeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
