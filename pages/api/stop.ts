// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";
// import { Client, Databases } from "node-appwrite";

// const client = new Client();

// client
//   .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
//   .setProject("647dc841ab72fff2362b"); // Your project ID

// const databases = new Databases(client);

// type Data = {
//   name?: string;
//   error?: any;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   try {
//     const resp = await databases.createRelationshipAttribute(
//       "TaskWalletDB", // Database ID
//       "tasks", // Collection ID
//       "profile", // Related collection ID
//       "oneToMany", // Relationship type
//       true, // Is two-way
//       "createdBy", // Attribute key
//       "userId", // Two-way attribute key
//       "cascade" // On delete action
//     );

//     // const resp = await databases.listDocuments(
//     //   "647e598757fffd819407",
//     //   "647f9d0051f0ebff84be"
//     // );
//     console.log(resp);
//     res.status(200).json({ name: "John Doe" });
//   } catch (error: any) {
//     res.status(403).json({ error });
//   }
// }
