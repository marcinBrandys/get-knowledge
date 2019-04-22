import { TestBed } from '@angular/core/testing';

import { MappingsService } from './mappings.service';

describe('MappingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MappingsService = TestBed.get(MappingsService);
    expect(service).toBeTruthy();
  });
});
