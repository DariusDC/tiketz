import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { kafkaWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.KAFKA_BROKERS) {
    throw new Error("KAFKA_BROKERS must be defined");
  }
  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("KAFKA_CLIENT_ID must be defined");
  }

  try {
    await kafkaWrapper.connect();

    new OrderCreatedListener(kafkaWrapper.client).listen();
  } catch (e) {
    console.error(e);
  }
};

start();
