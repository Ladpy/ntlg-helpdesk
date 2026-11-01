import createRequest from './api/createRequest';
import Ticket from './Ticket';

const BASE_URL = 'http://localhost:7070';

export default class TicketService {
  async list() {
    const data = await createRequest(`${BASE_URL}/?method=allTickets`);
    return data.map((item) => new Ticket(item));
  }

  async get(id) {
    const data = await createRequest(`${BASE_URL}/?method=ticketById&id=${id}`);
    return new Ticket(data);
  }

  async create(data) {
    const response = await createRequest(`${BASE_URL}/?method=createTicket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return new Ticket(response);
  }

  async update(id, data) {
    const response = await createRequest(`${BASE_URL}/?method=updateById&id=${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  }

  async delete(id) {
    await createRequest(`${BASE_URL}/?method=deleteById&id=${id}`);
  }
}