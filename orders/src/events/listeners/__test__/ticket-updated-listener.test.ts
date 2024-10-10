import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket-model";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@dctiketz/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Conert",
    price: 20,
  });

  await ticket.save();
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: "anbcjec",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, ticket, msg };
};

it("finds, updates, and saves a ticket", async () => {
  const { data, listener, msg, ticket } = await setup();
  await listener.onMesssage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { data, listener, msg, ticket } = await setup();
  await listener.onMesssage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event is in the future", async () => {
  const { data, listener, msg, ticket } = await setup();

  data.version = 10;

  try {
    await listener.onMesssage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
