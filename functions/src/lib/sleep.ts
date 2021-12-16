export const sleep = (waitSec: number) => {
  const time = waitSec * 1000;
  return new Promise((resolve) => {
    setTimeout(function() {
      resolve(null);
    }, time);
  });
};
