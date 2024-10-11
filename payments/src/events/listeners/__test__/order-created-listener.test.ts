import { OrderCreatedEvent, OrderStatus } from "@dctiketz/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order-model";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "abc",
    userId: "abc",
    version: 0,
    status: OrderStatus.Created,
    ticket: {
      id: "abc",
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data };
};

it("Replicated the order info", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMesssage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("Acks the message", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMesssage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
