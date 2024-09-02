import { Pressable, Text, View, TextInput, Modal } from "react-native";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import AppGradient from "@/components/AppGradient";
import CustomButton from "@/components/CustomButton";
import { TimerContext } from "@/context/TimerContext";

const AdjustMeditationDuration = () => {
	const { setDuration } = useContext(TimerContext);
	const [customDuration, setCustomDuration] = useState("");
	const [modalVisible, setModalVisible] = useState(false);

	const handlePress = (duration: number) => {
		setDuration(duration);
		router.back();
	};

	const handleCustomDuration = () => {
		const durationInSeconds = parseInt(customDuration, 10) * 60;
		if (!isNaN(durationInSeconds) && durationInSeconds > 0) {
			setDuration(durationInSeconds);
			setModalVisible(false);
			router.back();
		} else {
			alert("Please enter a valid number");
		}
	};

	return (
		<View className="flex-1 relative">
			<AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
				<Pressable
					onPress={() => router.back()}
					className="absolute top-8 left-6 z-10"
				>
					<AntDesign name="leftcircleo" size={50} color="white" />
				</Pressable>
				<View className="justify-center h-4/5">
					<View>
						<Text className="text-center font-bold text-3xl text-white mb-8">
							Adjust your meditation duration
						</Text>
					</View>

					<View>
						<CustomButton
							title="1 minute"
							onPress={() => handlePress(60)}
							containerStyle="mb-5"
						/>
						<CustomButton
							title="5 minutes"
							onPress={() => handlePress(5 * 60)}
							containerStyle="mb-5"
						/>
						<CustomButton
							title="10 minutes"
							onPress={() => handlePress(10 * 60)}
							containerStyle="mb-5"
						/>
						<CustomButton
							title="15 minutes"
							onPress={() => handlePress(15 * 60)}
							containerStyle="mb-5"
						/>
						<CustomButton
							title="Custom duration"
							onPress={() => setModalVisible(true)}
							containerStyle="mb-5"
						/>
					</View>
				</View>
			</AppGradient>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View className="flex-1 justify-center items-center">
					<View className="bg-white rounded-lg p-8 border border-neutral-300 shadow-xl shadow-neutral-800">
						<Text className="text-center font-bold text-2xl mb-4">
							Enter custom duration
						</Text>
						<TextInput
							value={customDuration}
							onChangeText={setCustomDuration}
							keyboardType="numeric"
							placeholder="Enter minutes"
							className="border text-center border-gray-300 rounded-lg p-2 text-lg mb-4"
						/>
						<CustomButton
							title="Set Duration"
							onPress={handleCustomDuration}
							containerStyle="bg-green-400/80 mb-4"
						/>
						<CustomButton
							title="Cancel"
							onPress={() => setModalVisible(false)}
							containerStyle="bg-red-100/80"
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default AdjustMeditationDuration;
