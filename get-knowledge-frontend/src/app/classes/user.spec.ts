import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('ewe213', 'student', 'Adam', 'Smith', 'as', 'as@get-knowledge.pl','male', 23)).toBeTruthy();
  });
});
