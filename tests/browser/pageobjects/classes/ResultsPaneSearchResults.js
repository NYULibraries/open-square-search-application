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

            book.author          = innerHtml( result.findElement( '.author' ).getHTML() );
            book.description     = innerHtml( result.findElement( '.description' ).getHTML() );
            book.isbn            = innerHtml( result.getAttribute( 'id' ) );
            book.publicationDate = innerHtml( result.findElement( '.pubdate' ).getHTML() )
                .replace( /<span>/g, '' )
                .replace( /<\/span>/g, '' )
                .replace( /Published: /, '' );
            book.subtitle        = innerHtml( result.findElement( '.book-subtitle' ).getHTML() );
            book.thumbnail       = new URL( result.findElement( '.thumb img' ).getAttribute( 'src' ) ).pathname;
            book.title           = innerHtml( result.findElement( '.book-title' ).getHTML() );

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
