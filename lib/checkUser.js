import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  try {
    // 1. Try to find the user by Clerk ID (ideal, unique)
    let loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      include: {
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // 2. If not found by Clerk ID, check if email already exists
    if (!loggedInUser) {
      const existingByEmail = await db.user.findUnique({
        where: { email: user.emailAddresses[0].emailAddress },
      });

      if (existingByEmail) {
        // Update the user with missing clerkUserId if necessary
        loggedInUser = await db.user.update({
          where: { email: user.emailAddresses[0].emailAddress },
          data: {
            clerkUserId: user.id,
            name: existingByEmail.name || `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
          },
        });
      }
    }

    // 3. Still not found? Create new user
    if (!loggedInUser) {
      loggedInUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
          transactions: {
            create: {
              type: "CREDIT_PURCHASE",
              packageId: "free_user",
              amount: 0,
            },
          },
        },
      });
    }

    return loggedInUser;
  } catch (error) {
  console.error("checkUser error:", error.message);
  return null;
}
};
