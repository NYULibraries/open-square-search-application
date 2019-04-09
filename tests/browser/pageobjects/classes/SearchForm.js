/* global browser:false $:false */

const SEARCH_BOX_SELECTOR = 'input#osq-searchinput';

class SearchForm {
    get searchBox() {
        return $( SEARCH_BOX_SELECTOR );
    }

    submit() {
        this.searchBox.click();
        browser.keys( '\uE006' );
    }
}

export default SearchForm;
