import { Subjects, TicketUpdatedEvent } from "@dctiketz/common";
import Listener from "@dctiketz/common/build/events/base-listener";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket-model";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMesssage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { title, price } = data;
    const ticket = await Ticket.findByIdAndPreviousVersion(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
