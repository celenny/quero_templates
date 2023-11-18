import { render } from "@testing-library/svelte";
import Currency from '$lib/components/Currency.svelte';

it('renders correctly', () => {
  const { getByText } = render(Currency, { value: 9 })

  expect(getByText('9')).toBeInTheDocument();
})