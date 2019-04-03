/* global $:false $$:false */

class ResultsPaneSearchResults {
    get _element() {
        return $( '.osq-results' );
    }

    book( title ) {
        return $( '.osq-results div[ name = "' + title + '" ]' );
    }

    metadata() {
        let results = $$( '.osq-results div.book-summary-hold' );
        let books   = [];

        results.forEach( ( result ) => {
            let book = {};

            book.author          = result.element( '.author' ).getText();
            book.description     = result.element( '.meta' ).getText();
            book.isbn            = result.getAttribute( 'id' );
            book.publicationDate = result.element( '.pubdate' ).getText();
            book.subtitle        = result.element( '.book-subtitle' ).getText();
            book.thumbnail       = new URL( result.element( '.thumb img' ).getAttribute( 'src' ) ).pathname;
            book.title           = result.element( '.book-title' ).getText();

            books.push( book );
        } );

        return books;
    };
}

export default ResultsPaneSearchResults;
