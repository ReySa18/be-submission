export const shorthands = undefined;

export async function up(pgm) {
  pgm.addColumn('albums', {
    cover_url: {
      type: 'text',
      notNull: false,
    },
  });
}

export async function down(pgm) {
  pgm.dropColumn('albums', 'cover_url');
}
