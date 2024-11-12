"use server";

import { appwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";

// Helper function to fetch a user by email
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );
  return result.total > 0 ? result.documents[0] : null;
};

// Generic error handler
const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw new Error(message);
};

// Sends an OTP email to the user and returns the user ID if successful
export const sendEmailOTP = async ({ email }: { email: string }) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

// Creates a new user account or sends an OTP if the user already exists
export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    const existingUser = await getUserByEmail(email);

    // Attempt to send OTP email
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send OTP");

    // If user doesn't already exist, create a new user record
    if (!existingUser) {
      const { databases } = await createAdminClient();
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          fullName,
          email,
          avatar:
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
          accountId,
        },
      );
    }
    return parseStringify({ accountId });
  } catch (error) {
    handleError(error, "Account creation process failed");
  }
};

// Verifies the OTP and creates a session
export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);

    // Set the session cookie
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};
