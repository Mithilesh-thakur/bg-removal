import { Webhook } from "svix";
import userModel from "../models/userModel.js";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Raw body string
    const payload = req.body.toString("utf8");

    // Verify signature
    await whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Parse JSON payload
    const { data, type } = JSON.parse(payload);

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.create(userData);
        return res.status(200).json({ message: "User created successfully" });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        return res.status(200).json({ message: "User updated successfully" });
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        return res.status(200).json({ message: "User deleted successfully" });
      }

      default:
        return res.status(200).json({ message: `Unhandled event: ${type}` });
    }
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return res.status(400).json({ error: "Invalid webhook request" });
  }
};

export default clerkWebhooks;
