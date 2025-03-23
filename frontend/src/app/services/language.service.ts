import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang: BehaviorSubject<string> = new BehaviorSubject<string>('en');
  private translations: any = {};
  public selectedLanguage: string = 'English';
  public isDropdownOpened: boolean = false;
  public selectableLanguages: string[] = ['English', 'Español', 'Deutsch', 'Français'];

  constructor(private http: HttpClient) {
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    this.currentLang.next(savedLang);
    this.loadLanguage(savedLang);
  }

  /**
   * Returns an observable of the current language.
   */
  getCurrentLanguage(): Observable<string> {
    return this.currentLang.asObservable();
  }

  /**
   * Changes the current language, saves it to localStorage, and loads the JSON file.
   */
  changeLanguage(lang: string): void {
    this.currentLang.next(lang);
    localStorage.setItem('selectedLang', lang);
    this.loadLanguage(lang);
  }

  /**
   * Loads the language JSON file from languages/ folder.
   */
  private loadLanguage(lang: string): void {
    this.http.get(`languages/${lang}.json`).subscribe({
      next: translations => {
        this.translations = translations;
        this.setLanguageString(lang);
      },
      error: err => {
        console.error(`Could not load ${lang} language file`, err);
      }
    });
  }

  private setLanguageString(lang: string): void {
    if(lang === 'en') {
      this.selectedLanguage = 'English';
    } else if(lang === 'es') {
      this.selectedLanguage = 'Español';
    } else if(lang === 'de') {
      this.selectedLanguage = 'Deutsch';
    } else {
      this.selectedLanguage = 'Français';
    }
  }

  /**
   * Retrieves the translated value for a given key.
   * Returns the key itself if not found.
   */
  getTranslation(key: string): string {
    return this.translations[key] || key;
  }


  // FOR TEMPLATE

  toggleLanguages(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeLanguages(): void {
    this.isDropdownOpened = false;
  }

  selectLanguage(language: string): void {
    this.selectedLanguage = language;
    if(language === 'English') return this.changeLanguage('en');
    if(language === 'Español') return this.changeLanguage('es');
    if(language === 'Français') return this.changeLanguage('fr');
    if(language === 'Italiano') return this.changeLanguage('it');
    this.changeLanguage('de');
  }
}
