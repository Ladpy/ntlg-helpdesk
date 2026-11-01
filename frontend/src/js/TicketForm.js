export default class TicketForm {
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
    this.element = document.createElement('div');
    this.element.className = 'modal hidden';
    this.element.innerHTML = `
      <div class="modal-content">
        <h3 class="modal-title" id="modal-title">Добавить тикет</h3>
        <form id="ticket-form">
          <input type="hidden" id="ticket-id">
          <div class="form-group">
            <label for="ticket-name">Краткое описание</label>
            <input type="text" id="ticket-name" required>
          </div>
          <div class="form-group">
            <label for="ticket-desc">Подробное описание</label>
            <textarea id="ticket-desc" rows="4"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn" id="btn-cancel-form">Отмена</button>
            <button type="submit" class="btn">Ok</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(this.element);

    this.form = this.element.querySelector('form');
    this.title = this.element.querySelector('#modal-title');
    this.inputId = this.element.querySelector('#ticket-id');
    this.inputName = this.element.querySelector('#ticket-name');
    this.inputDesc = this.element.querySelector('#ticket-desc');

    this.element.querySelector('#btn-cancel-form').addEventListener('click', () => this.hide());
    
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit({
        id: this.inputId.value,
        name: this.inputName.value,
        description: this.inputDesc.value,
      });
    });
  }

  show(ticket = null) {
    this.form.reset();
    if (ticket) {
      this.title.textContent = 'Изменить тикет';
      this.inputId.value = ticket.id;
      this.inputName.value = ticket.name;
      this.inputDesc.value = ticket.description;
    } else {
      this.title.textContent = 'Добавить тикет';
      this.inputId.value = '';
    }
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}