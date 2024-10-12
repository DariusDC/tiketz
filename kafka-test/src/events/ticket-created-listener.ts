import { Message } from "node-nats-streaming";
import Listener from "./base-listener";
import { TicketCreatedEvent } from "./ticket-create-event";
import { Subjects } from "./subjects";

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  onMesssage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event dataa", data);

    msg.ack();
  }
}
