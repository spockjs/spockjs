import test from 'ava';

test('successful test', t => {
  expect: 1 === 1;
});

test('failing test', t => {
  let x;
  const double = n => n * 2;

  when: x = 3;
  then: x === double(2);
});
