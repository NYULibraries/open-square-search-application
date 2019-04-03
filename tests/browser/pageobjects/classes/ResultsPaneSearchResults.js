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

            book.author          = innerHtml( result.element( '.author' ).getHTML() );
            book.description     = innerHtml( result.element( '.meta .meta' ).getHTML() );
            book.isbn            = innerHtml( result.getAttribute( 'id' ) );
            book.publicationDate = innerHtml( result.element( '.pubdate' ).getHTML() )
                .replace( /<span>/g, '' )
                .replace( /<\/span>/g, '' )
                .replace( /Published:/, '' )
                ;
            book.subtitle        = innerHtml( result.element( '.book-subtitle' ).getHTML() );
            book.thumbnail       = new URL( result.element( '.thumb img' ).getAttribute( 'src' ) ).pathname;
            book.title           = innerHtml( result.element( '.book-title' ).getHTML() );

            books.push( book );
        } );

        return books;
    };
}

function innerHtml( str ) {
    let newStr = str.replace( /^<[^>]+>/, '' );
    return newStr.replace( /<[^>]+>$/, '' );
}

export default ResultsPaneSearchResults;
