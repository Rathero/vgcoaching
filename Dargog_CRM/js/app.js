// app.js — Application initialization and routing
import { renderLeadsTable } from './leads.js';
import { renderLeadDetail } from './leadDetail.js';
import { openCreateLeadModal } from './modals.js';
import { checkReminders } from './reminders.js';

class App {
  constructor() {
    this.leadsView = document.getElementById('leads-view');
    this.detailView = document.getElementById('lead-detail-view');
    this.createBtn = document.getElementById('btn-create-lead');

    this.createBtn.addEventListener('click', () => {
      openCreateLeadModal(() => this.refreshTable());
    });

    this.initRouter();

    // Check reminders after a short delay so the UI renders first
    setTimeout(() => checkReminders(), 500);
  }

  initRouter() {
    window.addEventListener('hashchange', () => this.route());
    this.route();
  }

  route() {
    const hash = window.location.hash || '#/';
    if (hash.startsWith('#/lead/')) {
      const id = hash.replace('#/lead/', '');
      this.showDetail(id);
    } else {
      this.showTable();
    }
  }

  showTable() {
    this.leadsView.style.display = '';
    this.detailView.style.display = 'none';
    this.refreshTable();
  }

  showDetail(id) {
    this.leadsView.style.display = 'none';
    this.detailView.style.display = '';
    renderLeadDetail(id, () => {
      window.location.hash = '#/';
    });
  }

  refreshTable() {
    renderLeadsTable((id) => {
      window.location.hash = `#/lead/${id}`;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
