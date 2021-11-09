export const deployFrontend = () => {
  const https = require("https");

  const options = {
    hostname: "api.render.com",
    port: 443,
    path: `/deploy/${process.env.DEPLOY_KEY}`,
    method: "GET"
  };

  console.log("deploying frontend...");

  const req = https.request(options, (res: any) => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on("data", (d: any) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error: any) => {
    console.error(error);
  });

  req.end();
};
