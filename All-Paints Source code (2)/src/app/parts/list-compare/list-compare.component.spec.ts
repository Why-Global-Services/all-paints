import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompareComponent } from './list-compare.component';

describe('ListCompareComponent', () => {
  let component: ListCompareComponent;
  let fixture: ComponentFixture<ListCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCompareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
