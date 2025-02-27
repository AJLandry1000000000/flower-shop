export function up(knex) {
    return knex.schema.createTable('products', (table) => {
      table.string('code').primary();
      table.string('name').notNullable();
      table.jsonb('bundles').notNullable();
      table.jsonb('prices').notNullable();
    });
  }
  
  export function down(knex) {
    return knex.schema.dropTable('products');
  }