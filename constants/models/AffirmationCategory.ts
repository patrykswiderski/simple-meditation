export interface AffirmationCategory {
	title: string;
	data: GalleryPreviewData[];
}

export interface GalleryPreviewData {
	id: number;
	image: any;
	text: string;
}
