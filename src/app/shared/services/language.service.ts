import { Injectable, signal } from '@angular/core';
import { localStorageKeys } from '../models/common.model';

export type Language = 'en' | 'ar';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private readonly langKey = localStorageKeys.language;
    currentLang = signal<Language>(this.getInitialLang());

    constructor() {
        this.applyLanguage(this.currentLang());
    }

    setLanguage(lang: Language) {
        this.currentLang.set(lang);
        localStorage.setItem(this.langKey, lang);
        this.applyLanguage(lang);
    }

    toggleLanguage() {
        const next = this.currentLang() === 'en' ? 'ar' : 'en';
        this.setLanguage(next);
    }

    private getInitialLang(): Language {
        const saved = localStorage.getItem(this.langKey) as Language;
        return saved || 'en';
    }

    private applyLanguage(lang: Language) {
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', dir);

        // Bootstrap specific direction handling if needed
        if (lang === 'ar') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
    }
}
