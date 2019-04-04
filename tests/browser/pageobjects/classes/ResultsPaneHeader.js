/* global $:false */

class ResultsPaneHeader {
    get text() {
        return $( 'h2.osq-resultsheader' ).getText();
    }

    get numBooks() {
        let found = this.text.match( /Results: (\d+) books/ );

        if ( found ) {
            return parseInt( found[ 1 ].replace( ',', '' ), 10 );
        } else {
            return 0;
        }
    }
}

export default ResultsPaneHeader;
