import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Loader from '../../../components/loaders/LoaderWide.svelte';

describe('LoaderWide', () => {
    it('renders loader animation', () => {
        const { container } = render(Loader);
        const loaderAnimation = container.querySelector('.loader-animation');
        expect(loaderAnimation).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        const labelText: string = '100%';
        render(Loader, { props: { label: labelText } });
        expect(screen.getByText(labelText)).toBeInTheDocument();
    });

    it('does not render label when null', () => {
        render(Loader, { props: { label: null } });
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
        render(Loader);
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
});