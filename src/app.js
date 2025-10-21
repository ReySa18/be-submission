import express from 'express';
import dotenv from 'dotenv';
import albumsPlugin from './api/albums/index.js';
import songsPlugin from './api/songs/index.js';
import usersPlugin from './api/users/index.js';
import authenticationsPlugin from './api/authentications/index.js';
import playlistsPlugin from './api/playlists/index.js';
import collaborationsPlugin from './api/collaborations/index.js';
import exportsPlugin from './api/exports/index.js';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

albumsPlugin(app);
songsPlugin(app);
usersPlugin(app);
authenticationsPlugin(app);
playlistsPlugin(app);
collaborationsPlugin(app);
exportsPlugin(app);

export default app;
