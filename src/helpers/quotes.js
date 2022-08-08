import { getKnex } from "../knex";

export default function Users(options = {}, headers) {
  const knex = getKnex();

  return {
    getAll() {
      return knex
        .table("followers")
        .where("phone", phone)
        .orWhere("email", email);
    },
    save(quote) {
      return knex.table("quotes").insert(quote);
    },
  };
}
