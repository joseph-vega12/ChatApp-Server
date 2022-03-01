/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("rooms", (table) => {
    table.increments("id");
    table.text("roomName").notNullable();
    table.text("roomImage").notNullable();
    table.text("latestMessage").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("rooms");
};
