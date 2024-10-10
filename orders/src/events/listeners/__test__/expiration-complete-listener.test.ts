import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket-model";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { ExpirationCompleteEvent, OrderStatus } from "@dctiketz/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "Concert",
    price: 12,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "abcd",
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { data, listener, msg, order, ticket } = await setup();

  await listener.onMesssage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Emits and OrderCancelled event", async () => {
  const { data, listener, msg, order, ticket } = await setup();

  await listener.onMesssage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { data, listener, msg, order, ticket } = await setup();

  await listener.onMesssage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
