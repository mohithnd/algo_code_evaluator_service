import express, { Express } from "express";

import bullBoardAdapter from "./config/bullBoard.config";
import serverConfig from "./config/server.config";
import sampleQueueProducer from "./producers/sample.producer";
import submissionQueueProducer from "./producers/submission.producer";
import apiRouter from "./routes";
import sampleWorker from "./workers/sample.worker";
import submissionWorker from "./workers/submission.worker";

const app: Express = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use("/queues", bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`Server Is Running On Port: ${serverConfig.PORT}`);
  console.log(
    `BullBoard Dashboard Is Running On: http://localhost:${serverConfig.PORT}/queues`
  );

  sampleWorker("SampleQueue");
  submissionWorker("SubmissionQueue");

  submissionQueueProducer({
    "1234": {
      language: "CPP",
      code: `#include <iostream>
      using namespace std;
  
      int main()
      {
          int n;
          cin >> n;
          cout << "From C++" << endl;
          for (int i = 0; i < n; i++)
          {
              for (int j = 0; j <= i; j++)
              {
                  cout << "* ";
              }
              cout << endl;
          }
          return 0;
      }`,
      inputCase: `5`,
    },
  });

  sampleQueueProducer(
    "SampleJob",
    {
      name: "Sarthak",
      company: "Razorpay",
      position: "PM-2",
      location: "BLR",
    },
    2
  );
  sampleQueueProducer(
    "SampleJob",
    {
      name: "Sanket",
      company: "Microsoft",
      position: "SDE-2",
      location: "Remote",
    },
    1
  );
});
