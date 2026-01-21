import { isDevMode } from '@angular/core';
import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';

export const translocoConfig = provideTransloco({
    config: {
        availableLangs: ['vi', 'en'],
        defaultLang: 'vi',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
});

// Export module for easier imports in components
export { TranslocoModule };
