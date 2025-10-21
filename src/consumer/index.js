// src/consumer/index.js
import amqplib from 'amqplib';
import PlaylistActivitiesService from '../services/PlaylistActivitiesService.js'; // if needed
import PlaylistService from '../services/PlaylistsService.js';
import PlaylistActivities from '../services/PlaylistActivitiesService.js';
import pool from '../config/db.js';
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

const RABBITMQ_SERVER = process.env.RABBITMQ_SERVER;
const QUEUE = process.env.EXPORT_QUEUE_NAME || 'export:playlists';

if (!RABBITMQ_SERVER) {
  console.error('RABBITMQ_SERVER is not set');
  process.exit(1);
}

// create transporter for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function buildPlaylistJson(playlistId) {
  // This function uses pool (db) directly or PlaylistsService if you want.
  // We fetch playlist id, name and songs (id, title, performer)

  const playlistRes = await pool.query(
    `SELECT p.id, p.name
     FROM playlists p
     WHERE p.id = $1`,
    [playlistId]
  );
  if (!playlistRes.rowCount) throw new Error('Playlist not found');

  const playlist = playlistRes.rows[0];

  const songsRes = await pool.query(
    `SELECT s.id, s.title, s.performer
     FROM playlistsongs ps
     JOIN songs s ON ps.song_id = s.id
     WHERE ps.playlist_id = $1`,
    [playlistId]
  );

  return {
    playlist: {
      id: playlist.id,
      name: playlist.name,
      songs: songsRes.rows,
    },
  };
}

async function startConsumer() {
  try {
    const conn = await amqplib.connect(RABBITMQ_SERVER);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', QUEUE);

    channel.consume(
      QUEUE,
      async (msg) => {
        if (msg !== null) {
          try {
            const content = msg.content.toString();
            const payload = JSON.parse(content);
            const { playlistId, targetEmail } = payload;

            console.log(' [x] Received job:', payload);

            // Build JSON
            const exportedData = await buildPlaylistJson(playlistId);
            const exportedJson = JSON.stringify(exportedData, null, 2);

            // send email
            const mailOptions = {
              from: process.env.EMAIL_FROM || process.env.SMTP_USER,
              to: targetEmail,
              subject: `Export Playlist ${playlistId}`,
              text: 'Attached is the exported playlist in JSON format.',
              // attach as file
              attachments: [
                {
                  filename: `playlist-${playlistId}.json`,
                  content: exportedJson,
                },
              ],
            };

            await transporter.sendMail(mailOptions);
            console.log(` [v] Email sent to ${targetEmail} for playlist ${playlistId}`);

            channel.ack(msg);
          } catch (err) {
            console.error('Error processing message:', err);
            // optionally: send to dead-letter or nack with requeue=false
            channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error('Consumer error:', err);
    process.exit(1);
  }
}

startConsumer();
