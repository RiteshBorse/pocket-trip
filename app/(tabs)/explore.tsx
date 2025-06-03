import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';

interface Message {
  text: string;
  isUser: boolean;
  id: string; // Add unique ID for better list rendering
}

export default function ExploreScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;
    
    // Generate a unique ID for the message
    const messageId = Date.now().toString();
    const userMessage: Message = { text: input, isUser: true, id: messageId };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await fetch(
        "https://api.langflow.astra.datastax.com/lf/16531e39-cb22-4025-a6ed-3a91c323004f/api/v1/run/f5f2aa6d-349e-414f-a6ba-868e72448d2f?stream=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer AstraCS:rvCdKJOqenYduJMaEQbNYpGk:a047ae6ebbb8a20a846a3e63445fb0d34045dae628e71fa24f34c999a72f4619",
          },
          body: JSON.stringify({
            input_value: input,
            output_type: "chat",
            input_type: "chat"
          }),
        }
      );
      
      let finalText = "I couldn't process that. Please try again.";
      let data;
      
      try {
        data = await response.json();
        console.log("LangFlow response:", data);
      } catch (e) {
        console.error("JSON Parse error:", e);
        finalText = "Sorry, I encountered an error parsing the response. Please try again later.";
      }
      
      if (data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text) {
        finalText = data.outputs[0].outputs[0].results.message.text;
        finalText = finalText.replace(/\*\*/g, '').trim();
      } else if (data?.outputs?.[0]?.outputs?.[0]?.results?.message?.content_blocks?.[0]?.contents?.[1]?.text) {
        finalText = data.outputs[0].outputs[0].results.message.content_blocks[0].contents[1].text;
        finalText = finalText.replace(/\*\*/g, '').trim();
      }
      
      const botResponseId = (Date.now() + 1).toString();
      const botResponse: Message = {
        text: finalText,
        isUser: false,
        id: botResponseId
      };
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      
      // Animate new message appearance
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
    } catch (error) {
      console.error("Error sending message:", error);
      const errorId = (Date.now() + 2).toString();
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again later.",
          isUser: false,
          id: errorId
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderMessage = (message: Message, index: number) => {
    return (
      <View key={message.id} style={styles.messageWrapper}>
        {!message.isUser && (
          <View style={styles.avatarContainer}>
            <IconSymbol
              name="robot"
              size={20}
              color={Colors[colorScheme ?? "light"].pocketTripAccent}
            />
          </View>
        )}
        <ThemedView
          style={[
            styles.messageBubble,
            message.isUser ? styles.userMessage : styles.botMessage,
          ]}
        >
          <ThemedText
            style={[
              styles.messageText,
              {
                color: message.isUser
                  ? "#FFFFFF"
                  : Colors[colorScheme ?? "light"].text,
              },
            ]}
          >
            {message.text}
          </ThemedText>
        </ThemedView>
        {message.isUser && (
          <View style={styles.avatarContainer}>
            <IconSymbol
              name="user"
              size={20}
              color={Colors[colorScheme ?? "light"].pocketTripAccent}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[Colors.light.background, '#f3e8ff']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <ThemedView style={styles.header}>
          <IconSymbol
            name="globe"
            size={24}
            color={Colors[colorScheme ?? "light"].pocketTripAccent}
          />
          <ThemedText
            type="title"
            style={{ color: Colors[colorScheme ?? "light"].pocketTripAccent }}
          >
            PocketTrip AI Trip Planner
          </ThemedText>
        </ThemedView>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <ThemedView style={styles.welcomeContainer}>
              <IconSymbol
                name="sparkles"
                size={50}
                color={Colors[colorScheme ?? "light"].pocketTripAccent}
                style={styles.welcomeIcon}
              />
              <ThemedText style={styles.welcomeText}>
                Welcome to PocketTrip AI! Ask me anything about planning your next
                trip.
              </ThemedText>
              <ThemedText style={styles.suggestionsTitle}>Try asking:</ThemedText>
              <ThemedView style={styles.suggestionList}>
                <Pressable 
                  style={styles.suggestionItem}
                  onPress={() => {
                    setInput("Plan a weekend trip to Paris");
                  }}
                >
                  <ThemedText>"Plan a weekend trip to Paris"</ThemedText>
                </Pressable>
                <Pressable 
                  style={styles.suggestionItem}
                  onPress={() => {
                    setInput("What should I pack for a beach vacation?");
                  }}
                >
                  <ThemedText>
                    "What should I pack for a beach vacation?"
                  </ThemedText>
                </Pressable>
                <Pressable 
                  style={styles.suggestionItem}
                  onPress={() => {
                    setInput("Find budget-friendly hotels in Tokyo");
                  }}
                >
                  <ThemedText>"Find budget-friendly hotels in Tokyo"</ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              {messages.map(renderMessage)}
            </Animated.View>
          )}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ThemedView style={[styles.messageBubble, styles.botMessage, styles.loadingBubble]}>
                <ActivityIndicator
                  size="small"
                  color={Colors[colorScheme ?? "light"].text}
                />
              </ThemedView>
            </View>
          )}
        </ScrollView>

        <ThemedView style={styles.divider} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          style={styles.keyboardAvoidView}
        >
          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  color: Colors[colorScheme ?? "light"].text,
                  backgroundColor: Colors[colorScheme ?? "light"].pocketTripPrimary,
                },
              ]}
              value={input}
              onChangeText={setInput}
              placeholder="Ask about your trip..."
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
              multiline
            />
            <Pressable
              onPress={sendMessage}
              style={({ pressed }) => [
                styles.sendButton,
                {
                  backgroundColor:
                    input.trim() === ""
                      ? Colors[colorScheme ?? "light"].icon
                      : Colors[colorScheme ?? "light"].pocketTripAccent,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              disabled={input.trim() === ""}
            >
              <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
            </Pressable>
          </ThemedView>
        </KeyboardAvoidingView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  keyboardAvoidView: {
    width: '100%',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(138, 79, 255, 0.1)',
    backgroundColor: Colors.light.pocketTripPrimary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 140 : 120, // Increased padding to make room for bottom nav
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.pocketTripPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
    maxWidth: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.light.pocketTripAccent,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.pocketTripPrimary,
    borderBottomLeftRadius: 4,
    marginRight: 'auto',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  loadingBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(138, 79, 255, 0.08)',
    marginHorizontal: 16,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: 'rgba(138, 79, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Platform.OS === 'ios' ? 60 : 50, // Added margin to move input box up above bottom nav
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(138, 79, 255, 0.3)',
    fontSize: 16,
    minHeight: 48,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  welcomeContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeIcon: {
    marginBottom: 24,
    backgroundColor: Colors.light.pocketTripPrimary,
    padding: 16,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    color: Colors.light.text,
  },
  suggestionsTitle: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  suggestionList: {
    width: "100%",
    gap: 12,
  },
  suggestionItem: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.light.pocketTripPrimary,
    borderWidth: 1,
    borderColor: 'rgba(138, 79, 255, 0.2)',
  },
});
