import { Component, Input } from '@angular/core';
import { HomeTranslations } from '../../services/i18n.service';
import { NeuralHeroComponent } from '../neural-hero/neural-hero.component';
import { RouterLink } from '@angular/router';

/**
 * Home hero: headline, actions and the cinematic scene (a neural network that becomes automotive
 * computer vision, an embedded circuit and a software architecture as the reader scrolls).
 * The four stages are also a list of buttons, so the story works without scrolling, without
 * motion and without WebGL.
 */
@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.css'],
  imports: [NeuralHeroComponent, RouterLink],
})
export class HomeHeroComponent {
  @Input({ required: true }) t!: HomeTranslations;
  @Input() langQuery: { lang: string | null } = { lang: null };
}
