export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable('user_album_likes', {
    id: { type: 'varchar(50)', primaryKey: true },
    user_id: { type: 'varchar(50)', notNull: true },
    album_id: { type: 'varchar(50)', notNull: true },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
}

export async function down(pgm) {
  pgm.dropTable('user_album_likes');
}
