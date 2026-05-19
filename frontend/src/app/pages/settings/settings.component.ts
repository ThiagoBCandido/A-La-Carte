import { Component, OnInit, inject } from '@angular/core';
import { AppDataSummary, RecipeStorageService } from '../../core/services/recipe-storage.service';

type FeedbackType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private readonly recipeStorage = inject(RecipeStorageService);

  summary: AppDataSummary = this.recipeStorage.getAppDataSummary();

  feedbackMessage = '';
  feedbackType: FeedbackType = 'info';
  showResetDialog = false;

  private feedbackTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.loadSummary();
  }

  exportBackup(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const backup = this.recipeStorage.exportApplicationData();
    const blob = new Blob([backup], {
      type: 'application/json;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `alacarte-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);

    this.showFeedback('Backup exportado com sucesso.', 'success');
  }

  onImportSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.json')) {
      input.value = '';
      this.showFeedback('Selecione um arquivo JSON válido.', 'error');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = this.recipeStorage.importApplicationData(String(reader.result ?? ''));

      this.loadSummary();
      this.showFeedback(result.message, result.success ? 'success' : 'error');
      input.value = '';
    };

    reader.onerror = () => {
      this.showFeedback('Não foi possível ler o arquivo selecionado.', 'error');
      input.value = '';
    };

    reader.readAsText(file);
  }

  clearShoppingList(): void {
    if (this.summary.totalShoppingItems === 0) {
      this.showFeedback('Sua lista de compras já está vazia.', 'info');
      return;
    }

    this.recipeStorage.clearShoppingList();
    this.loadSummary();
    this.showFeedback('Lista de compras limpa com sucesso.', 'success');
  }

  openResetDialog(): void {
    this.showResetDialog = true;
  }

  closeResetDialog(): void {
    this.showResetDialog = false;
  }

  confirmResetApplication(): void {
    this.recipeStorage.resetApplicationData();
    this.showResetDialog = false;
    this.loadSummary();
    this.showFeedback('Aplicativo restaurado para o estado inicial.', 'success');
  }

  get feedbackBackgroundColor(): string {
    if (this.feedbackType === 'success') {
      return '#6F7D4F1A';
    }

    if (this.feedbackType === 'error') {
      return '#B85C381A';
    }

    return '#FFF4E6';
  }

  get feedbackTextColor(): string {
    if (this.feedbackType === 'success') {
      return '#6F7D4F';
    }

    if (this.feedbackType === 'error') {
      return '#B85C38';
    }

    return '#5B3A2B';
  }

  private loadSummary(): void {
    this.summary = this.recipeStorage.getAppDataSummary();
  }

  private showFeedback(message: string, type: FeedbackType): void {
    this.feedbackMessage = message;
    this.feedbackType = type;

    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }

    this.feedbackTimeout = setTimeout(() => {
      this.feedbackMessage = '';
    }, 3200);
  }
}