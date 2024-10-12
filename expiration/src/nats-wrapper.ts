import { Consumer, Kafka, Producer } from "kafkajs";

class KafkaWrapper {
  private _producer?: Producer;
  private _consumer?: Consumer;
  private _client: Kafka;

  constructor() {
    this._client = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID!,
      brokers: [process.env.KAFKA_BROKERS!],
    });
  }

  get producer() {
    if (!this._producer) {
      throw new Error("Cannot access producer before connecting to kafka");
    }

    return this._producer;
  }

  get consumer() {
    if (!this._consumer) {
      throw new Error("Cannot access consumer before connecting to kafka");
    }

    return this._consumer;
  }

  async connect(): Promise<void> {
    this._producer = this._client.producer();
    await this._producer.connect();

    console.log("Connected to kafka with producer");
  }

  async disconnect(): Promise<void> {
    if (this._producer) {
      await this._producer.disconnect();
    }

    if (this._consumer) {
      await this._consumer.disconnect();
    }

    console.log("Disconnected from kafka");
  }
}

export const kafkaWrapper = new KafkaWrapper();
