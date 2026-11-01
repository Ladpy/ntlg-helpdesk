export default class TicketView {
  static formatDate(timestamp) {
    const date = new Date(timestamp);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${String(date.getFullYear()).slice(-2)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  static render(ticket) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ticket-wrapper';

    wrapper.innerHTML = `
      <div class="ticket" data-id="${ticket.id}">
        <div class="ticket-checkbox ${ticket.status ? 'checked' : ''}" data-action="toggle"></div>
        <div class="ticket-content">
          <span class="ticket-name">${ticket.name}</span>
          <div class="ticket-right">
            <span class="ticket-date">${this.formatDate(ticket.created)}</span>
            <div class="ticket-actions">
              <button class="btn-icon" data-action="edit">✎</button>
              <button class="btn-icon" data-action="delete">✕</button>
            </div>
          </div>
        </div>
      </div>
      <div class="ticket-details" id="details-${ticket.id}"></div>
    `;

    return wrapper;
  }
}