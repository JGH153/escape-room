/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LogoEffectComponent } from './logo-effect.component';

describe('LogoEffectComponent', () => {
  let component: LogoEffectComponent;
  let fixture: ComponentFixture<LogoEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoEffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
