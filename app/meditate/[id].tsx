import { View, Text, ImageBackground, Pressable } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Audio } from "expo-av";
import { TimerContext } from "@/context/TimerContext";
import { MEDITATION_DATA, AUDIO_FILES } from "@/constants/meditation-data";
import MEDITATION_IMAGES from "@/constants/meditation-images";
import AppGradient from "@/components/AppGradient";
import CustomButton from "@/components/CustomButton";

const Meditate = () => {
	const { id } = useLocalSearchParams();
	const { duration, setDuration } = useContext(TimerContext);
	const [secondsRemaining, setSecondsRemaining] = useState<number>(duration);
	const [isMeditating, setIsMeditating] = useState<boolean>(false);
	const [audioFile, setAudioFile] = useState<Audio.Sound | null>(null);
	const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);

	const initializeSound = useCallback(async () => {
		try {
			const audioTrack = MEDITATION_DATA[Number(id) - 1].audio;
			const { sound } = await Audio.Sound.createAsync(AUDIO_FILES[audioTrack]);
			await sound.setRateAsync(7.0, true);

			setAudioFile(sound);
			await sound.setIsLoopingAsync(true);
			return sound;
		} catch (error) {
			console.error("Error loading sound", error);
		}
	}, [id]);

	useEffect(() => {
		if (!isMeditating) {
			setSecondsRemaining(duration);
		}
	}, [duration, isMeditating]);

	useEffect(() => {
		let timerId: NodeJS.Timeout;

		if (secondsRemaining === 0) {
			const pauseAudio = async () => {
				if (audioFile) {
					await audioFile.pauseAsync();
					setIsAudioPaused(false);
				}
			};

			pauseAudio();
			setIsMeditating(false);
			setSecondsRemaining(duration);
			return;
		}

		if (isMeditating) {
			timerId = setTimeout(() => {
				setSecondsRemaining((prev) => prev - 1);
			}, 1000);
		}

		return () => {
			clearTimeout(timerId);
		};
	}, [secondsRemaining, isMeditating, duration, audioFile]);

	useEffect(() => {
		return () => {
			setDuration(60);
			audioFile?.unloadAsync();
		};
	}, [audioFile]);

	const pausePlayAudio = useCallback(async () => {
		const sound = audioFile ? audioFile : await initializeSound();
		const status = await sound?.getStatusAsync();

		if (status?.isLoaded && !isAudioPaused) {
			await sound?.playAsync();
			setIsAudioPaused(true);
		} else {
			await sound?.pauseAsync();
			setIsAudioPaused(false);
		}
	}, [audioFile, isAudioPaused, initializeSound]);

	const updateMeditationStatus = useCallback(async () => {
		setIsMeditating(!isMeditating);
		await pausePlayAudio();
	}, [isMeditating, pausePlayAudio]);

	const handleAdjustDuration = async () => {
		if (isMeditating) {
			await updateMeditationStatus();
		}
		router.push("/(modal)/adjust-meditation-duration");
	};

	const formattedTimeMinutes = String(
		Math.floor(secondsRemaining / 60)
	).padStart(2, "0");

	const formattedTimeSeconds = String(secondsRemaining % 60).padStart(2, "0");

	return (
		<View className="flex-1">
			<ImageBackground
				source={MEDITATION_IMAGES[Number(id) - 1]}
				resizeMode="cover"
				className="flex-1"
			>
				<AppGradient colors={["transparent", "rgba(0,0,0,0.8)"]}>
					<Pressable
						onPress={() => router.back()}
						className="absolute top-16 left-6 z-10"
					>
						<AntDesign name="leftcircleo" size={50} color="white" />
					</Pressable>
					<View className="flex-1 justify-center">
						<View className="mx-auto bg-neutral-200/80 rounded-full w-44 h-44 justify-center items-center">
							<Text className="text-4xl text-green-800 font-rmono">
								{formattedTimeMinutes}:{formattedTimeSeconds}
							</Text>
						</View>
					</View>
					<View className="mv-5">
						<CustomButton
							title={!isAudioPaused ? "Start" : "Pause"}
							onPress={updateMeditationStatus}
							containerStyle={
								!isAudioPaused ? "bg-green-400/80" : "bg-red-100/80"
							}
						/>
						<CustomButton
							title="Adjust duration"
							onPress={handleAdjustDuration}
							containerStyle="mt-4 opacity-80"
						/>
					</View>
				</AppGradient>
			</ImageBackground>
		</View>
	);
};
export default Meditate;
