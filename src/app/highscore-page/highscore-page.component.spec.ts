/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HighscorePageComponent } from './highscore-page.component';

describe('HighscorePageComponent', () => {
  let component: HighscorePageComponent;
  let fixture: ComponentFixture<HighscorePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighscorePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighscorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
