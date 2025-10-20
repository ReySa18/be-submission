export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable('songs', {
    id: { type: 'varchar(50)', primaryKey: true },
    title: { type: 'text', notNull: true },
    year: { type: 'int', notNull: true },
    performer: { type: 'text', notNull: true },
    genre: { type: 'text', notNull: true },
    duration: { type: 'int' }, // optional
    album_id: { type: 'varchar(50)' }, // FK set later
    inserted_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  
  // add foreign key to albums (nullable, on delete set null)
  pgm.addConstraint('songs', 'fk_songs_album', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'SET NULL',
    },
  });

}

export async function down(pgm) {
  pgm.dropTable('songs');
}