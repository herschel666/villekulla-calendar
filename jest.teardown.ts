export default () => {
  if (!process.env.AMPLIFY_PID) {
    throw new Error('$AMPLIFY_PID is not defined.');
  }
  process.kill(Number(process.env.AMPLIFY_PID));
};
