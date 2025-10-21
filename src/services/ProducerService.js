import amqplib from 'amqplib';

class ProducerService {
  constructor() {
    this._server = process.env.RABBITMQ_SERVER;
    this._connection = null;
    this._channel = null;
  }

  async connect() {
    if (this._channel) return;
    if (!this._server) throw new Error('RABBITMQ_SERVER environment variable is not set');
    this._connection = await amqplib.connect(this._server);
    this._channel = await this._connection.createChannel();
  }

  async sendToQueue(queue, message) {
    await this.connect();
    await this._channel.assertQueue(queue, { durable: true });
    const payload = Buffer.from(JSON.stringify(message));
    return this._channel.sendToQueue(queue, payload, { persistent: true });
  }

  async close() {
    if (this._channel) await this._channel.close();
    if (this._connection) await this._connection.close();
    this._channel = null;
    this._connection = null;
  }
}

export default ProducerService;
