/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WinPopupComponent } from './win-popup.component';

describe('WinPopupComponent', () => {
  let component: WinPopupComponent;
  let fixture: ComponentFixture<WinPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
