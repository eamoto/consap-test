import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Header from '../components/Header.svelte';

describe('Hello.svelte', () => {
  it('renders with default name', () => {
    render(Header);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('renders with a custom name', () => {
    render(Header, { props: { name: 'Eddie' } });
    expect(screen.getByText('Hello! Eddie')).toBeInTheDocument();
  });
});