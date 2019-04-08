/* global $:false */

class Navbar {
    get aboutOpenSquare() {
        return $( '.nav-links' ).$( 'a=About Open Square' );
    }

    get browse() {
        return $( '.nav-links' ).$( 'a=Browse Books' );
    }

    get home() {
        return $( 'div.osq-logo' );
    }

    get search() {
        return $( '.nav-links' ).$( 'a=Search' );
    }
}

export default Navbar;
