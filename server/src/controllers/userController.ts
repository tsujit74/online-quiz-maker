import { Response,Request } from "express";


export const getUserDashboard = async (req: Request & { user?: any }, res: Response) => {
  try {
    res.status(200).json({ success: true, tests: req.user.tests });
  } catch {
    res.status(500).json({ success: false, message: "Server error fetching dashboard." });
  }
};