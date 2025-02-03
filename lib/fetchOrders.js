import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Orders from "@/models/Orders";

const fetchOrders = unstable_cache(
  async () => {
    await connectDB();
    const orders = await Orders.find().populate("userId", "username email");
    return JSON.parse(JSON.stringify(orders));
  },
  ["orders"], // Cache key
  { revalidate: 60 } // Revalidate every 60 seconds
);

export default fetchOrders;
