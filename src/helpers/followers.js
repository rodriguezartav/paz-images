import { getKnex } from "../knex";

export default function Users(options = {}, headers) {
  const knex = getKnex();

  return {
    getAllByEmailOrPhone() {
      return knex
        .table("followers")
        .where("phone", phone)
        .orWhere("email", email);
    },
    saveFollower(follower) {
      return knex.table("followers").insert(follower);
    },
  };
}
