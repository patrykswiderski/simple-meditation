import {
	View,
	ImageBackground,
	Pressable,
	ScrollView,
	Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import AFFIRMATION_GALLERY from "@/constants/affirmation-gallery";
import { GalleryPreviewData } from "@/constants/models/AffirmationCategory";
import AppGradient from "@/components/AppGradient";
import CustomButton from "@/components/CustomButton";

const AffirmationPractice = () => {
	const { itemId } = useLocalSearchParams();
	const [affirmation, setAffirmation] = useState<GalleryPreviewData>();
	const [sentences, setSentences] = useState<string[]>([]);
	const [language, setLanguage] = useState<string>("en");

	useEffect(() => {
		for (let idx = 0; idx < AFFIRMATION_GALLERY.length; idx++) {
			const affirmationData = AFFIRMATION_GALLERY[idx].data;
			const affirmationToStart = affirmationData.find(
				(a) => a.id === Number(itemId)
			);

			if (affirmationToStart) {
				setAffirmation(affirmationToStart);
				const affirmationArray =
					language === "en"
						? affirmationToStart.text.split(".")
						: affirmationToStart.text_pl.split(".");

				if (affirmationArray[affirmationArray.length - 1] === "") {
					affirmationArray.pop();
				}
				setSentences(affirmationArray);
				return;
			}
		}
	}, [itemId, language]);

	return (
		<View className="flex-1">
			<ImageBackground
				source={affirmation?.image}
				resizeMode="cover"
				className="flex-1"
			>
				<AppGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]}>
					<Pressable
						onPress={() => router.back()}
						className="absolute top-16 left-6 z-10"
					>
						<AntDesign name="leftcircleo" size={50} color="white" />
					</Pressable>

					<ScrollView className="mt-20" showsVerticalScrollIndicator={false}>
						<View className="h-full justify-center mt-10">
							<View className="h-4/5 justify-center">
								{sentences?.map((sentence, idx) => (
									<Text
										key={idx}
										className="text-white mb-12 text-3xl font-bold text-center"
									>
										{sentence}.
									</Text>
								))}
							</View>
						</View>
					</ScrollView>

					<View className="mv-5">
						<CustomButton
							title={language === "en" ? "PL" : "EN"}
							onPress={() => setLanguage(language === "en" ? "pl" : "en")}
							containerStyle="mt-4 opacity-80"
						/>
					</View>
				</AppGradient>
			</ImageBackground>
		</View>
	);
};

export default AffirmationPractice;
