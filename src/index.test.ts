import format from 'date-fns/format';

// jsdom seems to have an Umlaut™ issue...
jest.mock('@fullcalendar/core/locales/de', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const en = require('@fullcalendar/core/locales/en-gb');
  return en;
});

// @ts-ignore
beforeAll(() => {
  document.body.appendChild(
    Object.assign(document.createElement('div'), { id: 'mount' })
  );

  // Learn jsdom to hande `.innerText`... somehow...
  //
  // I know this is not the correct implementation,
  // but I deem this good enough for the use case.
  Object.defineProperty(HTMLHeadingElement.prototype, 'innerText', {
    get() {
      return this.textContent;
    },
    set(str = '') {
      this.textContent = String(str);
    },
  });
});

it('renders the app & redirects to the current month view', async () => {
  expect(location.pathname).toBe('/');

  await import('.');
  const date = new Date();
  const { innerHTML: html } = document.getElementById('mount')!;

  expect(location.pathname).toBe(`/calendar/${format(date, 'yyyy-MM')}/`);
  expect(html).toContain(format(date, 'MMMM yyyy'));
});
