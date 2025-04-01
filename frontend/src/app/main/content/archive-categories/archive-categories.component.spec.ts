import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveCategoriesComponent } from './archive-categories.component';

describe('ArchiveCategoriesComponent', () => {
  let component: ArchiveCategoriesComponent;
  let fixture: ComponentFixture<ArchiveCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
