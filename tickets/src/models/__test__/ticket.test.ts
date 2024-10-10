import { Ticket } from "../ticket";

it("Implements OCC", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 5,
    userId: "123",
  });

  await ticket.save();

  const first = await Ticket.findById(ticket.id);
  const second = await Ticket.findById(ticket.id);

  first!.set({ price: 10 });
  second!.set({ price: 15 });

  await first!.save();
  try {
    await second!.save();
  } catch (e) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("Increments version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 5,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
