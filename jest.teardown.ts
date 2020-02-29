export default () => {
  if (!process.env.AMPLIFY_PID) {
    if (process.env.NO_MOCKS === 'true') {
      return;
    }
    throw new Error('$AMPLIFY_PID is not defined.');
  }
  process.kill(Number(process.env.AMPLIFY_PID));
};
