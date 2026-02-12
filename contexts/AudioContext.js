import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

const AudioContext = createContext();

const AUDIO_JSON_URL = 'https://sfcuxyeybuwiunjmrood.supabase.co/storage/v1/object/public/file/audios.json';
const AUDIO_BASE_URL = 'https://sfcuxyeybuwiunjmrood.supabase.co/storage/v1/object/public/audiofiles/';

export const AudioProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingFile, setLoadingFile] = useState(null);
  const [sections, setSections] = useState([]); // Preloaded data
  const [loadingData, setLoadingData] = useState(true); // Loading state for data
  
  // Ref to track if we are currently loading a sound to prevent race conditions
  const isLoadingSound = useRef(false);

  useEffect(() => {
    // 1. Configure audio mode
    const configureAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
            console.log('[AudioContext] Audio mode configured');
        } catch (e) {
            console.error('[AudioContext] Error configuring audio mode', e);
        }
    };
    configureAudio();

    // 2. Preload Audio Data
    const fetchAudios = async () => {
        try {
            console.log('[AudioContext] Fetching audio data...');
            const response = await fetch(`${AUDIO_JSON_URL}?t=${new Date().getTime()}`);
            const data = await response.json();
            if (data && data.sections) {
                setSections(data.sections);
            } else if (data && data.audios) {
                 // Fallback
                 // We need access to translation here if we want to localize strictly in context, 
                 // but for now we'll just pass raw data or a default title.
                 // Ideally, the screen handles localization of the 'title' if it's a key.
                 setSections([{ title: 'Selected Lectures', data: data.audios }]);
            }
            console.log('[AudioContext] Audio data loaded');
        } catch (error) {
            console.error("[AudioContext] Error fetching audios:", error);
        } finally {
            setLoadingData(false);
        }
    };
    fetchAudios();

    return () => {
      if (sound) {
        console.log('[AudioContext] Unmounting provider, unloading sound');
        sound.unloadAsync();
      }
    };
  }, []);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      // Only update position if user is NOT seeking
      if (!isSeeking) {
        setPosition(status.positionMillis || 0);
      }
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
          console.log('[AudioContext] Playback finished');
          setIsPlaying(false);
          setPosition(0);
          if (sound) {
              sound.setPositionAsync(0);
          }
      }
    } else if (status.error) {
      console.log(`[AudioContext] FATAL PLAYER ERROR: ${status.error}`);
    }
  };

  const playSound = async (audioItem) => {
    if (isLoadingSound.current) {
        console.log('[AudioContext] Already loading a sound, ignoring request');
        return;
    }

    try {
      isLoadingSound.current = true;
      setLoadingFile(audioItem.file);
      console.log(`[AudioContext] Request to play: ${audioItem.title}`);

      // CASE 1: Tapping the currently active audio
      if (currentAudio?.file === audioItem.file) {
          if (sound) {
             console.log('[AudioContext] Toggling play/pause for current audio');
             if (isPlaying) {
                 await sound.pauseAsync();
                 console.log('[AudioContext] Paused');
             } else {
                 await sound.playAsync();
                 console.log('[AudioContext] Resumed');
             }
          }
          isLoadingSound.current = false;
          setLoadingFile(null);
          return;
      }

      // CASE 2: Tapping a DIFFERENT audio or starting fresh
      // Unload generic previous sound if exists
      if (sound) {
        console.log('[AudioContext] Unloading previous sound');
        await sound.pauseAsync(); // Stop playing immediately
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
      }

      console.log('[AudioContext] Loading new sound file...');
      const { sound: newSound } = await Audio.Sound.createAsync(
         { uri: AUDIO_BASE_URL + audioItem.file },
         { shouldPlay: true },
         onPlaybackStatusUpdate
      );
      
      console.log('[AudioContext] Sound loaded successfully');
      setSound(newSound);
      setCurrentAudio(audioItem);
      // isPlaying will be set to true by onPlaybackStatusUpdate when it starts
    } catch (error) {
      console.error("[AudioContext] Error playing sound:", error);
      Alert.alert("Error", "Could not play audio file.");
    } finally {
        isLoadingSound.current = false;
        setLoadingFile(null);
    }
  };

  const handlePlayPause = async () => {
      if (sound) {
          if (isPlaying) {
              console.log('[AudioContext] Pause requested');
              await sound.pauseAsync();
          } else {
              console.log('[AudioContext] Play requested');
              await sound.playAsync();
          }
      }
  };

  const handleSeek = async (value) => {
      if (sound) {
          console.log(`[AudioContext] Seeking to ${value}ms`);
          await sound.setPositionAsync(value);
      }
      setIsSeeking(false);
  };

  const closePlayer = async () => {
      console.log('[AudioContext] Closing player');
      if (sound) {
          await sound.unloadAsync();
          setSound(null);
      }
      setCurrentAudio(null);
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
  };

  const [isSeeking, setIsSeeking] = useState(false);

  const setIsSeekingState = (seeking) => {
      setIsSeeking(seeking);
  };

  return (
    <AudioContext.Provider value={{
      sound,
      isPlaying,
      currentAudio,
      position,
      duration,
      playSound,
      handlePlayPause,
      handleSeek,
      closePlayer,
      setIsSeeking: setIsSeekingState,
      loadingFile,
      sections,
      loadingData
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
