import { Job } from "bullmq";

import Submission from "../models/submission.model";
import { IJob } from "../types/bullmq.jobDefinition";
import { ResultPayload } from "../types/resultPayload";

export default class ResultJob implements IJob {
  name: string;
  payload: ResultPayload;

  constructor(payload: ResultPayload) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    console.log("Handler of The Result Job Called");

    if (job) {
      const submission = await Submission.findById(this.payload.id);

      if (submission) {
        if (this.payload.stderr.length > 0) {
          submission.status = "RE";
        } else {
          submission.status = "Success";
        }

        submission.stdout = this.payload.stdout;
        submission.stderr = this.payload.stderr;
        await submission.save();

        console.log(submission);
      }
    }
  };

  failed = (job?: Job): void => {
    console.log("Result Job Failed:-");

    if (job) {
      console.log(job.id);
    }
  };
}
