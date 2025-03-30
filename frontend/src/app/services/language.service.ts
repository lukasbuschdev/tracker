import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import en from '../../../public/languages/en.json';
import de from '../../../public/languages/de.json';
import es from '../../../public/languages/es.json';
import fr from '../../../public/languages/fr.json';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang: BehaviorSubject<string> = new BehaviorSubject<string>('en');
  private translations: any = {};
  public selectedLanguage: string = 'English';
  public isDropdownOpened: boolean = false;
  public selectableLanguages: string[] = ['English', 'Español', 'Deutsch', 'Français'];

  constructor() {
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    this.currentLang.next(savedLang);
    this.loadLanguage(savedLang);
  }

  public get currentLanguage(): string {
    return this.currentLang.value;
  }

  getCurrentLanguage(): Observable<string> {
    return this.currentLang.asObservable();
  }

  changeLanguage(lang: string): void {
    this.currentLang.next(lang);
    localStorage.setItem('selectedLang', lang);
    this.loadLanguage(lang);
  }

  private loadLanguage(lang: string): void {
    if(lang === 'en') {
      this.translations = en;
    } else if(lang === 'es') {
      this.translations = es;
    } else if(lang === 'de') {
      this.translations = de;
    } else if(lang === 'fr') {
      this.translations = fr;
    } else {
      this.translations = en;
    }
    this.setLanguageString(lang);
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
