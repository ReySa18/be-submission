export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable('collaborations', {
    id: { type: 'varchar(50)', primaryKey: true },
    playlist_id: { type: 'varchar(50)', notNull: true },
    user_id: { type: 'varchar(50)', notNull: true },
    inserted_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.addConstraint('collaborations', 'fk_collaborations_playlist', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('collaborations', 'fk_collaborations_user', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
}

export async function down(pgm) {
  pgm.dropTable('collaborations');
}
