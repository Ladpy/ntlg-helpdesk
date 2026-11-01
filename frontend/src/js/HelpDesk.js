import TicketView from './TicketView';
import TicketForm from './TicketForm';

export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = ticketService;
    this.deleteTargetId = null;
  }

  async init() {
    this.renderLayout();
    this.form = new TicketForm(this.handleFormSubmit.bind(this));
    this.bindEvents();
    await this.refresh();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="container">
        <div class="header">
          <button class="btn btn-primary" id="btn-add">Добавить тикет</button>
        </div>
        <div class="tickets-list" id="tickets-list"></div>
      </div>
      <div class="modal hidden" id="modal-delete">
        <div class="modal-content">
          <h3 class="modal-title">Удалить тикет</h3>
          <p>Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
          <div class="modal-actions">
            <button type="button" class="btn" id="btn-cancel-delete">Отмена</button>
            <button type="button" class="btn" id="btn-confirm-delete">Ok</button>
          </div>
        </div>
      </div>
      <div class="loader hidden" id="loader">Загрузка...</div>
    `;

    this.ticketsList = this.container.querySelector('#tickets-list');
    this.deleteModal = this.container.querySelector('#modal-delete');
    this.loader = this.container.querySelector('#loader');
  }

  bindEvents() {
    this.container.querySelector('#btn-add').addEventListener('click', () => this.form.show());

    // Делегирование событий для тикетов
    this.ticketsList.addEventListener('click', async (e) => {
      const ticketRow = e.target.closest('.ticket');
      if (!ticketRow) return;

      const id = ticketRow.dataset.id;
      const action = e.target.dataset.action;

      if (action === 'toggle') {
        e.stopPropagation();
        const isChecked = e.target.classList.contains('checked');
        await this.handleToggle(id, !isChecked);
      } else if (action === 'edit') {
        e.stopPropagation();
        await this.handleEdit(id);
      } else if (action === 'delete') {
        e.stopPropagation();
        this.deleteTargetId = id;
        this.deleteModal.classList.remove('hidden');
      } else {
        await this.handleShowDetails(id);
      }
    });

    // Удаление
    this.container.querySelector('#btn-cancel-delete').addEventListener('click', () => {
      this.deleteModal.classList.add('hidden');
      this.deleteTargetId = null;
    });

    this.container.querySelector('#btn-confirm-delete').addEventListener('click', async () => {
      if (this.deleteTargetId) {
        await this.handleDelete(this.deleteTargetId);
        this.deleteModal.classList.add('hidden');
        this.deleteTargetId = null;
      }
    });
  }

  async refresh() {
    this.showLoader();
    try {
      const tickets = await this.ticketService.list();
      this.ticketsList.innerHTML = '';
      tickets.forEach((ticket) => {
        this.ticketsList.appendChild(TicketView.render(ticket));
      });
    } catch (error) {
      console.error(error);
      alert('Ошибка загрузки тикетов');
    } finally {
      this.hideLoader();
    }
  }

  async handleToggle(id, status) {
    this.showLoader();
    try {
      await this.ticketService.update(id, { status });
      await this.refresh();
    } catch (error) {
      console.error(error);
      this.hideLoader();
    }
  }

  async handleEdit(id) {
    this.showLoader();
    try {
      const ticket = await this.ticketService.get(id);
      this.form.show(ticket);
    } catch (error) {
      console.error(error);
    } finally {
      this.hideLoader();
    }
  }

  async handleDelete(id) {
    this.showLoader();
    try {
      await this.ticketService.delete(id);
      await this.refresh();
    } catch (error) {
      console.error(error);
      this.hideLoader();
    }
  }

  async handleShowDetails(id) {
    const detailsEl = document.getElementById(`details-${id}`);
    
    if (detailsEl.classList.contains('active')) {
      detailsEl.classList.remove('active');
      detailsEl.innerHTML = '';
      return;
    }

    this.showLoader();
    try {
      const ticket = await this.ticketService.get(id);
      detailsEl.textContent = ticket.description || 'Описание отсутствует';
      detailsEl.classList.add('active');
    } catch (error) {
      console.error(error);
    } finally {
      this.hideLoader();
    }
  }

  async handleFormSubmit(data) {
    this.form.hide();
    this.showLoader();
    try {
      if (data.id) {
        await this.ticketService.update(data.id, { name: data.name, description: data.description });
      } else {
        await this.ticketService.create({ name: data.name, description: data.description, status: false });
      }
      await this.refresh();
    } catch (error) {
      console.error(error);
      alert('Ошибка сохранения');
      this.hideLoader();
    }
  }

  showLoader() {
    this.loader.classList.remove('hidden');
  }

  hideLoader() {
    this.loader.classList.add('hidden');
  }
}