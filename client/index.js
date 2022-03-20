  import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.css";
import configuration from "../build/contracts/Tickets.json";
import ticketImage from "./images/ticket.png";

const createElementFromString = (string) => {
  const div = document.createElement("div");
  div.innerHTML = string.trim();
  return div.firstChild;
};

const contractAddress = configuration.networks["5777"].address;
const contractAbi = configuration.abi;

const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
const contract = new web3.eth.Contract(contractAbi, contractAddress);

let account;
const accountEl = document.getElementById("account");
const ticketsEl = document.getElementById("tickets");

const buyTicket = async (ticket) => {
  await contract.methods
    .buyTicket(ticket.id)
    .send({ from: account, value: ticket.price });
  await refreshTickets();
};

const TOTAL_TICKETS = 10;
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
const refreshTickets = async () => {
  ticketsEl.innerHtml = "";
  for (let i = 0; i < TOTAL_TICKETS; i++) {
    const ticket = await contract.methods.tickets(i).call();

    ticket.id = i;
    if (ticket.owner === EMPTY_ADDRESS) {
      const ticketEl =
        createElementFromString(`<div class="ticket card" style="width: 18rem;">
      <img class="card-img-top" src="${ticketImage}" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">Buy Ticket</h5>
        <p class="card-text">${ticket.price / 1e18} Eth</p>
        <button class="btn btn-primary">Buy</a>
      </div>
    </div>`);
      const button = ticketEl.querySelector("button");
      button.onclick = buyTicket.bind(null, ticket);
      ticketsEl.appendChild(ticketEl);
    }
  }
};
const main = async () => {
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountEl.innerText = account;
  await refreshTickets();
};
main();
