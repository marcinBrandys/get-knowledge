import { Group } from './group';

describe('Group', () => {
  it('should create an instance', () => {
    expect(new Group('id', '1a', '32190312', ['1', '2'])).toBeTruthy();
  });
});
