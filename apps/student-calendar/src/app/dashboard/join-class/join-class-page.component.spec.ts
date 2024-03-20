import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinClassPageComponent } from './join-class-page.component';

describe('JoinClassPageComponent', () => {
  let component: JoinClassPageComponent;
  let fixture: ComponentFixture<JoinClassPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinClassPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinClassPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
