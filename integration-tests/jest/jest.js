test('successful test', () => {
  expect: 1 === 1;
});

test('failing test', () => {
  let x;
  const double = n => n * 2;

  when: x = 3;
  then: x === double(2);
});
