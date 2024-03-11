import { cache } from 'react';
import { MENU_LIST } from '../constants';
import { IMenuItem } from '@/components/globalMenu';

export const getMenu: ()=>Promise<IMenuItem[]> = cache(async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MENU_LIST);
        }, 10000); // 10 segundos
    });
});
