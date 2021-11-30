export const generateUid = () => {
  const num = 1000;
  return (
    new Date().getTime().toString(16) +
        Math.floor(num * Math.random()).toString(16)
  );
};
