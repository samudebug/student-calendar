import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoveStudentComponent } from './remove-student.component';

describe('RemoveStudentComponent', () => {
  let component: RemoveStudentComponent;
  let fixture: ComponentFixture<RemoveStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveStudentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
