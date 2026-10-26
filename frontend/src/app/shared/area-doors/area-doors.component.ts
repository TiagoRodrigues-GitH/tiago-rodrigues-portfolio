import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectLangQuery, injectLocale } from '../../services/locale';
import { PHOTOS } from '../../content/photos';
import { getPortfolioProjects } from '../portfolio-projects';
import { AREA_KEYS, AREAS, AREAS_TEXT } from '../areas';

/** Home page doors into the three portfolio areas: a slowly drifting photo, what the area covers and its tab. */
@Component({
  selector: 'app-area-doors',
  imports: [RouterLink],
  templateUrl: './area-doors.component.html',
  styleUrls: ['./area-doors.component.css'],
})
export class AreaDoorsComponent {
  readonly locale = injectLocale();
  readonly langQuery = injectLangQuery(this.locale);
  readonly text = computed(() => AREAS_TEXT[this.locale()]);

  readonly doors = computed(() => {
    const projects = getPortfolioProjects(this.locale());
    const count = this.text().count;
    return AREA_KEYS.map((key) => {
      const n = projects.filter((project) => project.areas.includes(key)).length;
      return {
        key,
        photo: PHOTOS[key],
        text: AREAS[key][this.locale()],
        count: n === 0 ? count.none : n === 1 ? count.one : count.many.replace('{n}', String(n)),
      };
    });
  });
}
