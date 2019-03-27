import { CommonBookItem } from "./types/book/all.type";

/**
 * Styles based on the UI part of the application.
 */
const styles = {
    bookItem: '' +
        'position: relative; font-weight: 300; border: 1px solid #4285f4; padding: 8px; font-size: 16px; max-width: 200px; height: 450px',
    aItemURL: '' +
        'font-size: 14px; text-decoration: none; color: #232323;',
    imgWrapper: '' +
        'max-height: 250px; overflow: hidden; text-align: center; margin-bottom: 16px;',
    img: '' +
        'display: block; width: 100%; height: 250px;',
    title: '' +
        'font-size: 18px; font-weight: 500;',
    isbn: '' +
        'font-size: 14px; margin-bottom: 8px;',
    date: '' +
        'margin-top: 44px; margin-left: 114px; font-size: 12px; color: #555;'
}

/**
 * Returns a template string of an email about book updates based on the given array.
 * 
 * @param books the array of books that should be in the update email
 */
export const createUpdateEmail = (books: Array<CommonBookItem>): string => {
    return `
        <h1>Árcsökkenés!</h1>
        <p style="font-size: 14px;">Az alábbi kívánságlistán szereplő könyvek jelenleg olcsóbbak, mint legutóbbi tudomásunk szerint:</p>
        <div class="books" style="display: flex; flex-flow: column nowrap;">
        ${books.map(item => {
            
            return `<div class="book-item" style="${styles.bookItem}">
                <a class="itemURL" style="${styles.aItemURL}" href="${item.url}">
                    <div class="img-wrapper" style="${styles.imgWrapper}">
                    <img style="${styles.img}" src="${item.image}" alt="${item.title}" />
                    </div>
                </a>
                <a class="itemURL" style="${styles.aItemURL}" href="${item.url}">
                    <div class="title" style="${styles.title}">${item.title}</div>
                </a>
                <div class="isbn" style="${styles.isbn}">ISBN: ${item.ISBN}</div>
                <div style="font-size: 14px;" class="author">
                    <a class="itemURL" style="${styles.aItemURL}" href="${item.author.url}">${item.author.name}</a>
                </div>
                <div style="font-size: 14px;" class="price">${item.price === -1 ? '-' : item.price } Ft</div>
                <div style="${styles.date}" class="date">${new Date(item.publicationDate).toLocaleDateString('hu-hu')}</div>
            </div>`;
        }).join('')}
        </div>
    `;
};
