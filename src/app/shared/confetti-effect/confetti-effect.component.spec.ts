/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConfettiEffectComponent } from './confetti-effect.component';

describe('ConfettiEffectComponent', () => {
  let component: ConfettiEffectComponent;
  let fixture: ComponentFixture<ConfettiEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfettiEffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfettiEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
