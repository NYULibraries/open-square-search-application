/* global $:false */

class Navbar {
    get aboutOpenAccess() {
        return $( 'a=About Open Access' );
    }

    get aboutOpenSquare() {
        return $( 'a=About Open Square' );
    }

    get browse() {
        return $( 'a=Browse Books' );
    }

    get home() {
        return $( 'div.osq-logo' );
    }

    get search() {
        return $( 'a=Search' );
    }
}

export default Navbar;
