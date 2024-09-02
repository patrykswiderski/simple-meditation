import { View, Text, ScrollView } from "react-native";
import React from "react";
import AppGradient from "@/components/AppGradient";
import GuidedAffirmationsGallery from "@/components/GuidedAffirmationsGallery";
import AFFIRMATION_GALLERY from "@/constants/affirmation-gallery";

const Affirmations = () => {
	return (
		<View className="flex-1">
			<AppGradient colors={["#2e1f58", "#54426b", "#a790af"]}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text className="text-zinc-50 text-3xl font-bold">
						Change your beliefs affirmations
					</Text>
					<View>
						{AFFIRMATION_GALLERY.map((gallery) => (
							<GuidedAffirmationsGallery
								key={gallery.title}
								title={gallery.title}
								previews={gallery.data}
							/>
						))}
					</View>
				</ScrollView>
			</AppGradient>
		</View>
	);
};

export default Affirmations;
