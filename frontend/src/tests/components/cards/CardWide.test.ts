import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import CardWide from '../../../components/cards/CardWide.svelte';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock("axios");

describe('CardWide', () => {
    let testEndpoint = '/test';
    let testData = {
        head: ['name'],
        'sub-head': ['postId', 'id'],
        body: ['body'],
    };

    let fetchSuccess = (): void => {
        vi.mocked(axios, true).get.mockResolvedValueOnce({
            data: {
                data: [
                    { postId: 1, id: 1, name: "provident id voluptas", email: "Nathan@solon.io", body: "" },
                    { postId: 1, id: 2, name: "eaque et deleniti atque tenetur ut quo ut", email: "", body: "" },
                    { postId: 2, id: 3, name: "fugit labore quia mollitia quas deserunt nostrum sunt", email: "", body: "" },
                    { postId: 2, id: 4, name: "modi ut eos dolores illum nam dolor", email: "", body: "" },
                    { postId: 3, id: 5, name: "aut inventore non pariatur sit vitae voluptatem sapiente", email: "", body: "" },
                    { postId: 4, id: 6, name: "et officiis id praesentipsa dolorem repudiandae", email: "", body: "" },
                ],
                current_page: 2,
                total_page: 63,
            }
        });
    }

    it('should render posts successfully', async () => {
        fetchSuccess();
        render(CardWide, {
            props: { endpoint: testEndpoint, data: testData },
        });

        await waitFor(() => screen.getByText('provident id voluptas'));

        expect(screen.getByText('eaque et deleniti atque tenetur ut quo ut')).toBeInTheDocument();
        expect(screen.getByText('fugit labore quia mollitia quas deserunt nostrum sunt')).toBeInTheDocument();
        expect(screen.getByText('63')).toBeInTheDocument();
    });

    it('should display an error message if API fails', async () => {
        vi.mocked(axios, true).get.mockRejectedValue({
            response: { data: { error: 'Failed to fetch posts' } },
        });

        render(CardWide, {
            props: { endpoint: testEndpoint, data: testData },
        });

        await waitFor(() => screen.getByText('Failed to fetch posts'));
        expect(screen.getByText('Failed to fetch posts')).toBeInTheDocument();
    });

    it('should update the page number on select', async () => {
        fetchSuccess();

        render(CardWide, {
            props: { endpoint: testEndpoint, data: testData },
        });

        await waitFor(() => screen.getByText('provident id voluptas'));
        const pageSelect = screen.getByRole('combobox') as HTMLSelectElement;

        await fireEvent.change(pageSelect, { target: { value: '3' } });
        expect(pageSelect.value).toBe('3');
    });
});