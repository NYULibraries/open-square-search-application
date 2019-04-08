/* global $:false */

class Footer {
    get aboutOpenSquare() {
        return $( '.page-footer' ).$( 'a=About Open Square' );
    }

    get accessibility() {
        return $( '.page-footer' ).$( 'a*=Accessibility' );
    }

    get browse() {
        return $( '.page-footer' ).$( 'a=Browse Books' );
    }

    get home() {
        return $( 'div.osq-logo' );
    }

    get search() {
        return $( '.page-footer' ).$( 'a=Search' );
    }
}

export default Footer;
