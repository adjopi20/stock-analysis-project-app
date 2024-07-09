import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExternalLinkDirective } from './shared/external-link-directives/external-link.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExternalLinkDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title='frontend';
}
