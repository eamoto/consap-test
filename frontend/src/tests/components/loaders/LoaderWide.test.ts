import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Loader from '../../../components/loaders/LoaderWide.svelte';

describe('LoaderWide', () => {
    it('should render loader animation', () => {
        const { container } = render(Loader);
        const loaderAnimation = container.querySelector('.loader-animation');
        expect(loaderAnimation).toBeInTheDocument();
    });

    it('should render label when provided', () => {
        const labelText: string = '100%';
        render(Loader, { props: { label: labelText } });
        expect(screen.getByText(labelText)).toBeInTheDocument();
    });

    it('should not render label when null', () => {
        const { container } = render(Loader, { props: { label: null } });
        const loaderLabel = container.querySelector('.loader-label') as HTMLInputElement;
        expect(loaderLabel.innerHTML.trim()).toBe("");
    });

    it('should not render label when not provided', () => {
        const { container } = render(Loader);
        const loaderLabel = container.querySelector('.loader-label') as HTMLInputElement;
        expect(loaderLabel.innerHTML.trim()).toBe(""); 
    });
});