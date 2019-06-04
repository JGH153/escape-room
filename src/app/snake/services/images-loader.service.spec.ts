/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImagesLoaderService } from './images-loader.service';

describe('Service: ImagesLoader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImagesLoaderService]
    });
  });

  it('should ...', inject([ImagesLoaderService], (service: ImagesLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
