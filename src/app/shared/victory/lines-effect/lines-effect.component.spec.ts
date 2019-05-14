/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LinesEffectComponent } from './lines-effect.component';

describe('LinesEffectComponent', () => {
  let component: LinesEffectComponent;
  let fixture: ComponentFixture<LinesEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinesEffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
