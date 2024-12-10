import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import UploaderWide from '../../../components/uploaders/UploaderWide.svelte';
import axios from 'axios';

vi.mock('axios');

describe('UploadWide', () => {
    it('should render correctly and uploads file', async () => {
        const handleUploadStatus = vi.fn();
        const files: string[] = ['.csv'];
        const endpoint: string = '/upload';

        const { container } = render(UploaderWide, {
            props: { handleUploadStatus, endpoint, files }
        });

        await waitFor(() => screen.getByText("Click to upload CSV File"));

        const inputFile: HTMLInputElement = container.querySelector('input[type="file"]') as HTMLInputElement;
        vi.mocked(axios, true).post.mockResolvedValue({ data: { success: true } });

        const file: File = new File(['file content'], 'test.csv', { type: 'text/csv' });
        fireEvent.change(inputFile, { target: { files: [file] } });

        await waitFor(() => {
            expect(handleUploadStatus).toHaveBeenCalledWith(true);
            expect(axios.post).toHaveBeenCalled();
        });
    });


    it('should display an error message on upload failure', async () => {
        const handleUploadStatus = vi.fn();
        const files: string[] = ['.csv'];
        const endpoint: string = '/upload';

        const { container } = render(UploaderWide, {
            props: { handleUploadStatus, endpoint, files }
        });

        await waitFor(() => screen.getByText("Click to upload CSV File"));

        const inputFile: HTMLInputElement = container.querySelector('input[type="file"]') as HTMLInputElement;

        vi.mocked(axios, true).post.mockRejectedValue({ response: { data: { error: 'Upload failed' } } });

        const file = new File(['file content'], 'test.csv', { type: 'text/csv' });
        fireEvent.change(inputFile, { target: { files: [file] } });

        await waitFor(() => {
            expect(handleUploadStatus).not.toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalled();
        });

        expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });
});