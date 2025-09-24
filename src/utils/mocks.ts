export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockAmazonApiCall = async (error = false) => {
  await sleep(2000);
  return new Promise((resolve, reject) => {
    if (error) reject("AWS is down!");
    resolve({
      data: {
        sales: 70000,
        profit: 102312313,
      },
    });
  });
};

export const mockGmailApiCall = async (error = false) => {
  await sleep(2400);
  return new Promise((resolve, reject) => {
    if (error) reject("GCS is down!");
    resolve({
      data: {
        sent: true,
      },
    });
  });
};

export const mockAIApiCall = async (error = false) => {
  await sleep(6000);
  return new Promise((resolve, reject) => {
    if (error) reject("The machines have taken over...");
    resolve({
      data: {
        message: "You're absolutely right!",
      },
    });
  });
};

export const mockSlackApiCall = async (error = false) => {
  await sleep(2000);
  return new Promise((resolve, reject) => {
    if (error) reject("Slack is down!");
    resolve({
      data: {
        sent: true,
      },
    });
  });
};
