describe('jasmine with spock', () => {
  it('successful test', () => {
    expect: 1 === 1;
  });

  it('failing test', () => {
    let x;
    const double = n => n * 2;

    when: x = 3;
    then: x === double(2);
  });
});
