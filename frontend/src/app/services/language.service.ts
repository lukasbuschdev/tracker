import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang: BehaviorSubject<string> = new BehaviorSubject<string>('en');
  private translations: any = {};

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
    console.log('Loading language')
    this.http.get(`languages/${lang}.json`).subscribe({
      next: translations => {
        this.translations = translations;
        console.log(this.translations)
      },
      error: err => {
        console.error(`Could not load ${lang} language file`, err);
      }
    });
  }

  /**
   * Retrieves the translated value for a given key.
   * Returns the key itself if not found.
   */
  getTranslation(key: string): string {
    return this.translations[key] || key;
  }
}
