import {
  alphaNumericRegEx,
  digitRegEx,
  emailRegEx,
  nameRegEx,
  specialCharsRegEx,
} from './regEx';

describe('RegEx Tests', () => {
  test('emailRegEx should validate correct email addresses', () => {
    expect(emailRegEx.test('test@example.com')).toBe(true);
    expect(emailRegEx.test('user.name+tag+sorting@example.com')).toBe(true);
    expect(emailRegEx.test('user.name@example.co.uk')).toBe(true);
  });

  test('emailRegEx should invalidate incorrect email addresses', () => {
    expect(emailRegEx.test('plainaddress')).toBe(false);
    expect(emailRegEx.test('@missingusername.com')).toBe(false);
    expect(emailRegEx.test('username@.com')).toBe(false);
  });

  test('nameRegEx should validate correct names', () => {
    expect(nameRegEx.test('John Doe')).toBe(true);
    expect(nameRegEx.test("O'Connor")).toBe(true);
    expect(nameRegEx.test('Anne-Marie')).toBe(true);
  });

  test('nameRegEx should invalidate incorrect names', () => {
    expect(nameRegEx.test('John123')).toBe(false);
    expect(nameRegEx.test('John_Doe')).toBe(false);
    expect(nameRegEx.test('John@Doe')).toBe(false);
  });

  test('alphaNumericRegEx should validate correct alphanumeric strings', () => {
    expect(alphaNumericRegEx.test('abc123')).toBe(true);
    expect(alphaNumericRegEx.test('hello world')).toBe(true);
    expect(alphaNumericRegEx.test('123456')).toBe(true);
  });

  test('alphaNumericRegEx should invalidate incorrect alphanumeric strings', () => {
    expect(alphaNumericRegEx.test('hello@world')).toBe(false);
    expect(alphaNumericRegEx.test('hello-world')).toBe(false);
    expect(alphaNumericRegEx.test('hello.world')).toBe(false);
  });

  test('digitRegEx should validate strings containing digits', () => {
    expect(digitRegEx.test('123')).toBe(true);
    expect(digitRegEx.test('abc123')).toBe(true);
    expect(digitRegEx.test('1')).toBe(true);
  });

  test('digitRegEx should invalidate strings without digits', () => {
    expect(digitRegEx.test('abc')).toBe(false);
    expect(digitRegEx.test('')).toBe(false);
    expect(digitRegEx.test(' ')).toBe(false);
  });

  test('specialCharsRegEx should validate strings containing special characters', () => {
    expect(specialCharsRegEx.test('hello@world')).toBe(true);
    expect(specialCharsRegEx.test('hello-world')).toBe(true);
    expect(specialCharsRegEx.test('hello.world')).toBe(true);
  });

  test('specialCharsRegEx should invalidate strings without special characters', () => {
    expect(specialCharsRegEx.test('helloworld')).toBe(false);
    expect(specialCharsRegEx.test('123456')).toBe(false);
    expect(specialCharsRegEx.test('abc123')).toBe(false);
  });
});
