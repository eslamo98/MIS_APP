import { Injectable, signal } from '@angular/core';
import { localStorageKeys } from '../models/common.model';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly themeKey = localStorageKeys.theme;
    isDarkMode = signal<boolean>(this.getInitialTheme());

    constructor() {
        this.applyTheme(this.isDarkMode());
    }

    toggleTheme() {
        const newVal = !this.isDarkMode();
        this.isDarkMode.set(newVal);
        localStorage.setItem(this.themeKey, newVal ? 'dark' : 'light');
        this.applyTheme(newVal);
    }

    private getInitialTheme(): boolean {
        const saved = localStorage.getItem(this.themeKey);
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    private applyTheme(isDark: boolean) {
        if (isDark) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }
}
