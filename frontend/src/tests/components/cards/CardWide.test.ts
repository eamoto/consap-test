import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import CardWide from '../../../components/cards/CardWide.svelte';
import axios from 'axios';
import { vi } from 'vitest';
import { faker } from '@faker-js/faker';

vi.mock("axios");

describe('CardWide', () => {
    let testEndpoint: string = '/test';
    let testData: { head: string[], 'sub-head': string[], body: string[] } = {
        head: ['name'],
        'sub-head': ['postId', 'id'],
        body: ['body'],
    };

    let testDataMocked: { postId: number, id: number, name: string, email: string, body: string }[] = [];
    for (var i: number = 0; i < 500; i++) {
        testDataMocked.push({ postId: faker.number.int(), id: i + 1, name: faker.person.fullName(), email: faker.internet.email(), body: faker.lorem.paragraph() })
    }

    let fetchSuccess: () => void = (): void => {
        vi.mocked(axios, true).get.mockResolvedValueOnce({
            data: {
                data: testDataMocked,
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

        await waitFor(() => screen.getByText(testDataMocked[0].name));
        expect(screen.getByText(testDataMocked[1].body)).toBeInTheDocument();
        expect(screen.getByText('63')).toBeInTheDocument(); //?
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

        await waitFor(() => screen.getByText(testDataMocked[0].name));
        const pageSelect: HTMLSelectElement = screen.getByRole('combobox') as HTMLSelectElement;

        await fireEvent.change(pageSelect, { target: { value: '3' } });
        expect(pageSelect.value).toBe('3');
    });
});