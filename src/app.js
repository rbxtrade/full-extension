import './app.css';
import "./pages";

window.root = document.getElementById('root');

const goto = (page, data = null) => {
    console.log("goto:", page);

    localStorage.setItem('page', 'index');
    document.dispatchEvent(new CustomEvent('page', { detail: { page, data } }));
}

var newPage = localStorage.getItem('page');
if (newPage === null) {
    localStorage.setItem('page', 'index');
    newPage = 'index';
}
goto(newPage);