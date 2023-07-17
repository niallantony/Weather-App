export const searchButton = (elementId) => {
    const searchDiv = document.getElementById(elementId);
    const searchButton = searchDiv.querySelector('.search-button');
    const searchBar = searchDiv.querySelector('input')

    const showBar = () => {
        searchBar.hidden = false;
        searchDiv.classList.add('searchbar-visible');
        setTimeout(() => searchBar.setAttribute('placeholder','Where are you?'),800);
    }
    
    const hideBar = async () => {
        searchDiv.classList.remove('searchbar-visible');
        searchBar.removeAttribute('placeholder');
        setTimeout(() => searchBar.hidden = true,500);
    }

    const submitSearch = () => {
        console.log(searchBar.value);
        searchBar.value = '';
        return searchBar.value;
    }

    searchButton.addEventListener('click',(e) => {
        e.preventDefault();

        if (searchBar.hidden) {
            showBar();
        } else {
            hideBar();
            submitSearch();
        }
    })

}