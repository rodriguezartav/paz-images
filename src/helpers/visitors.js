import { getKnex } from "../knex";

export default function Users(options = {}, headers) {
  const knex = getKnex();

  return {
    getUserWithCustomer() {
      return knex
        .table("users")
        .select("users.*", "customers.name as customer_name")
        .join("customers", "users.customer_id", "customers.id")
        .where("users.email", options.user.email)
        .first();
    },

    getAll() {
      return knex.table("users").where("customer_id", options.user.customer_id);
    },
    saveUser(user, user_id) {
      return knex.table("users").update(user).where("id", user_id);
    },
  };
}
