export function seed(knex) {
  return knex('products').del()
    .then(() => {
      return knex('products').insert([
        { code: 'R12', name: 'Roses', bundles: JSON.stringify([10, 5]), prices: JSON.stringify({ 10: 12.99, 5: 6.99 }) },
        { code: 'L09', name: 'Lilies', bundles: JSON.stringify([9, 6, 3]), prices: JSON.stringify({ 9: 24.95, 6: 16.95, 3: 9.95 }) },
        { code: 'T58', name: 'Tulips', bundles: JSON.stringify([9, 5, 3]), prices: JSON.stringify({ 9: 16.99, 5: 9.95, 3: 5.95 }) },
        { code: 'TEST', name: 'Test', bundles: JSON.stringify([9, 3, 2]), prices: JSON.stringify({ 9: 16.99, 3: 9.95, 2: 5.95 }) }
      ]);
    });
}