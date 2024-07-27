
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { HistogramComponent } from './shared/component/histogram/histogram.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title='frontend';
  
  isLight: boolean = false;

  ngOnInit(): void{
    this.themeToggleMode();
  }

  themeToggleMode(){
    this.isLight=!this.isLight;
    const theme = this.isLight ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme)
    console.log("theme-class: "+ theme);
  }
}
