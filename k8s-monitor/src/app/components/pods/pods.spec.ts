import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pods } from './pods';

describe('Pods', () => {
  let component: Pods;
  let fixture: ComponentFixture<Pods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pods],
    }).compileComponents();

    fixture = TestBed.createComponent(Pods);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
