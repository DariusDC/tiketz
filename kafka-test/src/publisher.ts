import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to nats streaming server");

  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: "123",
    title: "Concert",
    price: 120,
  });

  //   const data = {
  //     id: "123",
  //     title: "Concert",
  //     price: 20,
  //   };

  //   const dataJson = JSON.stringify(data);

  //   client.publish("ticket:created", dataJson, () => {
  //     console.log("Event for ticket created published");
  //   });
});
