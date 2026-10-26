import { Component } from '@angular/core';

/** Syntax token: [css class, text]. k keyword, t type, p field, s string, f method, c comment. */
type Token = [string, string];

/** An editor window that types out a small Java class describing me (decorative, aria-hidden). */
@Component({
  selector: 'app-code-card',
  templateUrl: './code-card.component.html',
  styleUrls: ['./code-card.component.css'],
  host: { 'aria-hidden': 'true' },
})
export class CodeCardComponent {
  readonly lines: Token[][] = [
    [['k', 'public class'], ['t', ' Developer'], ['', ' {']],
    [['t', '  String'], ['p', ' name'], ['', ' = '], ['s', '"Tiago Rodrigues"'], ['', ';']],
    [['t', '  String'], ['p', ' city'], ['', ' = '], ['s', '"Londrina, PR"'], ['', ';']],
    [['k', '  var'], ['p', ' stack'], ['', ' = List.'], ['f', 'of'], ['', '('], ['s', '"Java"'], ['', ', '], ['s', '"Python"'], ['', ', '], ['s', '"AI"'], ['', ');']],
    [['k', '  var'], ['p', ' areas'], ['', ' = List.'], ['f', 'of'], ['', '('], ['s', '"Cars"'], ['', ', '], ['s', '"AI"'], ['', ', '], ['s', '"Security"'], ['', ');']],
    [['', '']],
    [['k', '  void'], ['f', ' ship'], ['', '() { '], ['f', 'build'], ['', '(); '], ['f', 'test'], ['', '(); }']],
    [['', '}']],
  ];
}
