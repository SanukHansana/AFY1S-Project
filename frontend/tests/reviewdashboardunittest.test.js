// simple.test.js

describe('Basic test', () => {
  test('localStorage getItem works', () => {
    const mockToken = 'test-token';
    localStorage.setItem('token', mockToken);
    
    const getToken = () => localStorage.getItem('token');
    
    expect(getToken()).toBe(mockToken);
  });
  
  test('returns null when no token', () => {
    localStorage.clear();
    
    const getToken = () => localStorage.getItem('token');
    
    expect(getToken()).toBeNull();
  });
});