import { View, Text, FlatList, Pressable, Image } from "react-native";
import React from "react";
import { GalleryPreviewData } from "@/constants/models/AffirmationCategory";
import { Link } from "expo-router";

interface GuidedAffirmationsGalleryProps {
	title: string;
	previews: GalleryPreviewData[];
}

const GuidedAffirmationsGallery = ({
	title,
	previews,
}: GuidedAffirmationsGalleryProps) => {
	return (
		<View className="my-5">
			<View className="mb-2 ">
				<Text className="text-white font-bold text-xl">{title}</Text>
			</View>
			<View className="space-y-2">
				<FlatList
					data={previews}
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<Link href={`/affirmations/${item.id}`} asChild>
							<Pressable className="min-h-min my-0 rounded-md overflow-hidden">
								<View className="h-32 w-32 mr-4">
									<Image
										source={item.image}
										resizeMode="cover"
										className="w-full h-full rounded-md"
									/>
								</View>
							</Pressable>
						</Link>
					)}
					horizontal
				/>
			</View>
		</View>
	);
};

export default GuidedAffirmationsGallery;
