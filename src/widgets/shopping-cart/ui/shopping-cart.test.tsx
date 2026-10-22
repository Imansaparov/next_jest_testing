import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { makeStore } from '@/app/store';

import { ShoppingCart } from './shopping-cart';

function renderCart() {
  const store = makeStore();
  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <ShoppingCart />
    </Provider>
  );

  return { store, user };
}

describe('<ShoppingCart />', () => {
  it('renders the initial collections and totals', () => {
    renderCart();

    for (const name of [
      'Ocean Wave',
      'Forest Fern',
      'Terracotta Dot',
      'Yellow Star',
    ]) {
      expect(screen.getByRole('rowheader', { name })).toBeInTheDocument();
    }
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$13,100.00');
    expect(screen.getByTestId('cart-shipping')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('cart-grand-total')).toHaveTextContent(
      '$13,100.00'
    );
  });

  it('recalculates totals when a quantity is edited', async () => {
    const { store, user } = renderCart();
    const input = screen.getByLabelText('Ocean Wave quantity in square feet');

    await user.clear(input);
    await user.type(input, '10');

    expect(store.getState().cart.items[0]?.quantity).toBe(10);
    await waitFor(() =>
      // 10 × $28 + 75 × $30 + 200 × $26 + 50 × $29
      expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$9,180.00')
    );
  });

  it('adds one box (10 sq. ft.) with the add action', async () => {
    const { store, user } = renderCart();

    await user.click(
      screen.getByRole('button', { name: 'Add 1 box of Yellow Star' })
    );

    expect(store.getState().cart.items[3]?.quantity).toBe(60);
  });

  it('explains the actions in a tooltip on hover', async () => {
    const { user } = renderCart();

    await user.hover(
      screen.getByRole('button', { name: 'Add 1 box of Ocean Wave' })
    );

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Add 1 box (+10 sq. ft.)'
    );
  });

  it('removes items and charges shipping for small orders', async () => {
    const { user } = renderCart();

    for (const name of ['Ocean Wave', 'Forest Fern', 'Terracotta Dot']) {
      await user.click(
        screen.getByRole('button', { name: `Remove ${name} from cart` })
      );
    }

    const input = screen.getByLabelText('Yellow Star quantity in square feet');
    await user.clear(input);
    await user.type(input, '5');

    await waitFor(() =>
      expect(screen.queryByRole('rowheader', { name: 'Ocean Wave' })).toBeNull()
    );
    await waitFor(() =>
      expect(screen.getByTestId('cart-shipping')).toHaveTextContent('$25.00')
    );
    // 5 × $29 + $25 shipping
    expect(screen.getByTestId('cart-grand-total')).toHaveTextContent('$170.00');
  });

  it('adds a new collection from the menu', async () => {
    const { user } = renderCart();

    await user.click(screen.getByRole('button', { name: /add new tile/i }));
    const menu = screen.getByRole('menu');
    await user.click(
      within(menu).getByRole('menuitem', { name: /indigo dove/i })
    );

    expect(
      await screen.findByRole('rowheader', { name: 'Indigo Dove' })
    ).toBeInTheDocument();
  });
});
