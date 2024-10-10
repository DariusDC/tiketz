import { Publisher, Subjects, TicketUpdatedEvent } from "@dctiketz/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
