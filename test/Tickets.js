const Tickets = artifacts.require("Tickets");
const assert = require("assert");

contract("Tickets", (accounts) => {
  const Buyer = accounts[1];
  const TICKET_ID = 0;

  it("it should a user to buy a ticket", async () => {
    const instance = await Tickets.deployed();
    const originalTicket = await instance.tickets(TICKET_ID);

    await instance.buyTicket(TICKET_ID, {
      from: Buyer,
      value: originalTicket.price,
    });
    const updatedTicket = await instance.tickets(TICKET_ID);
    assert.equal(
      updatedTicket.owner,
      Buyer,
      "the buyer should now own this ticket"
    );
  });
});
