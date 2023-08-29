import { CustomExceptionFilter } from './execption.filter';

describe('ExecptionFilter', () => {
  it('should be defined', () => {
    expect(new CustomExceptionFilter()).toBeDefined();
  });
});
