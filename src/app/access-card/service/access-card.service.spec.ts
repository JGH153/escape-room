/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccessCardService } from './access-card.service';

describe('Service: AccessCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessCardService]
    });
  });

  it('should ...', inject([AccessCardService], (service: AccessCardService) => {
    expect(service).toBeTruthy();
  }));
});
