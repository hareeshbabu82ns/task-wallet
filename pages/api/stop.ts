// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cron from "cron";

type Data = {
  name: string;
};

const job = new cron.CronJob("*/2 * * * * *", () => {
  console.log("HELLO");
});

// Start the cron job
job.stop();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}
