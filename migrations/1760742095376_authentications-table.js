export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable('authentications', {
    token: { type: 'text', notNull: true },
  });
}

export async function down(pgm) {
  pgm.dropTable('authentications');
}
