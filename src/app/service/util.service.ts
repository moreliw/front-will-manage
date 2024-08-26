import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  formatDate(datetime: string): string {
    const date = new Date(datetime);
    const localDate = new Date(date.getTime());
    return localDate.toLocaleDateString();
  }

  formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateToLocal(datetime: string): string {
    const date = new Date(datetime);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toLocaleDateString();
  }

  formatDateTime(datetime: string): string {
    const date = new Date(datetime);
    const localDate = new Date(date.getTime());
    const day = localDate.getDate().toString().padStart(2, '0');
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const year = localDate.getFullYear();
    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  formatDateTimeToLocal(datetime: string): string {
    const date = new Date(datetime);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const day = localDate.getDate().toString().padStart(2, '0');
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const year = localDate.getFullYear();
    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  toMoney(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }
    return (
      'R$ ' +
      value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/ç/g, '&ccedil;')
      .replace(/ã/g, '&atilde;')
      .replace(/õ/g, '&otilde;')
      .replace(/é/g, '&eacute;')
      .replace(/á/g, '&aacute;')
      .replace(/í/g, '&iacute;')
      .replace(/ó/g, '&oacute;')
      .replace(/ú/g, '&uacute;');
  }
}
