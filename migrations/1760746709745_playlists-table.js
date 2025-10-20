export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable('playlists', {
    id: { type: 'varchar(50)', primaryKey: true },
    name: { type: 'text', notNull: true },
    owner: { type: 'varchar(50)', notNull: true },
    inserted_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // FK ke users
  pgm.addConstraint('playlists', 'fk_playlists_owner_users', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
}

export async function down(pgm) {
  pgm.dropTable('playlists');
}
