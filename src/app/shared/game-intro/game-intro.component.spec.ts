/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameIntroComponent } from './game-intro.component';

describe('GameIntroComponent', () => {
  let component: GameIntroComponent;
  let fixture: ComponentFixture<GameIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
