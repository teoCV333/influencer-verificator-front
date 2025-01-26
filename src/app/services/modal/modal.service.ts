import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  #modalState = signal({
    show: false,
    text: '',
  });

  public isShow = computed(() => this.#modalState().show);
  public text = computed(() => this.#modalState().text);

  public hide() {
    return this.#modalState.set({
      show: false,
      text: '',
    });
  }

  public show(message: string) {
    return this.#modalState.set({
      show: false,
      text: message,
    });
  }
}
