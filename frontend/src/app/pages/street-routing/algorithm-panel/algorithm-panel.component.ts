import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ALGORITHMS, AlgorithmKey, ORDER, Params, isExact } from '../engine/algorithm-catalog';
import { AlgorithmText, StreetTranslations } from '../street-i18n';

/** Algorithm selector, what the chosen algorithm does (collapsible) and its parameters. */
@Component({
  selector: 'app-algorithm-panel',
  templateUrl: './algorithm-panel.html',
  styleUrls: ['./algorithm-panel.css'],
})
export class AlgorithmPanelComponent {
  @Input({ required: true }) t!: StreetTranslations;
  @Input({ required: true }) algorithm: AlgorithmKey = 'astar';
  @Input({ required: true }) params!: Params;
  /** Description open at first (wide screens); the visitor can close or open it at any time. */
  @Input() aboutOpen = true;
  @Input() disabled = false;
  @Input() idPrefix = 'sr';

  @Output() readonly algorithmChange = new EventEmitter<AlgorithmKey>();
  @Output() readonly paramChange = new EventEmitter<{ key: string; value: number }>();

  readonly order = ORDER;

  get text(): AlgorithmText {
    return this.t.algorithms[this.algorithm];
  }

  get exact(): boolean {
    return isExact(this.algorithm, this.params);
  }

  get specs() {
    return ALGORITHMS[this.algorithm].params;
  }

  choose(value: string): void {
    this.algorithmChange.emit(value as AlgorithmKey);
  }

  setParam(key: string, value: string): void {
    this.paramChange.emit({ key, value: Number(value) });
  }
}
