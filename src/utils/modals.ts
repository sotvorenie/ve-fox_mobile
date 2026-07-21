import { Dialog } from '@capacitor/dialog';

export const showMessage = async (title: string, content: string) => {
    await Dialog.alert({
        title,
        message: content,
    });
};

export const showWarning = async (title: string, content: string) => {
    await Dialog.alert({ title, message: content });
};

export const showError = async (title: string, content: string) => {
    await Dialog.alert({ title, message: content });
};

export const showConfirm = async (title: string, content: string): Promise<boolean> => {
    const { value } = await Dialog.confirm({
        title,
        message: content,
        okButtonTitle: 'Да',
        cancelButtonTitle: 'Нет',
    });
    return value;
};

export const showAsk = async (title: string, content: string): Promise<boolean> => {
    const { value } = await Dialog.confirm({
        title,
        message: content,
    });
    return value;
};