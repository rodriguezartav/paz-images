import { getKnex } from "../knex";

export default function MyAdapter(options = {}) {
  const knex = getKnex();
  return {
    async createUser(user) {
      const userIds = await knex.table("users").insert(user).returning("id");
      return { id: userIds[0], ...user };
    },
    async getUser(id) {
      return knex
        .table("users")
        .select("users.*", "customers.name as customer_name")
        .join("customers", "customers.id", "users.customer_id")
        .where("users.id", id)
        .first();
    },
    async getUserByEmail(email) {
      return knex.table("users").where("email", email).first();
    },
    async getUserByAccount({ provider, id }) {
      return;
    },
    async updateUser(user) {
      const userIds = await knex
        .table("users")
        .update(user)
        .where("id", user.id)
        .returning("id");
      return user;
    },
    async deleteUser(userId) {
      return;
    },
    async linkAccount(account) {
      return;
    },
    async unlinkAccount({ provider, id }) {
      return;
    },
    async createSession({ sessionToken, userId, expires }) {
      const sessionIds = await knex
        .table("sessions")
        .insert({ sessionToken, userId, expires })
        .returning("id");

      return { sessionToken, userId, expires, id: sessionIds[0] };
    },
    async getSessionAndUser(sessionToken) {
      const session = await knex
        .table("sessions")
        .where("sessionToken", sessionToken)
        .first();

      const user = await knex
        .table("users")
        .select("users.*", "customers.name as customer_name")
        .join("customers", "customers.id", "users.customer_id")
        .where("users.id", session.userId)
        .first();

      return { session, user };
    },
    async updateSession({ sessionToken }) {
      return knex
        .table("sessions")
        .update({ sessionToken })
        .where("sessionToken", sessionToken)
        .returning("id");
    },
    async deleteSession(sessionToken) {
      return knex.table("sessions").where("sessionToken", sessionToken);
    },
    async createVerificationToken({ identifier, expires, token }) {
      return knex
        .table("verificationTokens")
        .insert({ identifier, token, expires })
        .returning("id");
    },
    async useVerificationToken({ identifier, token }) {
      console.log({ identifier, token });
      const tokens = await knex
        .table("verificationTokens")
        .select("*")
        .where({ identifier, token })
        .first();

      await knex.table("verificationTokens").delete().where("id", tokens.id);

      return tokens;
    },
  };
}
