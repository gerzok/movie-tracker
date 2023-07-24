// Test Runner: https://mochajs.org
// DOM helpers: https://testing-library.com/docs/intro
// Assertions: https://unexpected.js.org/assertions/any/to-be/

const { expect } = weknowhow;
const { within, findByText, findAllByText, getAllByRole, queryAllByText, fireEvent, getByText, render, screen, toHaveStyle } = TestingLibraryDom;

beforeEach(function () {
  this.app = document.querySelector("#user-app");
});

it("Test component is mounted", function() {
  getByText(this.app, "Movies Evan Likes!");
});

it("Test movie list ", function() {
  getByText(this.app, "2001: A Space Odyssey");
  getByText(this.app, "Looper");
  getByText(this.app, "The Martian");
});

it("Test movie redirect to tomatoes page after click", function() {
  const movieLink = screen.getByText('2001: A Space Odyssey');
  const hrefAttribute = movieLink.getAttribute('href');
  expect(hrefAttribute, 'to equal', 'https://www.rottentomatoes.com/m/1000085_2001_a_space_odyssey');
});

it("test movie has released year", function() {
  getByText(this.app, "(1968)");
  getByText(this.app, "(2012)");
});

it("test movie has rating", function() {
  queryAllByText(this.app, "94%");
  queryAllByText(this.app, "93%");
  queryAllByText(this.app, "91%");
});

it('test if localStorage exist', function() {
  if (typeof localStorage === 'undefined') {
    // simulate api call
    localStorage.setItem('movies', '[]');
  }

  const hasLocalStorage = typeof localStorage !== 'undefined';
  expect(hasLocalStorage, 'to be true');
});

it("test search box", function() {
  const searchInput = screen.getByLabelText("Title contains:");
  fireEvent.change(searchInput, { target: { value: 'The Martian' } });

  expect(screen.queryByText('2001: A Space Odyssey'), 'to be null');
});

it("test decade filter", function() {
  const decadeSelectEl = screen.getByLabelText("Decade:");
  fireEvent.change(decadeSelectEl, { target: { value: '2010' } });
  expect(screen.getByText('The Martian'), 'not to be null');
});


it("test collapse accordion", () => {
  const element = screen.getByText("Arrival");
  const parentElement = element.parentElement;

  fireEvent.click(parentElement);

  const collapseContainer = element.nextElementSibling.nextElementSibling;
  const stylesFromCollapseContainer = window.getComputedStyle(collapseContainer);

  expect(stylesFromCollapseContainer.display, 'to be', 'flex');
});

it("test review poster", () => {
  const element = screen.getByText("Looper");
  const parentElement = element.parentElement;

  fireEvent.click(parentElement);

  const collapseContainer = element.nextElementSibling.nextElementSibling;
  const firstChild = collapseContainer.firstElementChild;
  const image = firstChild.querySelector('img');

  expect(image, 'to be ok');
});