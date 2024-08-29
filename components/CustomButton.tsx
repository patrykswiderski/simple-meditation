import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface CustomButtonProps {
	title: string;
	onPress: () => void;
	textStyles?: string;
	containerStyle?: string;
}

const CustomButton = ({
	onPress,
	title,
	textStyles = "",
	containerStyle = "",
}: CustomButtonProps) => {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			className={`bg-white rounded-xl min-h-[62px] justify-center items-center ${containerStyle}`}
			onPress={onPress}
		>
			<Text className={`font-semibold text-lg ${textStyles}`}>{title}</Text>
		</TouchableOpacity>
	);
};

export default CustomButton;
