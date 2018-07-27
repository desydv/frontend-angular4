import { Angular4BoilerplatePage } from './app.po';

describe('angular4-boilerplate App', () => {
  let page: Angular4BoilerplatePage;

  beforeEach(() => {
    page = new Angular4BoilerplatePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
