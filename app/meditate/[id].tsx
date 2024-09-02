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
	const [secondsRemaining, setSecondsRemaining] = useState(duration);
	const [isMeditating, setIsMeditating] = useState(false);
	const [audioFile, setAudioFile] = useState<Audio.Sound>();
	const [isAudioPaused, setIsAudioPaused] = useState(false);
	const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

	useEffect(() => {
		const randomIndex = Math.floor(Math.random() * MEDITATION_DATA.length);
		setCurrentTrackIndex(randomIndex);
	}, []);

	const initializeSound = useCallback(
		async (trackIndex: number) => {
			const audioTrack = MEDITATION_DATA[trackIndex].audio;
			const { sound } = await Audio.Sound.createAsync(AUDIO_FILES[audioTrack]);

			setAudioFile(sound);

			sound.setOnPlaybackStatusUpdate(async (status) => {
				if (status.isLoaded && status.didJustFinish) {
					let nextTrackIndex = trackIndex + 1;
					if (nextTrackIndex >= MEDITATION_DATA.length) {
						nextTrackIndex = 0;
					}

					setCurrentTrackIndex(nextTrackIndex);

					const newSound = await initializeSound(nextTrackIndex);
					await newSound.playAsync();
				}
			});

			return sound;
		},
		[currentTrackIndex]
	);

	useEffect(() => {
		if (!isMeditating) {
			setSecondsRemaining(duration);
		}
	}, [duration]);

	useEffect(() => {
		let timerId: NodeJS.Timeout;

		if (secondsRemaining === 0) {
			setIsMeditating(false);
			setIsAudioPaused(false);
			setSecondsRemaining(duration);

			if (audioFile) {
				audioFile.stopAsync();
				audioFile.unloadAsync();
				setAudioFile(undefined);
			}

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
	}, [secondsRemaining, isMeditating, duration]);

	useEffect(() => {
		return () => {
			setDuration(60);
			audioFile?.unloadAsync();
		};
	}, [audioFile]);

	const pausePlayAudio = useCallback(async () => {
		const sound = audioFile
			? audioFile
			: await initializeSound(currentTrackIndex);
		const status = await sound?.getStatusAsync();

		if (status?.isLoaded && !isAudioPaused) {
			await sound?.playAsync();
			await sound?.setIsLoopingAsync(false);
			setIsAudioPaused(true);
		} else {
			await sound?.pauseAsync();
			setIsAudioPaused(false);
		}
	}, [audioFile, isAudioPaused, initializeSound, currentTrackIndex]);

	const updateMeditationStatus = useCallback(async () => {
		if (secondsRemaining === 0) {
			setSecondsRemaining(duration);
		}
		setIsMeditating(!isMeditating);

		await pausePlayAudio();
	}, [secondsRemaining, duration, pausePlayAudio]);

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
