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
            const id = result.getAttribute( 'id' );
            const parentElementSelector = `div[ id = "${ id }" ]`;

            let book = {};

            book.author          = innerHtml( $( `${ parentElementSelector } .author` ).getHTML() );
            book.description     = innerHtml( $( `${ parentElementSelector } .description` ).getHTML() );
            book.isbn            = id;
            book.publicationDate = innerHtml( $( `${ parentElementSelector } .pubdate` ).getHTML() )
                .replace( /<span>/g, '' )
                .replace( /<\/span>/g, '' )
                .replace( /Published: /, '' );
            book.subtitle        = innerHtml( $( `${ parentElementSelector } .book-subtitle` ).getHTML() );
            book.thumbnail       = new URL( $( `${ parentElementSelector } .thumb img` ).getAttribute( 'src' ) ).pathname;
            book.title           = innerHtml( $( `${ parentElementSelector } .book-title` ).getHTML() );

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
